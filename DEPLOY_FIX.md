# Deploy Fix Instructions

## Critical Files Updated
1. `package.json` - Downgraded react-router-dom from v7 to v6
2. `package-lock.json` - Updated dependency tree
3. `netlify.toml` - Changed build command to use `npm ci`

## Steps to Deploy Successfully

### 1. Push ALL Updated Files
You MUST push these files to your GitHub repository:
```bash
git add package.json package-lock.json netlify.toml
git commit -m "Fix: Downgrade react-router-dom to v6 for Netlify compatibility"
git push
```

### 2. Clear Netlify Build Cache
Option A - Through Netlify UI:
1. Go to your Netlify dashboard
2. Click on your site
3. Go to "Site configuration" > "Build & deploy"
4. Scroll to "Build settings"
5. Click "Clear build cache"
6. Click "Trigger deploy" > "Clear cache and deploy site"

Option B - Through Deploy Settings:
1. Go to "Deploys" tab
2. Click "Trigger deploy" dropdown
3. Select "Clear cache and retry deploy"

### 3. Monitor the Deploy
Watch the build log. You should see:
- `npm ci` installing fresh dependencies
- No "Rollup failed to resolve import" errors
- Build completing successfully

## Why This Fixes The Issue

**Problem**: React Router v7 has ESM bundling issues with Vite 5 on Netlify
**Solution**: React Router v6 is stable and fully compatible with Vite 5
**Build Command**: `npm ci` ensures exact dependency versions from package-lock.json

## If Still Failing

If you still see the error after clearing cache:
1. Verify all three files are in your GitHub repository
2. Check the Netlify build log to confirm it's using `npm ci`
3. Ensure NODE_VERSION is set to 20.11.0 in the build log
4. Try deleting and redeploying the site on Netlify
