/*
  # Remove Stripe Payment Integration

  1. Changes
    - Drop stripe_session_id column from bookings table
    - Drop stripe_payment_intent column from bookings table
    - Drop related indexes
    - Keep payment_status and payment_status_enum as they can be used for other payment methods

  2. Notes
    - We retain payment_status field as it's useful for tracking any payment method
    - Stripe-specific fields are removed
*/

DROP INDEX IF EXISTS idx_bookings_stripe_session_id;
ALTER TABLE bookings DROP COLUMN IF EXISTS stripe_session_id;
ALTER TABLE bookings DROP COLUMN IF EXISTS stripe_payment_intent;
