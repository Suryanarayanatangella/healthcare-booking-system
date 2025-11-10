# 🔧 CORS Fix for Production - UAT Issues

## 🚨 Problem
```
Access to XMLHttpRequest at 'https://your-backend-url.railway.app/api/auth/login' 
from origin 'https://doctorseasy.netlify.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
The 'Access-Control-Allow-Origin' header has a value 'https://railway.com' 
that is not equal to the supplied origin.
```

## 🔍 Root Causes

1. **Wrong VITE_API_URL**: Netlify still has placeholder `your-backend-url.railway.app` instead of actual backend URL
2. **CORS Misconfiguration**: Backend CORS is not allowing `https://doctorseasy.netlify.app`
3. **FRONTEND_URL Not Set**: Backend doesn't know about your Netlify domain

## ✅ Solution - Step by Step

### Step 1: Get Your Actual Backend URL

1. Go to **Railway Dashboard** → Your Backend Service
2. Copy your **Railway URL** (e.g., `https://your-app-name.railway.app`)
3. **NOT** `your-backend-url.railway.app` - that's a placeholder!

### Step 2: Update Netlify Environment Variable

1. Go to **Netlify Dashboard** → Your Site (`doctorseasy`)
2. **Site settings** → **Environment variables**
3. Find `VITE_API_URL` or create it
4. **Update Value** to: `https://YOUR-ACTUAL-RAILWAY-URL.railway.app/api`
   - Replace `YOUR-ACTUAL-RAILWAY-URL` with your real Railway URL
   - **Must end with `/api`**
   - Example: `https://healthcare-booking-backend.railway.app/api`
5. **Save**

### Step 3: Update Backend CORS Configuration

1. Go to **Railway Dashboard** → Your Backend Service
2. **Variables** tab
3. **Add/Update** environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://doctorseasy.netlify.app`
   - ⚠️ **IMPORTANT**: Use your exact Netlify URL (no trailing slash)
4. **Save**

### Step 4: Redeploy Backend

1. **Railway Dashboard** → Your Backend Service
2. Click **Deployments** → **Redeploy** (or push a new commit)
3. Wait for deployment to complete

### Step 5: Redeploy Frontend

1. **Netlify Dashboard** → Your Site
2. **Deploys** tab
3. **Trigger deploy** → **Clear cache and deploy site**
4. Wait for deployment to complete

### Step 6: Test

1. Visit: `https://doctorseasy.netlify.app`
2. Open **Browser Console** (F12)
3. Check console for: `🔗 API Base URL: https://your-actual-backend.railway.app/api`
4. Try to login
5. Should work now! ✅

---

## 🔍 Verify Configuration

### Check Backend CORS Logs

After redeploying backend, check Railway logs. You should see:
- ✅ No "CORS blocked origin" messages
- ✅ Successful API requests

### Check Frontend API URL

In browser console (F12), you should see:
```
🔗 API Base URL: https://your-actual-backend.railway.app/api
```

**NOT**: `https://your-backend-url.railway.app/api` (that's the placeholder)

### Test Backend Health

Visit in browser: `https://your-actual-backend.railway.app/api/health`

Should see:
```json
{
  "status": "OK",
  "message": "Healthcare Booking API is running"
}
```

---

## 🐛 Troubleshooting

### Issue: Still seeing CORS error

**Check:**
1. ✅ `FRONTEND_URL` is set correctly in Railway (exact Netlify URL)
2. ✅ Backend has been redeployed after setting `FRONTEND_URL`
3. ✅ `VITE_API_URL` is set correctly in Netlify (actual backend URL + `/api`)
4. ✅ Frontend has been redeployed after updating `VITE_API_URL`

**Fix:**
- Verify both environment variables are set correctly
- Redeploy both backend and frontend
- Clear browser cache
- Check Railway logs for CORS messages

### Issue: "Network error" or "Failed to fetch"

**Cause**: Backend URL is wrong or backend is down

**Fix:**
1. Verify backend is running (test `/api/health` endpoint)
2. Check `VITE_API_URL` in Netlify is correct
3. Ensure backend URL starts with `https://` and ends with `/api`

### Issue: Backend URL still shows placeholder

**Cause**: Netlify environment variable not updated or not redeployed

**Fix:**
1. Verify `VITE_API_URL` is set in Netlify (not the placeholder)
2. Redeploy Netlify with "Clear cache"
3. Check browser console to see what URL is being used

---

## 📋 Checklist

Before testing, verify:

- [ ] Backend is deployed on Railway and running
- [ ] Backend URL is known (e.g., `https://your-app.railway.app`)
- [ ] `VITE_API_URL` in Netlify = `https://your-app.railway.app/api` (actual URL, not placeholder)
- [ ] `FRONTEND_URL` in Railway = `https://doctorseasy.netlify.app` (exact Netlify URL)
- [ ] Backend has been redeployed after setting `FRONTEND_URL`
- [ ] Frontend has been redeployed after updating `VITE_API_URL`
- [ ] Browser console shows correct API URL (not placeholder)
- [ ] Backend health endpoint works
- [ ] No CORS errors in browser console

---

## 🎯 Quick Fix Summary

1. **Update Netlify `VITE_API_URL`**: Change from placeholder to actual Railway backend URL + `/api`
2. **Update Railway `FRONTEND_URL`**: Set to `https://doctorseasy.netlify.app`
3. **Redeploy both**: Backend and Frontend
4. **Test**: Login should work

---

## 📞 Still Having Issues?

### Check Railway Logs
1. Go to Railway Dashboard → Your Backend Service
2. Click **Deployments** → **View Logs**
3. Look for CORS-related messages
4. Check if `FRONTEND_URL` is being read correctly

### Check Browser Console
1. Open browser console (F12)
2. Check what API URL is being used
3. Check for specific error messages
4. Check Network tab for failed requests

### Common Mistakes

- ❌ Using placeholder URL instead of actual backend URL
- ❌ Forgetting to add `/api` at the end of `VITE_API_URL`
- ❌ Not redeploying after updating environment variables
- ❌ Wrong `FRONTEND_URL` format (should be exact URL, no trailing slash)
- ❌ Backend not restarted after setting `FRONTEND_URL`

---

## ✅ Success Indicators

Your CORS is fixed when:

- ✅ No CORS errors in browser console
- ✅ API calls succeed (200 status in Network tab)
- ✅ Login/signup works
- ✅ Backend logs show no "CORS blocked" messages
- ✅ Browser console shows correct backend URL (not placeholder)

---

**Next Steps:**
1. Update `VITE_API_URL` in Netlify to your actual backend URL
2. Update `FRONTEND_URL` in Railway to your Netlify URL
3. Redeploy both services
4. Test authentication

The updated backend code now supports better CORS handling with improved logging and support for multiple frontend URLs.

