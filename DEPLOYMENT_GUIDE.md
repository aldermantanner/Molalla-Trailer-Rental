# Quick Deployment Guide - Update Your Live Site

Since you already have GitHub, Netlify, and Supabase connected, follow these simple steps to push the security fixes and updates live.

---

## Step 1: Push Changes to GitHub

Open your terminal in the project directory and run:

```bash
# Check what files have changed
git status

# Add all changed files
git add .

# Commit your changes with a descriptive message
git commit -m "Security fixes: Updated RLS policies and added deployment guide"

# Push to GitHub (this will trigger automatic deployment on Netlify)
git push origin main
```

**Note:** If your main branch is called something else (like `master`), use that name instead of `main`.

---

## Step 2: Netlify Will Auto-Deploy

Once you push to GitHub:

1. Netlify will automatically detect the changes
2. It will start building your site (takes 2-3 minutes)
3. You can watch the progress at: `https://app.netlify.com/sites/[your-site-name]/deploys`

**To monitor the deployment:**
- Go to your Netlify dashboard
- Click on your site
- Click "Deploys" tab
- Watch the build progress in real-time

---

## Step 3: Verify Database Migrations Applied

The security fixes I made included database migrations. They should have been automatically applied when I created them, but let's verify:

### Check in Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Run this query to see applied migrations:

```sql
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC
LIMIT 5;
```

You should see:
- `fix_security_policies`
- `fix_anonymous_booking_updates`

### If Migrations Didn't Apply

Run them manually:

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/fix_security_policies.sql` from your project
3. Copy and paste the entire SQL content
4. Click "Run"
5. Repeat for `fix_anonymous_booking_updates.sql`

---

## Step 4: Enable Leaked Password Protection (Manual Step)

This cannot be done via code - you must do this manually:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** → **Policies** in the left sidebar
4. Scroll to find **"Breach password protection"**
5. Toggle it **ON**
6. Click **Save**

This enables checking passwords against the HaveIBeenPwned database.

---

## Step 5: Test Your Live Site

Once Netlify finishes deploying (you'll see "Published" status):

### Test Basic Functionality
1. Visit your live site URL
2. Try creating a test booking
3. Upload a test document
4. Verify you receive confirmation

### Test Admin Access
1. Go to `[your-site-url]/admin`
2. Log in with your admin credentials
3. Verify you can see bookings
4. Try updating a booking status

---

## Troubleshooting

### If Netlify build fails:

1. Check the build logs in Netlify dashboard
2. Look for error messages
3. Common issues:
   - Missing environment variables (should already be set)
   - Node version mismatch (should be set to 20 in netlify.toml)

### If you get git errors:

```bash
# If git says "nothing to commit"
# It means no files have changed, or they need to be staged

# If you get merge conflicts
git pull origin main
# Resolve conflicts, then:
git add .
git commit -m "Resolved conflicts"
git push origin main

# If push is rejected
git pull origin main --rebase
git push origin main
```

### If site doesn't update after deployment:

- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Try incognito/private browsing mode
- Wait a few minutes for CDN to clear

---

## What Changed?

Here's a summary of what will be updated when you deploy:

### Security Fixes:
- Removed overly permissive `USING (true)` policies
- Added proper authentication checks for admin operations
- Enhanced anonymous booking validation (email format, field lengths)
- Restricted anonymous file uploads (file types, locations)
- Time-limited anonymous access (5-10 minute windows)

### New Files:
- `SECURITY_CONFIG.md` - Security documentation
- `DEPLOYMENT_GUIDE.md` - This guide
- Database migrations for security fixes

### No Breaking Changes:
- Booking flow still works for customers
- File uploads still work
- Admin portal still works
- All existing features preserved

---

## Quick Command Reference

```bash
# Check current status
git status

# See what branch you're on
git branch

# Push changes
git add .
git commit -m "Your message here"
git push origin main

# Pull latest changes (if needed)
git pull origin main

# View commit history
git log --oneline -5
```

---

## That's It!

Your workflow is now:
1. **Make changes** locally
2. **Test** with `npm run build`
3. **Commit and push** to GitHub
4. **Netlify auto-deploys** (no action needed)
5. **Site updates** automatically in 2-3 minutes

No need to manually deploy to Netlify - it's all automated!
