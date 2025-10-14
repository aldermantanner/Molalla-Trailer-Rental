/*
  # Update Trailer Count to 2

  1. Changes
    - Update default trailer count in trailer_availability table from 3 to 2
    - Update get_available_trailers_for_date function to use 2 trailers instead of 3
  
  2. Notes
    - Reflects the actual inventory: 2 trailers for rent
*/

-- Update the function to use 2 trailers
CREATE OR REPLACE FUNCTION get_available_trailers_for_date(check_date DATE)
RETURNS INTEGER AS $$
DECLARE
  total_trailers INTEGER := 2;
  booked_trailers INTEGER;
BEGIN
  -- Count confirmed bookings that overlap with the check_date
  SELECT COUNT(*) INTO booked_trailers
  FROM bookings
  WHERE status IN ('confirmed', 'pending')
    AND check_date >= start_date
    AND (end_date IS NULL OR check_date <= end_date)
    AND service_type = 'rental';
  
  RETURN total_trailers - booked_trailers;
END;
$$ LANGUAGE plpgsql;

-- Update the default value for available_trailers in the table
ALTER TABLE trailer_availability 
ALTER COLUMN available_trailers SET DEFAULT 2;