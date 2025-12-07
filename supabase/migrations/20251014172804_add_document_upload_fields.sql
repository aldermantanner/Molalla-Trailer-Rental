/*
  # Add Document Upload Fields to Bookings Table

  1. Changes
    - Add `drivers_license_url` (text, nullable) - URL to uploaded driver's license document
    - Add `insurance_document_url` (text, nullable) - URL to uploaded insurance document
    - These fields are only required for trailer rental bookings
  
  2. Security
    - Fields are nullable to allow backward compatibility
    - Will be validated on the application layer for rental bookings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'drivers_license_url'
  ) THEN
    ALTER TABLE bookings ADD COLUMN drivers_license_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'insurance_document_url'
  ) THEN
    ALTER TABLE bookings ADD COLUMN insurance_document_url text;
  END IF;
END $$;