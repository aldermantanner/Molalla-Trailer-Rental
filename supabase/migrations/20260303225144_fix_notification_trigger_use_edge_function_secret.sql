/*
  # Fix Notification Trigger to Use Edge Function Secret

  1. Problem
    - Trigger tries to use vault secret that doesn't exist
    - Edge function secrets are stored separately, not in vault
    
  2. Solution
    - Update trigger to call edge function without auth header
    - Edge function will use its own RESEND_API_KEY from edge function secrets
    - Simpler and works with existing secret setup
    
  3. Security
    - Edge function has CORS and handles its own authentication
    - No need to pass service role key through database
*/

CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  function_url text;
BEGIN
  -- Hardcode the Supabase URL
  function_url := 'https://hwthgbbckcowdqoxvbsx.supabase.co/functions/v1/send-booking-notification';
  
  -- Send notification without auth - edge function will handle it
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
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

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to send email notification: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;