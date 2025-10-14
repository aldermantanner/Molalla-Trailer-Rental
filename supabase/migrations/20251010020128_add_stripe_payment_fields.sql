/*
  # Add Stripe Payment Fields to Bookings Table

  1. Changes
    - Add `payment_status` column (enum: unpaid, paid, refunded)
    - Add `stripe_session_id` column to track Stripe checkout sessions
    - Add `stripe_payment_intent` column to track payment intents
    - Set default payment_status to 'unpaid'

  2. Security
    - No changes to RLS policies needed
    - Fields are part of existing bookings table with existing policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum'
  ) THEN
    CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'paid', 'refunded');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_status payment_status_enum DEFAULT 'unpaid';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'stripe_session_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN stripe_session_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'stripe_payment_intent'
  ) THEN
    ALTER TABLE bookings ADD COLUMN stripe_payment_intent text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);