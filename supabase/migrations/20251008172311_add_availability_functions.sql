/*
  # Add Availability Functions

  1. Functions
    - `get_available_trailers_for_date` - Returns the number of available trailers for a specific date
    - `update_trailer_availability` - Function to automatically update availability based on confirmed bookings
  
  2. Security
    - Public can read availability
    - Only authenticated users can modify (future admin feature)
*/

-- Function to get available trailers for a specific date
CREATE OR REPLACE FUNCTION get_available_trailers_for_date(check_date DATE)
RETURNS INTEGER AS $$
DECLARE
  total_trailers INTEGER := 3;
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

-- Function to update availability for a date range
CREATE OR REPLACE FUNCTION update_availability_for_range(start_d DATE, end_d DATE)
RETURNS VOID AS $$
DECLARE
  curr_date DATE := start_d;
  available_count INTEGER;
BEGIN
  WHILE curr_date <= end_d LOOP
    available_count := get_available_trailers_for_date(curr_date);
    
    INSERT INTO trailer_availability (date, available_trailers)
    VALUES (curr_date, available_count)
    ON CONFLICT (date) 
    DO UPDATE SET 
      available_trailers = available_count,
      updated_at = now();
    
    curr_date := curr_date + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for reading availability
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'trailer_availability' 
    AND policyname = 'Anyone can view trailer availability'
  ) THEN
    CREATE POLICY "Anyone can view trailer availability"
      ON trailer_availability FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;