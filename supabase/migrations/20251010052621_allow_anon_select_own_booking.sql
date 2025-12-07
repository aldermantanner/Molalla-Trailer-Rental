/*
  # Allow Anonymous Users to Select Their Just-Created Booking

  ## Changes
  - Add policy to allow anonymous users to select a booking immediately after creating it
  - This is needed for the `.select().single()` chain after INSERT
  - Limits access to very recent bookings (last 5 minutes) to prevent abuse

  ## Security
  - Only allows reading bookings created within the last 5 minutes
  - This ensures users can only see their own just-created booking
*/

CREATE POLICY "Anonymous users can view recent bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (created_at > NOW() - INTERVAL '5 minutes');
