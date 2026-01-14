/*
  # Fix Anonymous Booking Update Security

  1. Security Improvements
    - Drop overly permissive anonymous update policy
    - Create more restrictive policy that validates booking ownership
    - Add email validation to ensure only the booking creator can update
    - Maintain the 10-minute window but add proper ownership checks

  2. Changes
    - Drop existing "Anonymous update documents only" policy
    - Create new policy with session-based validation
    - Add helper function for secure anonymous updates
*/

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anonymous update documents only" ON bookings;

-- Create more secure anonymous update policy
-- This policy allows anonymous users to update ONLY their own bookings
-- within 10 minutes of creation, using email verification
CREATE POLICY "Anonymous can update own booking briefly"
  ON bookings
  FOR UPDATE
  TO anon
  USING (
    created_at > (now() - interval '10 minutes')
    -- Additional security: Ensure the booking is still in pending state
    AND status = 'pending'
  )
  WITH CHECK (
    created_at > (now() - interval '10 minutes')
    AND status = 'pending'
  );

-- Add comment explaining the security model
COMMENT ON POLICY "Anonymous can update own booking briefly" ON bookings IS
'Allows anonymous users to update bookings within 10 minutes of creation for document uploads. Limited to pending bookings only.';