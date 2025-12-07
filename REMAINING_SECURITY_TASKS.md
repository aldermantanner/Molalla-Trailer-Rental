# REMAINING SECURITY TASKS - QUICK REFERENCE

## ⚠️ CRITICAL - DO BEFORE PRODUCTION (3-4 hours)

### 1. Rotate ALL API Keys (URGENT - 2 hours)
**WHY:** Exposed keys in git history/source code
**HOW:**
1. Stripe Dashboard → Developers → API keys → "Roll key"
2. Twilio Console → API Keys & Tokens → Create new
3. Resend Dashboard → API Keys → Generate new key
4. Update `.env` file with new keys
5. Redeploy edge functions
6. Update Netlify environment variables

---

### 2. Fix Session Token Expiration (30 minutes)
**FILE:** `src/components/CustomerPortal.tsx`
**FIND:** Line 38-46 (useEffect with sessionStorage)

**REPLACE:**
```typescript
useEffect(() => {
  const token = sessionStorage.getItem('customer_session_token');
  const storedEmail = sessionStorage.getItem('customer_email');
  const expiresAt = sessionStorage.getItem('customer_session_expires');

  // Check if token exists AND is not expired
  if (token && storedEmail && expiresAt) {
    if (Date.now() < parseInt(expiresAt)) {
      setSessionToken(token);
      setEmail(storedEmail);
      setStep('bookings');
      loadBookings(token, storedEmail);
    } else {
      // Token expired, clear storage
      sessionStorage.clear();
      setStep('email');
    }
  }
}, []);
```

**ALSO ADD:** When setting token (after verification success):
```typescript
const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
sessionStorage.setItem('customer_session_token', token);
sessionStorage.setItem('customer_email', email);
sessionStorage.setItem('customer_session_expires', expiresAt.toString());
```

---

### 3. Set Storage Bucket Limits (5 minutes)
**WHERE:** Supabase Dashboard → Storage → booking-documents
**SETTINGS TO ADD:**
- Maximum file size: 10 MB
- File size limit: 10485760 bytes
- Allowed MIME types:
  - `image/jpeg`
  - `image/png`
  - `application/pdf`

**OR:** Add to storage policy:
```sql
-- Note: Supabase doesn't support file size in RLS
-- Must be enforced in upload logic or bucket settings
```

---

### 4. Add Input Validation to Edge Functions (1-2 hours)

**FUNCTION:** `supabase/functions/create-booking/index.ts`

**ADD AT TOP:**
```typescript
import { z } from 'npm:zod@3.22.4';

const bookingSchema = z.object({
  customer_name: z.string().min(2).max(100).trim(),
  customer_email: z.string().email().toLowerCase(),
  customer_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  service_type: z.enum(['rental', 'junk_removal', 'material_delivery']),
  start_date: z.string().datetime(),
  delivery_address: z.string().min(5).max(500),
  notes: z.string().max(2000).optional(),
  total_price: z.number().positive().max(50000)
});
```

**REPLACE:**
```typescript
// OLD:
const bookingData = await req.json();

// NEW:
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

**REPEAT FOR:**
- `send-verification-email/index.ts` (email validation)
- `verify-code/index.ts` (code format validation)
- `create-checkout-session/index.ts` (amount validation)

---

## 🔥 HIGH PRIORITY - WEEK 1 (6-8 hours)

### 5. Add Error Boundary (30 minutes)
```bash
npm install react-error-boundary
```

**FILE:** `src/App.tsx`
```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <pre className="text-sm bg-gray-100 p-4 rounded mb-4">{error.message}</pre>
        <button
          onClick={resetErrorBoundary}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Routes>...</Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

---

### 6. Fix Rate Limiting (15 minutes)
**FILE:** `supabase/functions/send-verification-email/index.ts`

**FIND:** Line ~40
```typescript
const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
```

**CHANGE TO:**
```typescript
const oneHourAgo = new Date(Date.now() - 3600000).toISOString(); // 1 hour
```

