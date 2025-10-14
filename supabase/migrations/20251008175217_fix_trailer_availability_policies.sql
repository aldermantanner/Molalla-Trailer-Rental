/*
  # Fix Multiple Permissive Policies on Trailer Availability

  1. Changes
    - Drop duplicate SELECT policy "Anyone can view availability" (anon role)
    - Keep "Anyone can view trailer availability" (public role) which covers both anon and authenticated
    - This eliminates the multiple permissive policies warning

  2. Security
    - Maintains public read access through single policy
    - Keeps authenticated user management policies separate
*/

DROP POLICY IF EXISTS "Anyone can view availability" ON trailer_availability;
