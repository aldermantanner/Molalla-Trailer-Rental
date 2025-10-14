/*
  # Add Trailer Selection Field

  1. Changes to bookings table
    - `trailer_type` (text) - Selected trailer model with default value
    
  2. Notes
    - Allows customers to select between two trailer options
    - Default set to Southland 7x14 14k for existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'trailer_type'
  ) THEN
    ALTER TABLE bookings ADD COLUMN trailer_type text DEFAULT 'Southland 7x14 14k';
  END IF;
END $$;