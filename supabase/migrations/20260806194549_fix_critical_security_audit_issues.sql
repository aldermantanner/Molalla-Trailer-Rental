/*
# Fix Critical Security Audit Issues

## Summary
Fixes 5 critical security vulnerabilities found during a full security audit:
1. Admin authorization tautology (any logged-in user treated as admin)
2. SECURITY DEFINER functions publicly callable by anyone
3. ad_leads data leak (any authenticated user can read/update all leads)
4. verified_sessions exposed (anyone can read active session tokens)
5. Mutable search_path on trigger functions

## Details

### 1. Admin authorization tautology (CRITICAL)
The admin policies on `admin_config` and `trailer_availability` check:
  auth.jwt()->>'email' IN (SELECT users.email FROM auth.users WHERE users.id = auth.uid())
This is a tautology — it always returns the caller's own email, so it's true for
ANY authenticated user. This means any logged-in user can read/write admin config
and manage trailer availability.

Fix: Replace with checks against the `admin_emails` table, which is the table the
app actually uses to track who is an admin (used correctly in `bookings` and
`testimonials` policies).

### 2. SECURITY DEFINER functions publicly callable (CRITICAL)
Four functions run as SECURITY DEFINER (owner-level privileges) but are callable
by `anon` and `authenticated` via the REST API with no auth check:
- `cleanup_expired_verifications()` — can delete verification data
- `notify_new_booking()` — trigger function, should not be RPC-callable
- `test_booking_notification()` — test function, should not be public
- `update_availability_for_range()` — can modify trailer availability

Fix: Revoke EXECUTE from PUBLIC/anon/authenticated on all SECURITY DEFINER
functions. The trigger functions (notify_new_booking, test_booking_notification)
are called by database triggers, not by the API. cleanup_expired_verifications
should be called via a scheduled job, not the public API. update_availability_for_range
has both a SECURITY INVOKER and SECURITY DEFINER version — revoke on the DEFINER one.

### 3. ad_leads data leak (HIGH)
- `auth_select_ad_leads` policy: `TO authenticated USING (true)` — any logged-in
  user can read ALL ad leads (names, phones, emails of leads).
- `auth_update_ad_leads` policy: `TO authenticated USING (true) WITH CHECK (true)`
  — any logged-in user can modify any lead.
- No DELETE policy for authenticated users (but grant allows DELETE).

Fix: Restrict SELECT/UPDATE/DELETE to admin users (checked via admin_emails).
Keep INSERT open to anon for lead submission from the ad landing page.

### 4. verified_sessions exposed (HIGH)
`Anonymous users can read active sessions` policy: `TO anon USING (expires_at > now())`
— anyone can query and read active session tokens, which could allow session hijacking.

Fix: Remove the anon SELECT policy. The `get-customer-bookings` edge function uses
the service role key (bypasses RLS) to look up sessions, so the client never needs
direct SELECT access to this table.

### 5. Mutable search_path (MEDIUM)
`notify_new_booking` and `test_booking_notification` have unset search_path, which
allows search_path injection on SECURITY DEFINER functions.

Fix: Recreate both functions with `SET search_path = public, pg_temp` (or use
ALTER FUNCTION ... SET search_path).

## Security Changes
- Drop and recreate admin policies on admin_config and trailer_availability
- Revoke EXECUTE on 4 SECURITY DEFINER functions from PUBLIC
- Drop and recreate ad_leads SELECT/UPDATE policies + add DELETE policy
- Drop anon SELECT policy on verified_sessions
- Fix search_path on 2 trigger functions
*/

-- ============================================================
-- 1. Fix admin authorization tautology on admin_config
-- ============================================================

DROP POLICY IF EXISTS "Admin users can read admin config" ON admin_config;
DROP POLICY IF EXISTS "Admin users can update admin config" ON admin_config;

CREATE POLICY "Admins can read admin config"
ON admin_config FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

CREATE POLICY "Admins can update admin config"
ON admin_config FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))))
WITH CHECK (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

-- Also add INSERT and DELETE policies for admin_config (currently missing — grants allow it but no policies exist)
DROP POLICY IF EXISTS "Admins can insert admin config" ON admin_config;
CREATE POLICY "Admins can insert admin config"
ON admin_config FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

DROP POLICY IF EXISTS "Admins can delete admin config" ON admin_config;
CREATE POLICY "Admins can delete admin config"
ON admin_config FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

-- ============================================================
-- 2. Fix admin authorization tautology on trailer_availability
-- ============================================================

DROP POLICY IF EXISTS "Admin users can delete availability" ON trailer_availability;
DROP POLICY IF EXISTS "Admin users can manage availability" ON trailer_availability;
DROP POLICY IF EXISTS "Admin users can update availability" ON trailer_availability;

CREATE POLICY "Admins can delete availability"
ON trailer_availability FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

CREATE POLICY "Admins can insert availability"
ON trailer_availability FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

CREATE POLICY "Admins can update availability"
ON trailer_availability FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))))
WITH CHECK (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

-- ============================================================
-- 3. Revoke EXECUTE on SECURITY DEFINER functions from public
-- ============================================================

-- cleanup_expired_verifications: should only be called by scheduled jobs, not the API
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_verifications() FROM PUBLIC, anon, authenticated;

-- notify_new_booking: trigger function, should never be RPC-callable
REVOKE EXECUTE ON FUNCTION public.notify_new_booking() FROM PUBLIC, anon, authenticated;

-- test_booking_notification: test function, should not be public
REVOKE EXECUTE ON FUNCTION public.test_booking_notification(uuid) FROM PUBLIC, anon, authenticated;

-- update_availability_for_range (SECURITY DEFINER version): should not be callable by anon
-- Note: there is also a SECURITY INVOKER version with the same name — we need to revoke on both
REVOKE EXECUTE ON FUNCTION public.update_availability_for_range(date, date) FROM PUBLIC, anon, authenticated;

-- ============================================================
-- 4. Fix ad_leads policies — restrict read/write to admins
-- ============================================================

DROP POLICY IF EXISTS "anon_insert_ad_leads" ON ad_leads;
DROP POLICY IF EXISTS "auth_select_ad_leads" ON ad_leads;
DROP POLICY IF EXISTS "auth_update_ad_leads" ON ad_leads;

-- Anon can still insert leads from the ad landing page
CREATE POLICY "anon_insert_ad_leads"
ON ad_leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read leads
CREATE POLICY "admins_select_ad_leads"
ON ad_leads FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

-- Only admins can update leads
CREATE POLICY "admins_update_ad_leads"
ON ad_leads FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))))
WITH CHECK (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

-- Only admins can delete leads
CREATE POLICY "admins_delete_ad_leads"
ON ad_leads FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM admin_emails WHERE admin_emails.email = (SELECT (auth.jwt() ->> 'email'::text))));

-- ============================================================
-- 5. Remove anon SELECT on verified_sessions
-- ============================================================

DROP POLICY IF EXISTS "Anonymous users can read active sessions" ON verified_sessions;

-- ============================================================
-- 6. Fix search_path on trigger functions
-- ============================================================

ALTER FUNCTION public.notify_new_booking() SET search_path = public, pg_temp;
ALTER FUNCTION public.test_booking_notification(uuid) SET search_path = public, pg_temp;
