/*
  # Remove Unused Database Indexes

  1. Changes
    - Drop unused index `idx_bookings_stripe_session_id` on bookings table
    - Drop unused index `idx_bookings_payment_status` on bookings table
  
  2. Notes
    - These indexes were not being utilized by any queries
    - Removing unused indexes improves write performance and reduces storage overhead
*/

DROP INDEX IF EXISTS idx_bookings_stripe_session_id;
DROP INDEX IF EXISTS idx_bookings_payment_status;