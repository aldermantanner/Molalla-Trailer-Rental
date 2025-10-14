/*
  # Fix Booking Insert Policy

  ## Changes
  - Ensure anonymous users can successfully insert bookings with all required fields
  - The policy was too restrictive and preventing valid bookings

  ## Security
  - Still validates that required customer fields are present
  - Only allows INSERT operations for anonymous users
*/

DROP POLICY IF EXISTS "Anonymous users can create bookings" ON bookings;

CREATE POLICY "Anonymous users can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (
    customer_email IS NOT NULL 
    AND customer_name IS NOT NULL 
    AND customer_phone IS NOT NULL
    AND service_type IS NOT NULL
  );
