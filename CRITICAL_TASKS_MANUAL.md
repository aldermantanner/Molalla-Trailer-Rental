# CRITICAL MANUAL TASKS - BEFORE PRODUCTION

## ✅ AUTOMATED FIXES COMPLETED (December 6, 2025)

The following security fixes have been automatically applied:

1. ✅ Removed hardcoded API keys from source code
2. ✅ Fixed permissive RLS policies - Added admin_emails table
3. ✅ Added admin authentication to refund and payment functions
4. ✅ Restricted CORS to specific domains
5. ✅ Added session token expiration validation (10 minutes)
6. ✅ Fixed rate limiting (3 requests per hour instead of per minute)
7. ✅ Added error boundary component
8. ✅ Added HTTPS redirect and security headers
9. ✅ Added Content Security Policy
10. ✅ Fixed Stripe webhook status code (401 instead of 400)
11. ✅ Updated dependencies

---

## ⚠️ CRITICAL: 3 MANUAL TASKS REQUIRED (2-3 hours)

### Task 1: Rotate ALL API Keys (URGENT - 2 hours)

**WHY:** API keys were previously hardcoded and may be in git history.

#### Stripe
1. Go to https://dashboard.stripe.com/apikeys
2. Click "Roll key" next to your Secret key
3. Copy the new secret key
4. Update in:
   - Netlify: Site settings → Environment variables → `STRIPE_SECRET_KEY`
   - Local: `.env` file (never commit this!)

#### Twilio
1. Go to https://console.twilio.com/
2. Navigate to Account → API keys & tokens
3. Create new API key
4. Update in:
   - Netlify: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
   - Local: `.env` file

#### Resend
1. Go to https://resend.com/api-keys
2. Create new API key
3. Update in:
   - Netlify: `RESEND_API_KEY`
   - Local: `.env` file

#### Supabase (if compromised)
1. Go to https://supabase.com/dashboard/project/[your-project]/settings/api
2. Generate new anon key (if needed)
3. Update in:
   - Netlify: `VITE_SUPABASE_ANON_KEY`
   - Local: `.env` file

**After rotating keys:**
- Redeploy all edge functions
- Clear and redeploy Netlify site

---

### Task 2: Set Storage Bucket Limits (5 minutes)

**WHY:** Unlimited file uploads can fill storage or enable DoS attacks.

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/[your-project]/storage/buckets
2. Click on `booking-documents` bucket
3. Click "Settings" or "Edit"
4. Set the following:
   - **Maximum file size:** 10 MB (10485760 bytes)
   - **Allowed MIME types:**
     - `image/jpeg`
     - `image/png`
     - `application/pdf`
5. Save changes

**Test:** Try uploading a 20 MB file - should be rejected.

---

### Task 3: Add Input Validation to Edge Functions (1-2 hours)

**WHY:** Unvalidated input can lead to XSS, data corruption, and SQL injection.

#### Files to Update:
1. `supabase/functions/create-booking/index.ts`
2. `supabase/functions/verify-code/index.ts`
3. `supabase/functions/create-checkout-session/index.ts`

#### Implementation Guide:

**Add at the top of each function:**
```typescript
import { z } from 'npm:zod@3.22.4';
```

**For create-booking/index.ts:**
```typescript
const bookingSchema = z.object({
  customer_name: z.string().min(2).max(100).trim(),
  customer_email: z.string().email().toLowerCase(),
  customer_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  service_type: z.enum(['rental', 'junk_removal', 'material_delivery']),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional().nullable(),
  delivery_address: z.string().min(5).max(500).trim(),
  notes: z.string().max(2000).optional(),
  total_price: z.number().positive().max(50000),
  delivery_required: z.boolean(),
  trailer_type: z.string().max(50).optional(),
});

// Replace direct json parsing with:
const rawData = await req.json();
try {
  const bookingData = bookingSchema.parse(rawData);
  // Continue with validated data
} catch (error) {
  return new Response(
    JSON.stringify({
      error: "Invalid input data",
      details: error.errors
    }),
    {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
```

**For verify-code/index.ts:**
```typescript
const verifySchema = z.object({
  email: z.string().email().toLowerCase(),
  code: z.string().length(6).regex(/^\d{6}$/),
});

const rawData = await req.json();
try {
  const { email, code } = verifySchema.parse(rawData);
  // Continue with validated data
} catch (error) {
  return new Response(
    JSON.stringify({ error: "Invalid input", details: error.errors }),
    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }}
  );
}
```

**After adding validation:**
1. Deploy updated functions:
   ```bash
   supabase functions deploy create-booking
   supabase functions deploy verify-code
   supabase functions deploy create-checkout-session
   ```
