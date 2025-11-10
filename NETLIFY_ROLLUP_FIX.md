# 🔧 Netlify Rollup Native Module Fix

## Error
```
MODULE_NOT_FOUND: Cannot find module '@rollup/rollup-linux-x64-gnu'
Node.js v22.21.1
```

## Root Cause
1. **Node Version Mismatch**: Build is using Node v22.21.1 instead of Node 18
2. **Native Module Issue**: Rollup native modules not installed/compiled for the build platform
3. **Dependency Installation**: Native modules need to be rebuilt for the correct Node version

## ✅ Solutions Applied

### 1. Node Version Enforcement
- Added `.node-version` file with `18.20.4`
- Added `NODE_VERSION = "18.20.4"` in `netlify.toml`
- Added `engines` field in `package.json` to enforce Node 18

### 2. Build Configuration
- Updated build command to use `--force` flag for clean install
- Added `--legacy-peer-deps` to handle peer dependency issues
- Added postinstall script to rebuild native modules

### 3. Vite Update
- Updated Vite from `^5.0.0` to `^5.0.8` (better native module handling)

## 🚀 Critical Steps to Fix

### Step 1: Set Node Version in Netlify UI (IMPORTANT!)
The `netlify.toml` environment variable might not be enough. You MUST set it in the UI:

1. Go to **Netlify Dashboard** → Your Site
2. Navigate to **Site settings** → **Build & deploy** → **Environment**
3. Click **Edit variables**
4. Add/Update:
   - Key: `NODE_VERSION`
   - Value: `18.20.4`
5. **OR** go to **Build settings** and set:
   - **Node version**: `18.20.4` (in the build settings section)

### Step 2: Clear Build Cache
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**

### Step 3: Verify Build Settings
In Netlify Dashboard → **Build & deploy** → **Build settings**:
- **Base directory**: `frontend`
- **Build command**: `npm install --legacy-peer-deps --force && npm run build`
- **Publish directory**: `dist`
- **Node version**: `18.20.4` (set this explicitly!)

### Step 4: Push Updated Configuration
```bash
git add netlify.toml frontend/package.json .node-version frontend/.nvmrc
git commit -m "Fix Rollup native module error - enforce Node 18"
git push origin main
```

## 🔍 Alternative Solutions (If Still Failing)

### Option 1: Use Netlify Build Plugin
Create `netlify.toml` with build plugin:
```toml
[[plugins]]
  package = "@netlify/plugin-node-version"
  [plugins.inputs]
    nodeVersion = "18.20.4"
```

### Option 2: Update Vite Config
Add to `vite.config.js`:
```javascript
export default defineConfig({
  // ... existing config
  optimizeDeps: {
    force: true
  },
  build: {
    // ... existing config
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
})
```

### Option 3: Pin Rollup Version
Add to `frontend/package.json`:
```json
{
  "resolutions": {
    "rollup": "^4.0.0"
  }
}
```

### Option 4: Use Different Build Command
Update `netlify.toml`:
```toml
[build]
  command = "rm -rf node_modules && npm install --legacy-peer-deps --force && npm rebuild && npm run build"
```

## 📋 Verification Checklist

- [ ] Node version set to `18.20.4` in Netlify UI (Build settings)
- [ ] Node version set in Environment variables
- [ ] `.node-version` file committed to repo
- [ ] `frontend/.nvmrc` file exists with `18.20.4`
- [ ] `package.json` has `engines` field
- [ ] Build cache cleared
- [ ] Updated `netlify.toml` pushed to GitHub
- [ ] Build settings match `netlify.toml`
- [ ] Latest code deployed

## 🐛 Debugging

### Check Build Logs
Look for:
1. **Node version**: Should show `v18.20.4`, not `v22.x.x`
2. **Installation**: Check if rollup native modules are installed
3. **Build errors**: Look for MODULE_NOT_FOUND errors

### Test Locally
```bash
cd frontend
node --version  # Should be 18.x.x
npm install --legacy-peer-deps --force
npm run build   # Should work without errors
```

### Common Issues

**Issue**: Still using Node 22
**Fix**: Set Node version explicitly in Netlify UI, not just in netlify.toml

**Issue**: Native modules still not found
**Fix**: Clear cache, use `--force` flag, ensure Node 18 is used

**Issue**: Build timeout
**Fix**: Increase build timeout in Netlify settings or optimize dependencies

## ✅ Success Indicators

Your build is fixed when:
- ✅ Build uses Node v18.20.4 (check logs)
- ✅ No MODULE_NOT_FOUND errors
- ✅ Rollup native modules load successfully
- ✅ Build completes successfully
- ✅ Site deploys and works correctly

---

**Priority**: Set Node version in Netlify UI - this is the most critical step!

