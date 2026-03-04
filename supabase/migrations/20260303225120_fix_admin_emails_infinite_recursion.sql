/*
  # Fix Admin Emails Infinite Recursion

  1. Problem
    - The admin_emails RLS policy has infinite recursion
    - Policy checks "email IN (SELECT email FROM admin_emails)"
    - This causes the query to recursively call itself
    
  2. Solution
    - Remove the circular reference from admin_emails policy
    - Allow admins to view their own email only (self-reference)
    - Admin validation should happen in other tables, not in admin_emails itself
    
  3. Security
    - Admins can only see their own email in admin_emails table
    - This prevents the infinite loop while maintaining security
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Only admins can view admin emails" ON admin_emails;

-- Create a simple policy without circular reference
CREATE POLICY "Admins can view own email"
  ON admin_emails
  FOR SELECT
  TO authenticated
  USING (
    email = ((SELECT auth.jwt()) ->> 'email'::text)
  );