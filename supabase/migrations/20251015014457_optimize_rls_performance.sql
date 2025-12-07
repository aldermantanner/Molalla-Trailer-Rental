/*
  # Optimize RLS Performance

  1. Performance Optimization
    - Replace `auth.jwt()` with `(select auth.jwt())` to prevent re-evaluation per row
    - Replace `auth.uid()` with `(select auth.uid())` to prevent re-evaluation per row
    - This significantly improves query performance at scale
  
  2. Tables Updated
    - admin_config: 2 policies optimized
    - bookings: 2 policies optimized
    - testimonials: 3 policies optimized
    - trailer_availability: 3 policies optimized
  
  3. Security
    - No changes to security logic, only performance optimization
    - All existing access controls remain the same
*/

-- Drop existing policies that need optimization
DROP POLICY IF EXISTS "Admin users can read admin config" ON admin_config;
DROP POLICY IF EXISTS "Admin users can update admin config" ON admin_config;
DROP POLICY IF EXISTS "Admin users can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admin users can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Admin users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can manage availability" ON trailer_availability;
DROP POLICY IF EXISTS "Admin users can update availability" ON trailer_availability;
DROP POLICY IF EXISTS "Admin users can delete availability" ON trailer_availability;

-- Admin Config: Optimized policies
CREATE POLICY "Admin users can read admin config"
ON admin_config FOR SELECT
TO authenticated
USING (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);

CREATE POLICY "Admin users can update admin config"
ON admin_config FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
)
WITH CHECK (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);

-- Bookings: Optimized policies
CREATE POLICY "Admin users can update bookings"
ON bookings FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
)
WITH CHECK (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);

CREATE POLICY "Admin users can delete bookings"
ON bookings FOR DELETE
TO authenticated
USING (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);

-- Testimonials: Optimized policies
CREATE POLICY "Admin users can insert testimonials"
ON testimonials FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);

CREATE POLICY "Admin users can update testimonials"
ON testimonials FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
)
WITH CHECK (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);

CREATE POLICY "Admin users can delete testimonials"
ON testimonials FOR DELETE
TO authenticated
USING (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);

-- Trailer Availability: Optimized policies
CREATE POLICY "Admin users can manage availability"
ON trailer_availability FOR INSERT
TO authenticated
WITH CHECK (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);

CREATE POLICY "Admin users can update availability"
ON trailer_availability FOR UPDATE
TO authenticated
USING (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
)
WITH CHECK (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);

CREATE POLICY "Admin users can delete availability"
ON trailer_availability FOR DELETE
TO authenticated
USING (
  ((select auth.jwt()) ->> 'email') IN (
    SELECT email FROM auth.users WHERE id = (select auth.uid())
  )
);