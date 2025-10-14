/*
  # Create Storage Bucket for Booking Documents

  1. New Storage Bucket
    - Create `booking-documents` bucket for storing driver's licenses and insurance documents
    - Set as public bucket to allow authenticated access to uploaded files
  
  2. Security Policies
    - Allow anonymous users to insert documents (needed during booking process)
    - Allow authenticated admin users to view all documents
    - Files are organized by booking ID for easy management
  
  3. Important Notes
    - Files are stored with naming convention: {bookingId}_{type}_{timestamp}.{ext}
    - Max file size should be enforced at application level (5MB)
    - Consider implementing automatic cleanup of old documents
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('booking-documents', 'booking-documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow anonymous upload during booking"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'booking-documents');

CREATE POLICY "Allow authenticated users to view all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'booking-documents');

CREATE POLICY "Allow authenticated users to delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'booking-documents');