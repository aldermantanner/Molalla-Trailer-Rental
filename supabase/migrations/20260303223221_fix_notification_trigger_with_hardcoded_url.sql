/*
  # Fix Notification Trigger to Use Direct URL

  1. Changes
    - Updates `notify_new_booking` function to use hardcoded Supabase URL
    - Uses Supabase vault for service role key storage
    - Ensures notifications are actually sent instead of being silently skipped

  2. Security
    - Service role key retrieved from secure vault
    - Maintains SECURITY DEFINER for proper authorization
*/

CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
DECLARE
  function_url text;
  service_role_key text;
BEGIN
  -- Hardcode the Supabase URL since it's not sensitive
  function_url := 'https://hwthgbbckcowdqoxvbsx.supabase.co/functions/v1/send-booking-notification';
  
  -- Try to get service role key from vault, fallback to environment
  BEGIN
    service_role_key := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1);
  EXCEPTION WHEN OTHERS THEN
    -- If vault doesn't exist or secret not found, try current_setting
    service_role_key := current_setting('app.settings.service_role_key', true);
  END;

  -- If still no key, log warning and skip
  IF service_role_key IS NULL THEN
    RAISE WARNING 'Service role key not found, skipping email notification';
    RETURN NEW;
  END IF;

  -- Send email notification
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

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to send email notification: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
