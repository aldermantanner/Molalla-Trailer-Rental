/*
  # Add Status Change Notification Trigger

  1. Changes
    - Create function to call notification edge function
    - Create trigger on bookings table for status updates
    - Sends email to customer when status changes

  2. Notes
    - Only triggers on status changes (not other field updates)
    - Calls send-status-notification edge function
    - Runs asynchronously to avoid blocking updates
*/

-- Create function to send status notification
CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supabase_url text;
  service_role_key text;
BEGIN
  -- Only proceed if status actually changed
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    -- Get Supabase URL and service role key from environment
    supabase_url := current_setting('app.settings.supabase_url', true);
    service_role_key := current_setting('app.settings.service_role_key', true);

    -- Make async call to edge function using pg_net extension
    -- Note: This requires pg_net extension to be enabled
    PERFORM net.http_post(
      url := supabase_url || '/functions/v1/send-status-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'customerEmail', NEW.customer_email,
        'customerName', NEW.customer_name,
        'bookingId', NEW.id,
        'status', NEW.status,
        'startDate', NEW.start_date,
        'endDate', NEW.end_date,
        'totalPrice', NEW.total_price
      )
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the update
    RAISE WARNING 'Failed to send notification: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_booking_status_change ON bookings;

-- Create trigger for status changes
CREATE TRIGGER on_booking_status_change
  AFTER UPDATE ON bookings
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_status_change();

-- Add comment
COMMENT ON TRIGGER on_booking_status_change ON bookings IS
  'Sends email notification to customer when booking status changes';
