/*
  # Add Rental Agreement Fields

  1. New Columns to bookings table
    - `customer_address` (text) - Customer's street address
    - `customer_city` (text) - Customer's city
    - `customer_state` (text) - Customer's state
    - `customer_zip` (text) - Customer's zip code
    - `drivers_license_number` (text) - Driver's license number
    - `drivers_license_state` (text) - State that issued license
    - `date_of_birth` (date) - Customer's date of birth
    - `insurance_carrier` (text) - Insurance company name
    - `insurance_policy_number` (text) - Policy number
    - `insurance_phone` (text) - Insurance company phone
    - `insurance_expiration` (date) - Policy expiration date
    - `pickup_time` (text) - Pickup time
    - `return_time` (text) - Return time
    - `pickup_type` (text) - Pickup or delivery
    - `return_type` (text) - Return or pickup
    - `order_deposit` (numeric) - Deposit amount
    - `terms_initials` (jsonb) - Array of initials for each terms section
    - `rental_order_signature` (text) - Base64 encoded signature for rental order
    - `rental_order_signature_date` (timestamptz) - Date signed
    - `terms_signature` (text) - Base64 encoded signature for terms
    - `terms_signature_date` (timestamptz) - Date signed
    - `trailer_details_signature` (text) - Base64 encoded signature for trailer details
    - `trailer_details_signature_date` (timestamptz) - Date signed
    - `agreement_completed` (boolean) - Whether all agreement sections are signed

  2. Security
    - Maintain existing RLS policies
*/

-- Add customer information fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'customer_address'
  ) THEN
    ALTER TABLE bookings ADD COLUMN customer_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'customer_city'
  ) THEN
    ALTER TABLE bookings ADD COLUMN customer_city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'customer_state'
  ) THEN
    ALTER TABLE bookings ADD COLUMN customer_state text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'customer_zip'
  ) THEN
    ALTER TABLE bookings ADD COLUMN customer_zip text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'drivers_license_number'
  ) THEN
    ALTER TABLE bookings ADD COLUMN drivers_license_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'drivers_license_state'
  ) THEN
    ALTER TABLE bookings ADD COLUMN drivers_license_state text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE bookings ADD COLUMN date_of_birth date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'insurance_carrier'
  ) THEN
    ALTER TABLE bookings ADD COLUMN insurance_carrier text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'insurance_policy_number'
  ) THEN
    ALTER TABLE bookings ADD COLUMN insurance_policy_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'insurance_phone'
  ) THEN
    ALTER TABLE bookings ADD COLUMN insurance_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'insurance_expiration'
  ) THEN
    ALTER TABLE bookings ADD COLUMN insurance_expiration date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'pickup_time'
  ) THEN
    ALTER TABLE bookings ADD COLUMN pickup_time text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'return_time'
  ) THEN
    ALTER TABLE bookings ADD COLUMN return_time text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'pickup_type'
  ) THEN
    ALTER TABLE bookings ADD COLUMN pickup_type text DEFAULT 'pickup';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'return_type'
  ) THEN
    ALTER TABLE bookings ADD COLUMN return_type text DEFAULT 'return';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'order_deposit'
  ) THEN
    ALTER TABLE bookings ADD COLUMN order_deposit numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'terms_initials'
  ) THEN
    ALTER TABLE bookings ADD COLUMN terms_initials jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'rental_order_signature'
  ) THEN
    ALTER TABLE bookings ADD COLUMN rental_order_signature text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'rental_order_signature_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN rental_order_signature_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'terms_signature'
  ) THEN
    ALTER TABLE bookings ADD COLUMN terms_signature text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'terms_signature_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN terms_signature_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'trailer_details_signature'
  ) THEN
    ALTER TABLE bookings ADD COLUMN trailer_details_signature text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'trailer_details_signature_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN trailer_details_signature_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'agreement_completed'
  ) THEN
    ALTER TABLE bookings ADD COLUMN agreement_completed boolean DEFAULT false;
  END IF;
END $$;