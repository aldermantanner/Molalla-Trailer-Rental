/*
  # Fix Testimonials Admin Policies

  Problem: The existing INSERT/UPDATE/DELETE policies checked if the user's
  email exists in auth.users — which is always true for any logged-in user.
  This meant any authenticated user could manage testimonials, not just admins.

  Fix: Replace those policies to check the admin_emails table instead, so only
  real admin users can insert, update, or delete testimonials.

  Changes:
    - Drop and recreate INSERT, UPDATE, DELETE policies on testimonials
    - Each policy now checks: EXISTS (SELECT 1 FROM admin_emails WHERE email = jwt email)
    - SELECT policy (anyone can view approved testimonials) is unchanged
*/

-- Drop the broken policies
DROP POLICY IF EXISTS "Admin users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can delete testimonials" ON testimonials;

-- Correct INSERT: only admin emails
CREATE POLICY "Admin users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT auth.jwt() ->> 'email')
    )
  );

-- Correct UPDATE: only admin emails
CREATE POLICY "Admin users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT auth.jwt() ->> 'email')
    )
  );

-- Correct DELETE: only admin emails
CREATE POLICY "Admin users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_emails
      WHERE email = (SELECT auth.jwt() ->> 'email')
    )
  );
