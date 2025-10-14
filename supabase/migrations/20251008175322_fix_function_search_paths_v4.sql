/*
  # Fix Function Search Path Mutability Issues

  1. Changes
    - Drop existing functions with CASCADE and recreate with `SET search_path = public, pg_temp`
    - Recreate triggers that depend on the functions
    - This prevents search path manipulation attacks
    - Affects: update_availability_for_range, get_available_trailers_for_date, 
              notify_new_booking, update_updated_at_column

  2. Security
    - Prevents malicious schema injection attacks
    - Ensures functions always use the correct schema
    - Sets immutable search path for each function
*/

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at
    BEFORE UPDATE ON trailer_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP FUNCTION IF EXISTS get_available_trailers_for_date(date);
CREATE FUNCTION get_available_trailers_for_date(check_date date)
RETURNS TABLE(trailer_id uuid, available_count integer) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ta.trailer_id,
    ta.available_count
  FROM trailer_availability ta
  WHERE ta.date = check_date;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

DROP FUNCTION IF EXISTS update_availability_for_range(uuid, date, date, integer);
CREATE FUNCTION update_availability_for_range(
  p_trailer_id uuid,
  p_start_date date,
  p_end_date date,
  p_change integer
)
RETURNS void AS $$
DECLARE
  curr_date date;
BEGIN
  curr_date := p_start_date;
  
  WHILE curr_date <= p_end_date LOOP
    INSERT INTO trailer_availability (trailer_id, date, available_count)
    VALUES (p_trailer_id, curr_date, 2 + p_change)
    ON CONFLICT (trailer_id, date)
    DO UPDATE SET available_count = GREATEST(0, trailer_availability.available_count + p_change);
    
    curr_date := curr_date + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

DROP FUNCTION IF EXISTS notify_new_booking() CASCADE;
CREATE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  function_url text;
  service_role_key text;
  supabase_url text;
BEGIN
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);

  IF supabase_url IS NULL OR service_role_key IS NULL THEN
    RAISE WARNING 'Supabase configuration not found, skipping notifications';
    RETURN NEW;
  END IF;

  function_url := supabase_url || '/functions/v1/send-booking-notification';

  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := jsonb_build_object(
      'booking_id', NEW.id,
      'customer_name', NEW.customer_name,
      'customer_email', NEW.customer_email,
      'customer_phone', NEW.customer_phone,
      'service_type', NEW.service_type,
      'start_date', NEW.start_date,
      'end_date', NEW.end_date,
      'delivery_address', NEW.delivery_address,
      'total_price', NEW.total_price,
      'trailer_type', NEW.trailer_type
    )
  );

  function_url := supabase_url || '/functions/v1/send-sms-notification';

  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := jsonb_build_object(
      'booking_id', NEW.id,
      'customer_name', NEW.customer_name,
      'customer_phone', NEW.customer_phone,
      'service_type', NEW.service_type,
      'start_date', NEW.start_date
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to send notifications: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_booking();
