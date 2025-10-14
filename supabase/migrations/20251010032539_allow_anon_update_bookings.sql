/*
  # Allow Anonymous Users to Update Bookings

  1. Changes
    - Add RLS policy to allow anonymous (anon) users to update bookings
    - This is needed for customers to complete the rental agreement after creating a booking
    - The policy allows anon users to update any booking (similar to the existing authenticated policy)
  
  2. Security
    - Anonymous users can update bookings to complete rental agreements and add signatures
    - Admin authentication is still required for sensitive operations through the admin portal
*/

DROP POLICY IF EXISTS "Anonymous users can update bookings" ON bookings;

CREATE POLICY "Anonymous users can update bookings"
  ON bookings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);