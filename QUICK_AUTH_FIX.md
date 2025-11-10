# ⚡ Quick Auth Fix - Login/Signup Not Working

## 🎯 The Problem
Your frontend is deployed on Netlify, but login and signup don't work because the **backend API is not connected**.

## 🔍 Quick Diagnosis

### Step 1: Check Browser Console
1. Open your Netlify site
2. Press `F12` → Go to **Console** tab
3. Try to login
4. Look for errors:
   - `Network error` → Backend not connected
   - `404 Not Found` → Wrong API URL
   - `CORS error` → Backend CORS not configured

### Step 2: Check Network Tab
1. Press `F12` → Go to **Network** tab
2. Try to login
3. Look for requests to `/api/auth/login`
4. Check the status:
   - **Failed/Red** → Backend not connected
   - **404** → Wrong URL
   - **CORS error** → CORS issue

## ✅ The Fix

### You Have 2 Options:

---

## Option 1: Backend Already Deployed ⚡ (5 minutes)

If you already have a backend deployed (Railway, Heroku, etc.):

### Step 1: Get Your Backend URL
- Railway: `https://your-app.railway.app`
- Heroku: `https://your-app.herokuapp.com`
- Other: Your backend URL

### Step 2: Set Environment Variable in Netlify
1. Go to **Netlify Dashboard** → Your Site
2. **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api`
   - ⚠️ **IMPORTANT**: Make sure it ends with `/api`
5. Click **Save**

### Step 3: Update Backend CORS (if needed)
1. Go to your backend deployment (Railway/Heroku)
2. Add environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-netlify-site.netlify.app`
3. Restart backend

### Step 4: Redeploy Netlify
1. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**
2. Wait for deployment

### Step 5: Test
- Try to login/signup
- Should work now! ✅

---

## Option 2: Deploy Backend First 🚀 (15 minutes)

If you don't have a backend deployed:

### Step 1: Deploy Backend to Railway

1. **Sign up**: Go to [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. **Select your repository**
4. **Configure**:
   - Root directory: `backend`
   - Railway auto-detects Node.js
5. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-secret-key-here
   FRONTEND_URL=https://your-netlify-site.netlify.app
   ```
   ⚠️ **Generate JWT_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
6. **Deploy** - Railway auto-deploys
7. **Get URL**: `https://your-app.railway.app`

### Step 2: Set Frontend Environment Variable

1. **Netlify Dashboard** → Your Site
2. **Site settings** → **Environment variables**
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-app.railway.app/api`
4. **Save**

### Step 3: Redeploy Netlify

1. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### Step 4: Test

- Try to register a new account
- Try to login
- Should work! ✅

---

## 🧪 Verify It's Working

### Test Backend
Visit in browser: `https://your-backend-url.com/api/health`

Should see:
```json
{
  "status": "OK",
  "message": "Healthcare Booking API is running"
}
```

### Test Frontend
1. Open your Netlify site
2. Try to register/login
3. Check browser console (F12) - no errors
4. Check Network tab - API calls show 200 status

---

## 🐛 Common Issues

### "Network error" or "Failed to fetch"
- **Fix**: Backend not deployed or wrong URL
- **Solution**: Deploy backend or check `VITE_API_URL`

### "404 Not Found"
- **Fix**: Wrong API URL (missing `/api`)
- **Solution**: Ensure `VITE_API_URL` ends with `/api`

### "CORS error"
- **Fix**: Backend CORS not configured
- **Solution**: Set `FRONTEND_URL` in backend environment variables

### Still not working?
1. Check browser console for specific errors
2. Verify backend is running (test `/api/health`)
3. Verify `VITE_API_URL` is set correctly
4. Verify backend CORS allows your Netlify domain
5. Clear browser cache and try again

---

## ✅ Success Checklist

- [ ] Backend is deployed and running
- [ ] `VITE_API_URL` is set in Netlify (ends with `/api`)
- [ ] `FRONTEND_URL` is set in backend (your Netlify URL)
- [ ] Netlify has been redeployed
- [ ] Backend health endpoint works
- [ ] Login/signup works
- [ ] No errors in browser console

---

## 📞 Need More Help?

See `AUTH_FIX_GUIDE.md` for detailed troubleshooting.

---

**Most Common Issue**: Forgetting to set `VITE_API_URL` in Netlify environment variables!

**Quick Fix**: Set `VITE_API_URL` to your backend URL + `/api` in Netlify, then redeploy.