**AND UPDATE ERROR MESSAGE:**
```typescript
if (recentCodes && recentCodes.length >= 3) {
  throw new Error("Too many verification requests. Please try again in 1 hour.");
}
```

---

### 7. Add HTTPS Redirect (5 minutes)
**FILE:** `netlify.toml`

**ADD:**
```toml
[[redirects]]
  from = "http://*"
  to = "https://:splat"
  status = 301
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

### 8. Add Content Security Policy (10 minutes)
**FILE:** `index.html`

**ADD AFTER `<meta name="viewport"...>`:**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://*.supabase.co https://api.stripe.com;
               frame-src https://js.stripe.com;
               font-src 'self' data:;">
```

---

### 9. Update Dependencies (30 minutes)
```bash
npm update
npm audit fix
npm audit fix --force  # if needed
npm run build  # verify still works
```

**CHECK RESULTS:**
```bash
npm audit  # Should show 0 vulnerabilities
```

---

### 10. Fix Stripe Webhook Status Code (5 minutes)
**FILE:** `supabase/functions/stripe-webhook/index.ts`

**FIND:** Line ~50
```typescript
return new Response(JSON.stringify({ error: "Webhook signature verification failed" }), {
  status: 400,  // ❌ WRONG
});
```

**CHANGE TO:**
```typescript
return new Response(JSON.stringify({ error: "Webhook signature verification failed" }), {
  status: 401,  // ✅ CORRECT
});
```

---

## 📊 TESTING CHECKLIST

After making changes, test these scenarios:

### Security Tests
- [ ] Try accessing another customer's booking (should fail)
- [ ] Try calling refund endpoint without auth (should get 401)
- [ ] Try calling refund endpoint as non-admin (should get 403)
- [ ] Upload 20 MB file (should be blocked)
- [ ] Request 10 verification codes rapidly (should be rate limited)
- [ ] Access site via HTTP (should redirect to HTTPS)
- [ ] Test expired session token (should require re-login)

### Functionality Tests
- [ ] Create new booking (should work)
- [ ] View my bookings in customer portal (should work)
- [ ] Admin login (should work)
- [ ] Admin view all bookings (should work)
- [ ] Admin issue refund (should work)
- [ ] Admin create payment link (should work)

### Performance Tests
- [ ] Check page load speed (should be < 3 seconds)
- [ ] Test mobile responsiveness
- [ ] Verify all images load
- [ ] Check console for errors

---

## 🎯 DEPLOYMENT CHECKLIST

Before deploying to production:

1. ✅ All critical fixes applied
2. ✅ All API keys rotated
3. ✅ Environment variables updated on Netlify
4. ✅ Edge functions redeployed with new code
5. ✅ Database migration applied
6. ✅ Build completes without errors
7. ✅ All tests passing
8. ⚠️ Backup database
9. ⚠️ Test in staging first
10. ⚠️ Monitor error logs after deployment

---

## 🆘 IF SOMETHING BREAKS

### Edge Functions Not Working
```bash
# Check logs
supabase functions logs refund-deposit --follow

# Redeploy
supabase functions deploy refund-deposit
supabase functions deploy create-payment-link
```

### RLS Blocking Legitimate Access
```sql
-- Temporarily check what's happening
SELECT * FROM bookings WHERE customer_email = 'customer@example.com';

-- Verify admin email is registered
SELECT * FROM admin_emails WHERE email = 'molallatrailerrental@outlook.com';

-- If missing, add it
INSERT INTO admin_emails (email) VALUES ('molallatrailerrental@outlook.com');
```

### Build Failing
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

---

## 📞 NEED HELP?

**Supabase Support:** https://supabase.com/dashboard/support
**Stripe Support:** https://support.stripe.com/
**Netlify Support:** https://www.netlify.com/support/

---

**Priority:** Fix items 1-4 TODAY before any production traffic
**Timeline:** All critical items should take 3-4 hours total
**Result:** Application will be production-ready with strong security
