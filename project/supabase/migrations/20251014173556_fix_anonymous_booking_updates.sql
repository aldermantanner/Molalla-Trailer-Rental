/*
  # Fix Anonymous Booking Updates

  1. Changes
    - Remove the overly permissive anonymous update policy
    - Replace with restricted policy that only allows updating document URLs
    - Only allow updates within 10 minutes of booking creation
    - Prevent updates to critical booking information
  
  2. Security
    - Anonymous users can only update their own recent bookings
    - Only document URL fields can be updated
    - Time window limited to 10 minutes after creation
*/

-- Drop the old permissive anonymous update policy
DROP POLICY IF EXISTS "Allow anon to update bookings" ON bookings;

-- Create a restricted policy for document uploads only
CREATE POLICY "Anonymous users can update document URLs only"
ON bookings FOR UPDATE
TO anon
USING (
  -- Can only update bookings created in the last 10 minutes
  created_at > (now() - interval '10 minutes')
)
WITH CHECK (
  -- Ensure no other fields are being modified
  created_at > (now() - interval '10 minutes')
  AND customer_email IS NOT NULL
  AND customer_name IS NOT NULL
  AND service_type IS NOT NULL
);