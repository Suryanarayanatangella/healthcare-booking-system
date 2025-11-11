# ⚡ Quick CORS Fix - Production UAT

## 🚨 Your Error
```
CORS policy: The 'Access-Control-Allow-Origin' header has a value 'https://railway.com' 
that is not equal to the supplied origin 'https://doctorseasy.netlify.app'
```

## ✅ Fix in 3 Steps

### Step 1: Update Netlify Environment Variable (2 minutes)

1. Go to **Netlify Dashboard** → Your Site (`doctorseasy`)
2. **Site settings** → **Environment variables**
3. Find `VITE_API_URL`
4. **Change from**: `https://your-backend-url.railway.app/api`
5. **Change to**: `https://YOUR-ACTUAL-BACKEND-URL.railway.app/api`
   - Replace `YOUR-ACTUAL-BACKEND-URL` with your real Railway backend URL
   - Example: If your Railway URL is `https://healthcare-backend-abc123.railway.app`
   - Then set: `https://healthcare-backend-abc123.railway.app/api`
6. **Save**

### Step 2: Update Railway Environment Variable (2 minutes)

1. Go to **Railway Dashboard** → Your Backend Service
2. **Variables** tab
3. Find or create `FRONTEND_URL`
4. **Set value to**: `https://doctorseasy.netlify.app`
   - ⚠️ Exact URL, no trailing slash
   - ⚠️ Must match your Netlify URL exactly
5. **Save**

### Step 3: Redeploy Both (5 minutes)

1. **Railway**: Redeploy your backend service
2. **Netlify**: Trigger new deploy → Clear cache and deploy site
3. **Wait** for both to complete

### Step 4: Test

1. Visit: `https://doctorseasy.netlify.app`
2. Open browser console (F12)
3. Check: Should see `🔗 API Base URL: https://your-actual-backend.railway.app/api`
4. Try login - should work! ✅

---

## 🔍 How to Find Your Railway Backend URL

1. Go to **Railway Dashboard**
2. Click on your backend service
3. Go to **Settings** tab
4. Look for **Public Domain** or **Railway Domain**
5. Copy the URL (e.g., `https://your-app-name.railway.app`)
6. That's your backend URL!

---

## ✅ Verification Checklist

- [ ] `VITE_API_URL` in Netlify = Your actual Railway URL + `/api` (not placeholder)
- [ ] `FRONTEND_URL` in Railway = `https://doctorseasy.netlify.app` (exact URL)
- [ ] Both services redeployed
- [ ] Browser console shows correct backend URL
- [ ] No CORS errors
- [ ] Login works

---

## 🐛 Still Not Working?

### Check These:

1. **Backend URL**: Is it the actual Railway URL? (not `your-backend-url.railway.app`)
2. **Frontend URL**: Does it match exactly? (case-sensitive, no trailing slash)
3. **Redeployed**: Did you redeploy both after changing variables?
4. **Browser Cache**: Clear browser cache and try again

### Common Mistakes:

- ❌ Using placeholder URL instead of actual backend URL
- ❌ Wrong `FRONTEND_URL` (typo, wrong domain, trailing slash)
- ❌ Not redeploying after changing environment variables
- ❌ Browser cache showing old errors

---

## 📞 Need More Help?

See `CORS_FIX_PRODUCTION.md` for detailed troubleshooting.

---

**Most Common Issue**: `VITE_API_URL` still has the placeholder `your-backend-url.railway.app` instead of your actual Railway backend URL!

**Quick Fix**: Update `VITE_API_URL` in Netlify to your actual backend URL + `/api`, then redeploy.

