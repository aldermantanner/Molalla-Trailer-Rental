/*
  # Add Active Rental Status

  1. Changes
    - Drop existing status check constraint
    - Add new status check constraint including 'active' status
    - 'active' status represents when customer currently has the trailer

  2. Status Flow
    - pending → confirmed → active → completed
    - Any status can go to cancelled
    - active = customer currently has the rental

  3. Notes
    - Maintains data integrity with CHECK constraint
    - No data migration needed as existing statuses remain valid
*/

-- Drop the old check constraint on status
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Add new check constraint with 'active' and 'overdue' statuses included
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'confirmed', 'active', 'overdue', 'completed', 'cancelled'));