2. Test each function with invalid data to ensure validation works
3. Test with valid data to ensure functionality still works

---

## 📋 OPTIONAL BUT RECOMMENDED (1-2 days)

### 4. Implement Monitoring (2 hours)
- Sign up for Sentry.io
- Add error tracking to React app
- Monitor edge function errors

### 5. Add Audit Logging (4 hours)
- Create `admin_actions` table
- Log all refunds, status changes, price modifications
- Include: admin email, action type, booking ID, timestamp

### 6. Penetration Testing (1 day)
- Test authentication flows
- Attempt unauthorized access
- Test file upload security
- Verify RLS policies

---

## 🔍 VERIFICATION CHECKLIST

After completing manual tasks, verify:

### Security Tests
- [ ] Try accessing another user's booking → Should fail
- [ ] Try calling refund function without auth → Should get 401
- [ ] Try calling refund function as non-admin → Should get 403
- [ ] Upload 20 MB file → Should be rejected
- [ ] Request 10 verification codes rapidly → Should be rate limited
- [ ] Access site via HTTP → Should redirect to HTTPS
- [ ] Test expired session token → Should require re-login
- [ ] Submit form with XSS payload like `<script>alert('xss')</script>` → Should be sanitized

### Functionality Tests
- [ ] Create new booking → Should work
- [ ] View bookings in customer portal → Should work
- [ ] Admin login → Should work
- [ ] Admin view all bookings → Should work
- [ ] Admin issue refund → Should work
- [ ] Admin create payment link → Should work
- [ ] Receive email verification code → Should work
- [ ] Payment processing → Should work

### Performance Tests
- [ ] Homepage loads < 3 seconds
- [ ] Mobile site is responsive
- [ ] All images load properly
- [ ] No console errors

---

## 📊 CURRENT SECURITY STATUS

### Risk Level: MEDIUM → LOW (after manual tasks)

**Current Vulnerabilities:**
- ⚠️ API keys need rotation (if exposed in git history)
- ⚠️ Storage bucket limits not set
- ⚠️ Input validation missing on some edge functions
- ℹ️ Dev dependency vulnerabilities (low risk for production)

**After Manual Tasks:**
- ✅ All critical vulnerabilities resolved
- ✅ Production-ready security posture
- ✅ OWASP Top 10 protections in place

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Complete Manual Tasks (above)

### Step 2: Deploy Database Migration
The RLS fix migration is already applied:
```bash
# Verify migration applied
supabase migration list
# Should show: fix_critical_rls_policies - Applied
```

### Step 3: Deploy Edge Functions
```bash
# Deploy functions with new security features
supabase functions deploy refund-deposit
supabase functions deploy create-payment-link
supabase functions deploy send-verification-email
supabase functions deploy stripe-webhook

# If you added input validation:
supabase functions deploy create-booking
supabase functions deploy verify-code
```

### Step 4: Update Environment Variables
1. Go to Netlify dashboard
2. Update all rotated API keys
3. Redeploy site

### Step 5: Test Everything
- Run through verification checklist above
- Monitor error logs for 24 hours
- Test on multiple devices/browsers

### Step 6: Go Live
- Update DNS if needed
- Monitor traffic and errors
- Keep security audit report for reference

---

## 📞 SUPPORT RESOURCES

### If You Get Stuck:

**Supabase Issues:**
- Docs: https://supabase.com/docs
- Support: https://supabase.com/dashboard/support

**Stripe Issues:**
- Docs: https://stripe.com/docs
- Support: https://support.stripe.com/

**Netlify Issues:**
- Docs: https://docs.netlify.com/
- Support: https://www.netlify.com/support/

**General Security:**
- OWASP: https://owasp.org/
- Security Checklist: https://securitycheckli.st/

---

## ⏱️ TIME ESTIMATES

| Task | Time Required |
|------|---------------|
| Rotate API keys | 2 hours |
| Set storage limits | 5 minutes |
| Add input validation | 1-2 hours |
| **TOTAL** | **3-4 hours** |

---

## ✅ COMPLETION CRITERIA

Your application is production-ready when:

1. ✅ All 3 critical manual tasks completed
2. ✅ All verification tests pass
3. ✅ No console errors on any page
4. ✅ Security audit checklist 100% complete
5. ✅ Monitoring/logging in place (recommended)
6. ✅ 24 hours of error-free operation

---

**Last Updated:** December 6, 2025
**Next Review:** After completing manual tasks
**Status:** 80% Complete - 3 manual tasks remaining
