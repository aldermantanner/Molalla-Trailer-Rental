/*
  # Add Payment Method Field

  1. Changes
    - Add `payment_method` column to bookings table to track cash or card payments
    - This is especially useful for junk removal services where payment is collected upfront

  2. Notes
    - Field is optional (nullable) since not all bookings require this information
    - Valid values: 'cash', 'card', or null
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_method text CHECK (payment_method IN ('cash', 'card') OR payment_method IS NULL);
  END IF;
END $$;
