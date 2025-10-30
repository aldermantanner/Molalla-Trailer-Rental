/*
  # Create Email Captures Table for Lead Generation

  1. New Tables
    - `email_captures`
      - `id` (uuid, primary key)
      - `email` (text, email address)
      - `source` (text, where the email was captured)
      - `captured_at` (timestamptz, when captured)
      - `created_at` (timestamptz, record creation)

  2. Security
    - Enable RLS on `email_captures` table
    - Add policy for anonymous users to insert email captures
    - Add policy for authenticated admins to view all captures

  3. Notes
    - Used for lead generation and abandoned cart recovery
    - Anonymous users can insert for early engagement
    - Admins can view for follow-up campaigns
*/

-- Create email_captures table
CREATE TABLE IF NOT EXISTS email_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'unknown',
  captured_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

-- Create index on email for lookups
CREATE INDEX IF NOT EXISTS idx_email_captures_email ON email_captures(email);

-- Create index on captured_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_email_captures_captured_at ON email_captures(captured_at DESC);

-- Policy: Allow anonymous users to insert email captures
CREATE POLICY "Allow anonymous email capture"
  ON email_captures
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to view all email captures
CREATE POLICY "Allow authenticated users to view email captures"
  ON email_captures
  FOR SELECT
  TO authenticated
  USING (true);
