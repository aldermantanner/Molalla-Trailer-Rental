/*
  # Grant pg_net Permissions and Enable Notifications
  
  1. Problem
    - pg_net extension enabled but trigger may lack permissions
    - Need to ensure proper access to net schema
    
  2. Solution
    - Grant all necessary permissions for pg_net
    - Add helper function to test notifications
    
  3. Testing
    - Includes test function to manually trigger notification
*/

-- Ensure net schema permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA net TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA net TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA net TO postgres, service_role;

-- Grant execute on http_post to the roles that need it
GRANT EXECUTE ON FUNCTION net.http_post TO postgres, service_role;

-- Update the notification function with better error handling
CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  function_url text;
  request_id bigint;
BEGIN
  -- Hardcode the Supabase URL
  function_url := 'https://hwthgbbckcowdqoxvbsx.supabase.co/functions/v1/send-booking-notification';
  
  -- Log the attempt
  RAISE LOG 'Attempting to send notification for booking %', NEW.id;
  
  -- Send async notification using pg_net
  SELECT net.http_post(
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
  ) INTO request_id;

  RAISE LOG 'Booking notification queued with request_id: %', request_id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the full error for debugging
  RAISE WARNING 'Failed to queue email notification for booking %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a test function to manually trigger a notification for testing
CREATE OR REPLACE FUNCTION test_booking_notification(booking_id_param uuid)
RETURNS jsonb AS $$
DECLARE
  booking_record record;
  function_url text;
  request_id bigint;
BEGIN
  -- Get the booking
  SELECT * INTO booking_record FROM bookings WHERE id = booking_id_param;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Booking not found');
  END IF;
  
  function_url := 'https://hwthgbbckcowdqoxvbsx.supabase.co/functions/v1/send-booking-notification';
  
  -- Send the notification
  SELECT net.http_post(
    url := function_url,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'booking_id', booking_record.id,
      'customer_name', booking_record.customer_name,
      'customer_email', booking_record.customer_email,
      'customer_phone', booking_record.customer_phone,
      'service_type', booking_record.service_type,
      'start_date', booking_record.start_date,
      'end_date', booking_record.end_date,
      'delivery_address', booking_record.delivery_address,
      'total_price', booking_record.total_price,
      'trailer_type', booking_record.trailer_type
    )
  ) INTO request_id;
  
  RETURN jsonb_build_object(
    'success', true, 
    'request_id', request_id,
    'message', 'Notification queued successfully'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'sqlstate', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;