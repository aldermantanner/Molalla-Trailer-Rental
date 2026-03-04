/*
  # Add QuickBooks Payment URL Field

  1. Changes
    - Add `qbo_payment_url` field to bookings table to store the QuickBooks-hosted payment link
    - This allows customers to pay invoices directly through QuickBooks Payment Portal
  
  2. Purpose
    - When a booking is confirmed and invoice created, store the payment URL
    - Admin can easily share payment link with customers
    - Automated emails can include the payment link for easy customer access
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_payment_url'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_payment_url TEXT;
  END IF;
END $$;