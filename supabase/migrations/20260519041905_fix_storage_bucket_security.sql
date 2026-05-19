/*
  # Fix Storage Bucket Security Policies

  1. junk-removal-photos bucket
    - Restrict upload to image files only (jpg, jpeg, png, webp, gif)
    - Restrict view to authenticated users only (removes anon SELECT)

  2. booking-documents bucket
    - Restrict upload to safe file types (jpg, jpeg, png, pdf)

  Security changes:
    - Anon users can no longer view junk removal photos (privacy fix)
    - File type whitelist prevents executable/malware uploads
*/

-- ============================================================
-- JUNK REMOVAL PHOTOS
-- ============================================================

DROP POLICY IF EXISTS "Anyone can upload junk photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view junk photos" ON storage.objects;

-- Only allow image uploads
CREATE POLICY "Anon can upload junk photos with valid type"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'junk-removal-photos'
    AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
  );

-- Only authenticated users (admins) can view junk photos
CREATE POLICY "Authenticated users can view junk photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'junk-removal-photos');

-- ============================================================
-- BOOKING DOCUMENTS
-- ============================================================

DROP POLICY IF EXISTS "Allow anonymous upload during booking" ON storage.objects;

-- Only allow safe document types
CREATE POLICY "Anon can upload booking documents with valid type"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (
    bucket_id = 'booking-documents'
    AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'pdf')
  );
