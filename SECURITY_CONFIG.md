# Security Configuration Guide

## Manual Configuration Required

The following security settings must be configured through the Supabase Dashboard as they cannot be set via SQL migrations:

### 1. Enable Leaked Password Protection

**Location:** Supabase Dashboard → Authentication → Policies

**Steps:**
1. Log in to your Supabase Dashboard
2. Navigate to Authentication → Policies
3. Find "Breach password protection" setting
4. Enable the toggle to activate HaveIBeenPwned.org integration
5. Save changes

**What this does:**
- Checks user passwords against the HaveIBeenPwned database
- Prevents users from setting compromised passwords
- Enhances overall account security

### 2. Anonymous Access Policies - Fixed

The following RLS policies have been updated to address security concerns:

#### Bookings Table
- ✅ Anonymous users can create bookings (required for business flow)
  - Now includes email validation (proper email format)
  - Validates name length (minimum 2 characters)
  - Validates phone length (minimum 10 characters)

- ✅ Anonymous users can view recent bookings
  - Limited to 5-minute window after creation
  - Prevents long-term data exposure

- ✅ Anonymous users can update document URLs
  - Limited to 10-minute window after creation
  - Cannot modify other booking fields
  - Allows document upload flow to complete

#### Storage Policies
- ✅ Anonymous file uploads restricted
  - Only allowed in 'booking-documents' bucket
  - Only in 'documents' folder
  - Only jpg, jpeg, png, pdf extensions
  - Prevents abuse of storage system

#### Admin Operations
- ✅ All admin operations now require authentication
  - Replaced `USING (true)` with proper auth checks
  - Verifies user exists in auth.users table
  - Checks JWT email matches authenticated user

### 3. Rate Limiting (Recommended)

Consider implementing additional rate limiting at the application level:

- Limit booking submissions per IP (e.g., 5 per hour)
- Limit file uploads per session
- Monitor for suspicious patterns

### 4. Additional Security Recommendations

1. **Enable Email Confirmations** (if not already)
   - Dashboard → Authentication → Email Auth
   - Requires users to verify email addresses

2. **Configure CAPTCHA** (for production)
   - Dashboard → Authentication → Bot Protection
   - Prevents automated abuse

3. **Set Session Timeout**
   - Dashboard → Authentication → Policies
   - Configure appropriate session duration

4. **Enable Audit Logging**
   - Dashboard → Database → Extensions
   - Enable pgAudit for compliance tracking

## Security Policy Summary

### Anonymous Users (anon role)
- ✅ Can create bookings (with validation)
- ✅ Can view their recent bookings (5-minute window)
- ✅ Can update document URLs (10-minute window)
- ✅ Can upload files to booking-documents (restricted formats)
- ✅ Can view approved testimonials
- ✅ Can view trailer availability

### Authenticated Users (authenticated role)
- ✅ Can view all bookings (admin only)
- ✅ Can update bookings (admin only)
- ✅ Can delete bookings (admin only)
- ✅ Can manage testimonials (admin only)
- ✅ Can manage trailer availability (admin only)
- ✅ Can view/delete uploaded documents

### Service Role (service_role)
- ✅ Full access (used by edge functions)
- ⚠️ Never expose service role key to client

## Changes Applied

All security policies have been updated in the database migrations:
- `fix_security_policies.sql`
- `fix_anonymous_booking_updates.sql`

These changes maintain the required anonymous booking flow while significantly tightening security controls.
