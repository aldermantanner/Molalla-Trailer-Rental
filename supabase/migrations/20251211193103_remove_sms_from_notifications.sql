/*
  # Remove SMS/Twilio from Booking Notifications

  1. Changes
    - Updates `notify_new_booking` function to only send email notifications
    - Removes SMS notification calls to discontinued send-sms-notification function
    - Keeps email notifications via send-booking-notification function

  2. Security
    - Maintains SECURITY DEFINER for proper authorization
    - Error handling remains intact for resilient notification delivery
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

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to send email notification: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
