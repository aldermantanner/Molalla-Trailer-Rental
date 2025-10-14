/*
  # Add Delivery Fee and Deposit Fields

  1. Changes
    - Add `delivery_fee` column to bookings table (decimal)
    - Add `deposit_amount` column to bookings table (decimal)
    - Add `deposit_refunded` column to bookings table (boolean, default false)
    - Add `deposit_refund_amount` column to bookings table (decimal)
    - Add `stripe_refund_id` column to bookings table (text)
    - Add `cancellation_requested_at` column to bookings table (timestamptz)
    - Add `refund_amount` column to bookings table (decimal)

  2. Notes
    - All financial fields use decimal type for precision
    - Deposit refund tracking allows partial refunds
    - Tracks both booking refunds and deposit refunds separately
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'delivery_fee'
  ) THEN
    ALTER TABLE bookings ADD COLUMN delivery_fee decimal(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'deposit_amount'
  ) THEN
    ALTER TABLE bookings ADD COLUMN deposit_amount decimal(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'deposit_refunded'
  ) THEN
    ALTER TABLE bookings ADD COLUMN deposit_refunded boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'deposit_refund_amount'
  ) THEN
    ALTER TABLE bookings ADD COLUMN deposit_refund_amount decimal(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'stripe_refund_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN stripe_refund_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cancellation_requested_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN cancellation_requested_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'refund_amount'
  ) THEN
    ALTER TABLE bookings ADD COLUMN refund_amount decimal(10,2) DEFAULT 0;
  END IF;
END $$;