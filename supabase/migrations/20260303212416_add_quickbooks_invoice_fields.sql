/*
  # Add QuickBooks Online Invoice Fields

  1. Changes
    - Add QuickBooks invoice tracking fields to bookings table:
      - `qbo_customer_id` - QuickBooks customer ID
      - `qbo_invoice_id` - QuickBooks invoice ID
      - `qbo_invoice_number` - Invoice number (DocNumber)
      - `qbo_invoice_total` - Invoice total amount
      - `qbo_invoice_balance` - Outstanding balance
      - `qbo_invoice_status` - Invoice status (e.g., "Paid", "Sent")
      - `qbo_invoice_date` - Invoice date
      - `qbo_invoice_due_date` - Invoice due date
      - `qbo_invoice_pdf_base64` - Base64 encoded PDF (for quick access)
      - `qbo_synced_at` - Timestamp when QBO data was last synced

  2. Notes
    - These fields are optional and will be populated when QuickBooks integration is active
    - Storing PDF as base64 allows quick invoice download without additional API calls
    - Existing bookings will have NULL values for these fields
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_customer_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_customer_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_invoice_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_number'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_invoice_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_total'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_invoice_total numeric(10, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_balance'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_invoice_balance numeric(10, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_status'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_invoice_status text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_invoice_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_due_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_invoice_due_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_invoice_pdf_base64'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_invoice_pdf_base64 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qbo_synced_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qbo_synced_at timestamptz;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_qbo_invoice_id ON bookings(qbo_invoice_id) WHERE qbo_invoice_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_qbo_customer_id ON bookings(qbo_customer_id) WHERE qbo_customer_id IS NOT NULL;
