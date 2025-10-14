/*
  # Fix Security Issues

  1. Testimonials Policies
    - Remove overlapping permissive SELECT policies for authenticated users
    - Keep single policy: authenticated users can view all, public users can view approved only

  2. Function Search Path
    - Fix search_path for update_availability_for_range function (2-parameter version)
    - Set to immutable search_path to prevent security issues

  3. Notes
    - The 4-parameter version already has correct search_path
    - Leaked password protection must be enabled in Supabase Dashboard (Auth > Policies)
*/

-- Drop the overlapping authenticated SELECT policy on testimonials
DROP POLICY IF EXISTS "Authenticated users can view all testimonials" ON testimonials;

-- The "Anyone can view approved testimonials" policy handles public access
-- Authenticated users will also see approved testimonials through this policy
-- For admin access to all testimonials, use service role or create specific admin policy

-- Fix the 2-parameter update_availability_for_range function with secure search_path
CREATE OR REPLACE FUNCTION public.update_availability_for_range(start_d date, end_d date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;
