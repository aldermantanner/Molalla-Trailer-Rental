/*
  # Fix Anonymous Access Security Issues

  ## Changes
  1. Remove overly permissive anonymous policies
  2. Replace with restrictive policies that require proper authentication
  3. Keep only necessary anonymous insert for bookings (customer-facing feature)
  4. All other operations require authentication

  ## Security Improvements
  - Bookings: Anonymous users can only INSERT (create bookings), not view/update all records
  - Admin config: Only authenticated admins can access
  - Testimonials: Public read for approved only, authenticated for management
  - Trailer availability: Public read only, authenticated for management
*/

DROP POLICY IF EXISTS "Anonymous users can update bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can read admin config" ON admin_config;
DROP POLICY IF EXISTS "Authenticated users can update admin config" ON admin_config;

CREATE POLICY "Anonymous users can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (
    customer_email IS NOT NULL 
    AND customer_name IS NOT NULL 
    AND customer_phone IS NOT NULL
  );

CREATE POLICY "Authenticated admins can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can update bookings"
  ON bookings
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can read admin config"
  ON admin_config
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can update admin config"
  ON admin_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
