/*
  # Add Booking Notification Trigger

  1. New Functions
    - `notify_new_booking` - Trigger function that sends notifications when a new booking is created
    - Calls edge functions for email and SMS notifications

  2. Triggers
    - `on_booking_created` - Fires after insert on bookings table
    - Automatically sends notifications to admin

  3. Notes
    - Uses Supabase edge functions for email and SMS delivery
    - Notifications are sent asynchronously
    - Errors in notification delivery won't prevent booking creation
*/

CREATE OR REPLACE FUNCTION notify_new_booking()
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_booking_created ON bookings;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_booking();
