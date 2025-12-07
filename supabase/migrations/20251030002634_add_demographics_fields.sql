/*
  # Add Demographics and Admin Booking Fields

  1. Changes
    - Add date_of_birth field
    - Add drivers_license_number field
    - Add address, city, state, zip_code fields
    - Add emergency_contact_name and emergency_contact_phone fields
    - Add created_by_admin flag to track admin-created bookings

  2. Notes
    - All new fields are optional (nullable)
    - Existing bookings remain unaffected
    - Demographics improve record keeping and customer service
*/

-- Add demographic fields to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS drivers_license_number text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS emergency_contact_name text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS emergency_contact_phone text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS created_by_admin boolean DEFAULT false;

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_bookings_created_by_admin ON bookings(created_by_admin);
CREATE INDEX IF NOT EXISTS idx_bookings_drivers_license ON bookings(drivers_license_number) WHERE drivers_license_number IS NOT NULL;
