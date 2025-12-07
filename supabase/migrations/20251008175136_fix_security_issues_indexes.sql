/*
  # Fix Security Issues - Remove Unused Indexes

  1. Changes
    - Drop unused index `idx_bookings_start_date` from bookings table
    - Drop unused index `idx_availability_date` from trailer_availability table

  2. Reason
    - These indexes are not being used by queries and add unnecessary overhead
    - Removing them improves write performance and reduces storage
*/

DROP INDEX IF EXISTS idx_bookings_start_date;
DROP INDEX IF EXISTS idx_availability_date;
