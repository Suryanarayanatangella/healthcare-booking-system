# ✅ Production UAT Fix Checklist

## 🎯 Status
- ✅ **Local**: Working fine
- ❌ **Production/UAT**: CORS error blocking login/signup
- ✅ **Code Changes**: Pushed to GitHub (`login-issue` branch)

## 🚀 Next Steps to Fix Production

### Step 1: Update Netlify Environment Variable ⚠️ CRITICAL

1. Go to **Netlify Dashboard**: https://app.netlify.com
2. Select your site: **doctorseasy**
3. **Site settings** → **Environment variables**
4. Find `VITE_API_URL`
5. **Current (WRONG)**: `https://your-backend-url.railway.app/api`
6. **Change to**: `https://YOUR-ACTUAL-BACKEND-URL.railway.app/api`
   - ⚠️ Replace `YOUR-ACTUAL-BACKEND-URL` with your real Railway backend URL
   - Example: If your Railway URL is `https://healthcare-backend-abc123.railway.app`
   - Then set: `https://healthcare-backend-abc123.railway.app/api`
7. **Save**

**How to find your Railway backend URL:**
- Go to Railway Dashboard → Your Backend Service
- Settings tab → Look for "Public Domain" or "Railway Domain"
- Copy the URL

### Step 2: Update Railway Environment Variable ⚠️ CRITICAL

1. Go to **Railway Dashboard**: https://railway.app
2. Select your **backend service**
3. **Variables** tab
4. Find or create `FRONTEND_URL`
5. **Set value to**: `https://doctorseasy.netlify.app`
   - ⚠️ Exact URL, no trailing slash
   - ⚠️ Must match your Netlify URL exactly
6. **Save**

### Step 3: Deploy Updated Backend Code

The CORS fixes are pushed to GitHub on `login-issue` branch. You need to:

**Option A: Merge to main (Recommended)**
```bash
git checkout main
git merge login-issue
git push origin main
```
Railway will auto-deploy from main branch.

**Option B: Deploy from login-issue branch**
1. Go to Railway Dashboard → Your Backend Service
2. **Settings** → **Source**
3. Change branch to `login-issue` (if Railway supports branch selection)
4. Or manually trigger redeploy

### Step 4: Redeploy Both Services

1. **Railway**: 
   - If you merged to main, Railway will auto-deploy
   - Or manually trigger redeploy
   - Wait for deployment to complete

2. **Netlify**:
   - Go to Netlify Dashboard → Your Site
   - **Deploys** tab
   - **Trigger deploy** → **Clear cache and deploy site**
   - Wait for deployment to complete

### Step 5: Verify and Test

1. **Check Backend Logs**:
   - Go to Railway Dashboard → Your Backend Service
   - **Deployments** → **View Logs**
   - Look for: `🔒 CORS Configuration:`
   - Should show: `Allowed origins: [..., 'https://doctorseasy.netlify.app']`

2. **Check Frontend**:
   - Visit: `https://doctorseasy.netlify.app`
   - Open browser console (F12)
   - Should see: `🔗 API Base URL: https://your-actual-backend.railway.app/api`
   - ⚠️ Should NOT show: `your-backend-url.railway.app` (that's the placeholder)

3. **Test Login**:
   - Try to login or register
   - Should work without CORS errors
   - Check browser console for any errors

---

## ✅ Verification Checklist

Before testing, verify:

- [ ] `VITE_API_URL` in Netlify = Your actual Railway backend URL + `/api` (not placeholder)
- [ ] `FRONTEND_URL` in Railway = `https://doctorseasy.netlify.app` (exact URL, no trailing slash)
- [ ] Backend code with CORS fixes is deployed (merged to main or deployed from login-issue)
- [ ] Backend has been redeployed after setting `FRONTEND_URL`
- [ ] Frontend has been redeployed after updating `VITE_API_URL`
- [ ] Browser console shows correct backend URL (not placeholder)
- [ ] Backend logs show CORS configuration with Netlify URL
- [ ] No CORS errors in browser console
- [ ] Login/signup works

---

## 🐛 Troubleshooting

### Still seeing CORS error?

1. **Check Backend Logs**:
   - Railway Dashboard → Backend Service → Logs
   - Look for: `❌ CORS blocked origin: https://doctorseasy.netlify.app`
   - Check: `✅ Allowed origins:` - should include your Netlify URL

2. **Check Environment Variables**:
   - Railway: Verify `FRONTEND_URL` is set correctly
   - Netlify: Verify `VITE_API_URL` is set correctly (actual URL, not placeholder)

3. **Verify Backend is Using New Code**:
   - Check Railway logs for: `🔒 CORS Configuration:`
   - If you don't see this, the new code isn't deployed yet

### Still seeing placeholder URL?

- **Netlify `VITE_API_URL`** still has `your-backend-url.railway.app`
- **Fix**: Update to your actual Railway backend URL
- **Redeploy** Netlify after updating

### Backend logs show "FRONTEND_URL: Not set"?

- **Railway `FRONTEND_URL`** is not set or incorrect
- **Fix**: Set `FRONTEND_URL` to `https://doctorseasy.netlify.app` in Railway
- **Redeploy** backend after setting

---

## 📋 Quick Reference

### Environment Variables

**Netlify:**
```env
VITE_API_URL=https://your-actual-backend.railway.app/api
```

**Railway:**
```env
FRONTEND_URL=https://doctorseasy.netlify.app
```

### URLs to Verify

- **Frontend**: https://doctorseasy.netlify.app
- **Backend Health**: https://your-backend.railway.app/api/health
- **Backend API**: https://your-backend.railway.app/api

---

## 🎉 Success Indicators

Your production is fixed when:

- ✅ No CORS errors in browser console
- ✅ Browser console shows: `🔗 API Base URL: https://your-actual-backend.railway.app/api`
- ✅ Backend logs show: `🌐 Allowed frontend URLs: ['https://doctorseasy.netlify.app']`
- ✅ Login/signup works without errors
- ✅ API calls succeed (200 status in Network tab)
- ✅ User can authenticate and access dashboard

---

## 📞 Need Help?

See these guides for more details:
- `QUICK_CORS_FIX.md` - Quick reference
- `CORS_FIX_PRODUCTION.md` - Detailed troubleshooting
- `AUTHENTICATION_SETUP.md` - Full authentication setup guide

---

**Most Important**: Update `VITE_API_URL` in Netlify to your actual backend URL (not the placeholder)!

