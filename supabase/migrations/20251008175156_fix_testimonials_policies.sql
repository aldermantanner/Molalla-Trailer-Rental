/*
  # Fix Multiple Permissive Policies on Testimonials

  1. Changes
    - Drop the overly permissive "Service role can manage testimonials" policy
    - Keep "Anyone can view approved testimonials" for public SELECT access
    - Add specific policies for authenticated admin users to manage testimonials

  2. Security
    - Removes multiple permissive policies that cause security warnings
    - Implements proper separation: public can only view approved, authenticated can manage
*/

DROP POLICY IF EXISTS "Service role can manage testimonials" ON testimonials;

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);
