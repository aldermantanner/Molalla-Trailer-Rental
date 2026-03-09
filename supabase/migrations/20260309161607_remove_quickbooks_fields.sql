/*
  # Remove QuickBooks Integration Fields

  1. Changes
    - Remove all QuickBooks-related columns from bookings table:
      - qbo_customer_id
      - qbo_invoice_id
      - qbo_invoice_number
      - qbo_invoice_total
      - qbo_invoice_balance
      - qbo_invoice_status
      - qbo_invoice_date
      - qbo_invoice_due_date
      - qbo_invoice_pdf_base64
      - qbo_payment_url
      - qbo_synced_at

  2. Notes
    - Prepares system for Jobber integration
    - Safely drops columns if they exist
*/

DO $$
BEGIN
  -- Remove QuickBooks customer ID
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_customer_id'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_customer_id;
  END IF;

  -- Remove QuickBooks invoice ID
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_id'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_invoice_id;
  END IF;

  -- Remove QuickBooks invoice number
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_number'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_invoice_number;
  END IF;

  -- Remove QuickBooks invoice total
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_total'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_invoice_total;
  END IF;

  -- Remove QuickBooks invoice balance
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_balance'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_invoice_balance;
  END IF;

  -- Remove QuickBooks invoice status
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_status'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_invoice_status;
  END IF;

  -- Remove QuickBooks invoice date
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_date'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_invoice_date;
  END IF;

  -- Remove QuickBooks invoice due date
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_due_date'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_invoice_due_date;
  END IF;

  -- Remove QuickBooks invoice PDF base64
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_pdf_base64'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_invoice_pdf_base64;
  END IF;

  -- Remove QuickBooks payment URL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_payment_url'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_payment_url;
  END IF;

  -- Remove QuickBooks synced at timestamp
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_synced_at'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qbo_synced_at;
  END IF;
END $$;