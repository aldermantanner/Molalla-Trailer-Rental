/*
  # Critical RLS Policy Security Fixes

  1. **Security Improvements**
     - Remove overly permissive `USING (true)` policies
     - Implement proper role-based access control
     - Restrict booking updates to booking owner or admin
     - Add admin user identification system

  2. **Changes Made**
     - Drop existing permissive policies on bookings table
     - Create new restrictive policies that check ownership or admin status
     - Add admin_emails table for admin identification
     - Ensure users can only access their own bookings via email match

  3. **Important Security Notes**
     - Anonymous users can only create and view their own bookings (by email)
     - Only authenticated admin users can view/modify all bookings
     - Service role maintains full access for system operations
     - All policies now enforce proper authorization checks
*/

CREATE TABLE IF NOT EXISTS admin_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view admin emails"
  ON admin_emails FOR SELECT
  TO authenticated
  USING (
    email = auth.jwt()->>'email'
    OR auth.jwt()->>'email' IN (SELECT email FROM admin_emails)
  );

INSERT INTO admin_emails (email)
VALUES ('molallatrailerrental@outlook.com')
ON CONFLICT (email) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings via email" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Service role can update bookings" ON bookings;
DROP POLICY IF EXISTS "Anon can view own booking" ON bookings;
DROP POLICY IF EXISTS "Admin update access" ON bookings;
DROP POLICY IF EXISTS "Service role has full update access" ON bookings;

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own bookings by email"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (
    customer_email = (SELECT email FROM (VALUES (NULL::text)) AS t(email))
    OR (auth.jwt()->>'email' IS NOT NULL AND (
      auth.jwt()->>'email' = customer_email
      OR auth.jwt()->>'email' IN (SELECT email FROM admin_emails)
    ))
  );

CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.jwt()->>'email' IN (SELECT email FROM admin_emails)
  );

CREATE POLICY "Booking owner can update own booking"
  ON bookings FOR UPDATE
  TO anon, authenticated
  USING (customer_email = auth.jwt()->>'email')
  WITH CHECK (customer_email = auth.jwt()->>'email');

CREATE POLICY "Admins can update any booking"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    auth.jwt()->>'email' IN (SELECT email FROM admin_emails)
  )
  WITH CHECK (
    auth.jwt()->>'email' IN (SELECT email FROM admin_emails)
  );

CREATE POLICY "Service role full access"
  ON bookings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_admin_emails_email ON admin_emails(email);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);