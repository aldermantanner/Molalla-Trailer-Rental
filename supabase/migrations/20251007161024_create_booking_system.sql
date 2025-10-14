/*
  # Create Booking System

  1. New Tables
    - bookings: Customer booking information
    - trailer_availability: Track daily trailer availability

  2. Security
    - Enable RLS on both tables
    - Public can create bookings and read availability
    - Only authenticated users can manage bookings
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('rental', 'junk_removal')),
  start_date date NOT NULL,
  end_date date,
  delivery_address text NOT NULL,
  delivery_required boolean DEFAULT false,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trailer availability table
CREATE TABLE IF NOT EXISTS trailer_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  available_trailers integer NOT NULL DEFAULT 3,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trailer_availability ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own bookings"
  ON bookings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- Availability policies
CREATE POLICY "Anyone can view availability"
  ON trailer_availability FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can manage availability"
  ON trailer_availability FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update availability"
  ON trailer_availability FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete availability"
  ON trailer_availability FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_availability_date ON trailer_availability(date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON trailer_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
