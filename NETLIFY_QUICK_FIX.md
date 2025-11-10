# ⚡ Netlify Build Fix - Quick Reference

## 🎯 Immediate Actions Required

### 1. Clear Netlify Cache (IMPORTANT!)
In Netlify Dashboard:
- Go to **Site settings** → **Build & deploy**
- Click **Clear cache and retry deploy**
- OR: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### 2. Verify Netlify Dashboard Settings
Ensure these match `netlify.toml`:

**Build settings:**
- Base directory: `frontend`
- Build command: `npm install --legacy-peer-deps && npm run build`
- Publish directory: `dist` (relative to base directory)

**Environment variables:**
- `NODE_VERSION=18` (if not auto-detected)

### 3. Push Updated Configuration
```bash
git add netlify.toml
git commit -m "Fix Netlify build configuration for reconnection"
git push origin main
```

### 4. Monitor Build
- Check **Deploys** tab for build status
- Review build logs for any errors
- Build should complete in 2-5 minutes

## 🔍 If Build Still Fails

### Check Build Logs For:
1. **Package installation errors** → Clear cache and retry
2. **Module not found** → Verify package.json dependencies
3. **Build command failed** → Check if vite build works locally
4. **Publish directory missing** → Verify dist folder is created

### Quick Test Locally:
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
# Should create dist/ folder
```

## ✅ Success Checklist
- [ ] Cache cleared in Netlify
- [ ] Build settings match netlify.toml
- [ ] Updated netlify.toml pushed to GitHub
- [ ] Build completes successfully
- [ ] Site deploys and loads
- [ ] All routes work (no 404 errors)

## 📞 Common Issues

**Issue**: "Build command failed"
**Fix**: Verify `npm run build` works locally in `frontend/` directory

**Issue**: "Publish directory does not exist"  
**Fix**: Check that build creates `frontend/dist/` folder

**Issue**: "npm ERR! code ELOCKVERIFY"
**Fix**: Clear cache and ensure package-lock.json is committed

---

**Need more help?** See `NETLIFY_RECONNECT_FIX.md` for detailed troubleshooting.

