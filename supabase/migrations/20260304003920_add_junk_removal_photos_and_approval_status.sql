/*
  # Add Junk Removal Photos and Approval Status

  1. Changes
    - Add `junk_photo_urls` JSONB field to store array of photo URLs for junk removal bookings
    - Add `awaiting_approval` status for junk removal bookings that need admin review
    - Add `approval_notes` text field for admin to add notes during approval/rejection

  2. Purpose
    - Allow customers to upload photos of items for junk removal
    - Enable approval workflow where admin reviews photos and either approves or rejects
    - Store admin feedback for rejected bookings
*/

-- Add junk_photo_urls column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'junk_photo_urls'
  ) THEN
    ALTER TABLE bookings ADD COLUMN junk_photo_urls JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add approval_notes column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'approval_notes'
  ) THEN
    ALTER TABLE bookings ADD COLUMN approval_notes text DEFAULT '';
  END IF;
END $$;

-- Update status constraint to include awaiting_approval
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'awaiting_approval', 'confirmed', 'active_rental', 'completed', 'cancelled'));

-- Create storage bucket for junk removal photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('junk-removal-photos', 'junk-removal-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for junk removal photos
DROP POLICY IF EXISTS "Anyone can upload junk photos" ON storage.objects;
CREATE POLICY "Anyone can upload junk photos"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'junk-removal-photos');

DROP POLICY IF EXISTS "Anyone can view junk photos" ON storage.objects;
CREATE POLICY "Anyone can view junk photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'junk-removal-photos');

DROP POLICY IF EXISTS "Authenticated users can delete junk photos" ON storage.objects;
CREATE POLICY "Authenticated users can delete junk photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'junk-removal-photos');