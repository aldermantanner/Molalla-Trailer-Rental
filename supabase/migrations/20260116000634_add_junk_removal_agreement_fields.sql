/*
  # Add Junk Removal Agreement Fields
  
  1. New Fields
    - `junk_agreement_signature` (text) - Stores the signature data for junk removal agreement
    - `junk_agreement_date` (timestamptz) - Date when the junk removal agreement was signed
  
  2. Changes
    - Add two new fields to the bookings table to track junk removal agreement signatures
    - These fields are specific to "You Fill, We Dump" junk removal service
  
  3. Notes
    - These fields are optional and only used for junk removal bookings with "you_fill" service level
    - The signature is stored as a base64 encoded data URL
*/

-- Add junk removal agreement fields to bookings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'junk_agreement_signature'
  ) THEN
    ALTER TABLE bookings ADD COLUMN junk_agreement_signature TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'junk_agreement_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN junk_agreement_date TIMESTAMPTZ;
  END IF;
END $$;
