/*
  # Fix Notification System - Enable HTTP Extension
  
  1. Problem
    - Database trigger uses net.http_post but pg_net extension is not enabled
    - This causes notifications to fail silently
    
  2. Solution
    - Enable pg_net extension for making HTTP requests from database
    - Verify trigger function exists and is properly configured
    
  3. Security
    - pg_net is a Supabase-provided extension for async HTTP
    - Safer than http extension
    - Maintains SECURITY DEFINER for proper authorization
*/

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;

-- Recreate the notification function to use pg_net correctly
CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  function_url text;
  request_id bigint;
BEGIN
  -- Hardcode the Supabase URL
  function_url := 'https://hwthgbbckcowdqoxvbsx.supabase.co/functions/v1/send-booking-notification';
  
  -- Send async notification using pg_net
  SELECT INTO request_id net.http_post(
    url := function_url,
    headers := '{"Content-Type": "application/json"}'::jsonb,
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

  RAISE LOG 'Booking notification queued with request_id: %', request_id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to queue email notification: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists on bookings table
DROP TRIGGER IF EXISTS on_booking_created ON bookings;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_booking();