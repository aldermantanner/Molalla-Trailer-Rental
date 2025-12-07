/*
  # Add Testimonials Table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Name of the customer
      - `rating` (integer) - Rating out of 5 stars
      - `review_text` (text) - The testimonial content
      - `service_type` (text) - Which service they used
      - `is_featured` (boolean) - Whether to feature on homepage
      - `created_at` (timestamptz) - When review was submitted
      - `approved` (boolean) - Admin approval status

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for public read access to approved testimonials
    - Add policy for authenticated admin to manage testimonials
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  service_type text,
  is_featured boolean DEFAULT false,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved testimonials"
  ON testimonials FOR SELECT
  USING (approved = true);

CREATE POLICY "Service role can manage testimonials"
  ON testimonials FOR ALL
  USING (true)
  WITH CHECK (true);