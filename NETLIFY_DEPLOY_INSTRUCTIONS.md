# Netlify Deployment Instructions

## Quick Fix for Build Failure

Your Netlify build is failing because it doesn't have the required environment variables. Follow these steps:

---

## Step 1: Configure Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add these variables:

```
VITE_SUPABASE_URL=https://hwthgbbckcowdqoxvbsx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dGhnYmJja2Nvd2Rxb3h2YnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NDgzMjgsImV4cCI6MjA3NTQyNDMyOH0.algrOqrqVZBI7s2c-DUWoJYHCY32KSvocVpKU0ntgzI
RESEND_API_KEY=re_AZxJkfJy_DbUYUxRCwd5QXCxPATUcwiMF
```

**Important:** Add each variable separately (don't include them as a single block)

---

## Step 2: Verify Your GitHub Repository Has These Files

Make sure these files are committed to your GitHub repo:

### Required Files:
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `vite.config.ts`
- ✅ `tsconfig.json`
- ✅ `index.html`
- ✅ `netlify.toml`
- ✅ `tailwind.config.js`
- ✅ `postcss.config.js`
- ✅ All files in `/src` folder
- ✅ All files in `/public` folder

### Files That Should NOT Be Committed:
- ❌ `.env` (contains secrets)
- ❌ `node_modules/` (too large, installed automatically)
- ❌ `dist/` (built by Netlify)

---

## Step 3: Trigger a New Deploy

After adding environment variables:

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**

OR

1. Push any small change to GitHub (even adding a space to README)
2. Netlify will auto-deploy

---

## Step 4: Verify Build Settings (Should Already Be Correct)

In Netlify **Site settings** → **Build & deploy** → **Build settings**:

- **Build command:** `npx vite build` (or `npm run build`)
- **Publish directory:** `dist`
- **Node version:** 20

These are already configured in your `netlify.toml` file.

---

## Common Issues & Solutions

### Issue: "Command failed: npx vite build"
**Cause:** Missing environment variables
**Solution:** Add all three env vars to Netlify (Step 1)

### Issue: "Module not found" errors
**Cause:** Missing package.json or package-lock.json
**Solution:** Make sure these files are committed to GitHub

### Issue: Build succeeds but site is blank
**Cause:** Wrong publish directory
**Solution:** Verify publish directory is set to `dist`

### Issue: Runtime errors about Supabase
**Cause:** Environment variables not set correctly
**Solution:** Double-check variable names start with `VITE_`

---

## Quick Test Locally

Before pushing to GitHub, test the build locally:

```bash
# Remove any existing dist folder
rm -rf dist

# Build with production settings
npm run build

# Test the build locally
npm run preview
```

If this works locally, it should work on Netlify (once env vars are added).

---

## Current Build Configuration

Your `netlify.toml` file is correctly configured:

```toml
[build]
publish = "dist"
command = "npx vite build"

[build.environment]
NODE_VERSION = "20"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

This handles SPA routing and uses Node 20.

---

## What NOT to Do

❌ **Don't drag and drop the dist folder** - Netlify builds it for you
❌ **Don't commit .env file** - Use Netlify's environment variables
❌ **Don't commit node_modules** - Netlify installs them automatically
❌ **Don't commit dist folder** - It's built on each deploy

---

## Summary

1. Add environment variables to Netlify dashboard
2. Make sure source files are in GitHub (not dist folder)
3. Trigger a new deploy
4. Watch the deploy logs for any errors

Your app should deploy successfully after adding the environment variables!

---

## Need Help?

If deployment still fails after adding env vars:

1. Check the Netlify deploy logs (they'll show the exact error)
2. Verify all three environment variables are added correctly
3. Make sure `VITE_` prefix is included in variable names
4. Try clearing Netlify's cache: **Site settings** → **Build & deploy** → **Clear cache and retry deploy**
