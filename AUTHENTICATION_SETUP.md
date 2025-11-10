# 🔐 Authentication Setup - Fix Login/Signup Issues

## 🎯 Problem
Login and signup are not working on your Netlify-deployed site.

## 🔍 Root Cause
The frontend is deployed on Netlify, but it's trying to connect to a backend API that is either:
1. **Not deployed** - No backend server running
2. **Not configured** - `VITE_API_URL` environment variable is not set in Netlify

## ✅ Solution Overview

You need to:
1. **Deploy the backend** (if not already deployed)
2. **Set `VITE_API_URL`** in Netlify environment variables
3. **Configure backend CORS** to allow your Netlify domain
4. **Redeploy** the frontend

---

## 🚀 Step-by-Step Fix

### Step 1: Check if Backend is Deployed

**Test your backend:**
1. If you have a backend URL, visit: `https://your-backend-url.com/api/health`
2. You should see: `{"status": "OK", "message": "Healthcare Booking API is running"}`

**If you see this:**
- ✅ **Backend is deployed** → Go to Step 2
- ❌ **Backend is not deployed** → Go to Step 1A

---

### Step 1A: Deploy Backend (If Not Deployed)

#### Option A: Deploy to Railway (Recommended - Free tier available)

1. **Sign up**: Go to [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. **Select your repository**
4. **Configure Service**:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
5. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=generate-a-random-secret-here
   FRONTEND_URL=https://your-netlify-site.netlify.app
   ```
   
   **Generate JWT_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
6. **Deploy** - Railway will automatically deploy
7. **Get your backend URL**: `https://your-app.railway.app`
8. **Test**: Visit `https://your-app.railway.app/api/health`

#### Option B: Deploy to Render (Alternative)

1. Go to [render.com](https://render.com)
2. **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - Name: `healthcare-booking-backend`
   - Environment: `Node`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables (same as Railway)
6. Deploy

#### Option C: Deploy to Heroku (Alternative)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set config vars (same as Railway)
5. Deploy: `git push heroku main`

---

### Step 2: Set Environment Variable in Netlify

1. **Go to Netlify Dashboard**: [app.netlify.com](https://app.netlify.com)
2. **Select your site**
3. **Site settings** → **Environment variables**
4. **Add a variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api`
   - ⚠️ **IMPORTANT**: 
     - Must start with `https://` (not `http://`)
     - Must end with `/api`
     - Example: `https://your-app.railway.app/api`
5. **Scopes**: Select "All scopes" or "Production"
6. **Save**

---

### Step 3: Configure Backend CORS

Your backend needs to allow requests from your Netlify domain.

1. **Go to your backend deployment** (Railway/Heroku/Render)
2. **Environment variables** → **Add/Update**:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-netlify-site.netlify.app`
3. **Save/Restart** backend

**Note**: Your backend server.js already has CORS configured to use `process.env.FRONTEND_URL`, so just setting this variable should work.

---

### Step 4: Redeploy Netlify

1. **Go to Netlify Dashboard** → Your Site
2. **Deploys** tab
3. **Trigger deploy** → **Clear cache and deploy site**
4. **Wait** for deployment to complete (2-5 minutes)

---

### Step 5: Test Authentication

1. **Visit your Netlify site**
2. **Open Browser Console** (F12)
3. **Check Console** - You should see: `🔗 API Base URL: https://your-backend-url.com/api`
4. **Try to register** a new account
5. **Try to login**
6. **Check for errors** in console

---

## 🧪 Verification

### Test Backend
```bash
# Visit in browser or use curl
curl https://your-backend-url.com/api/health
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "Healthcare Booking API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### Test Frontend
1. **Open browser console** (F12)
2. **Check API URL**: Should show your backend URL
3. **Try login/signup**: Should work without errors
4. **Check Network tab**: API calls should show 200 status

---

## 🐛 Troubleshooting

### Issue: "Network error" or "Failed to fetch"

**Cause**: Backend not deployed or wrong URL

**Fix**:
1. Verify backend is deployed and running
2. Test backend health endpoint
3. Check `VITE_API_URL` is set correctly in Netlify
4. Ensure URL starts with `https://` and ends with `/api`

### Issue: "404 Not Found"

**Cause**: Wrong API URL or backend routes not working

**Fix**:
1. Ensure `VITE_API_URL` ends with `/api`
2. Test backend endpoints directly
3. Check backend routes are configured correctly

### Issue: "CORS error"

**Cause**: Backend CORS not configured for Netlify domain

**Fix**:
1. Set `FRONTEND_URL` in backend environment variables
2. Ensure it matches your Netlify URL exactly
3. Restart backend after setting environment variable

### Issue: "401 Unauthorized" or "Invalid credentials"

**Cause**: Authentication issue (different from connection issue)

**Fix**:
1. Try registering a new account first
2. Check if user exists in database
3. Verify JWT_SECRET is set in backend

---

## 📋 Checklist

Before testing, verify:

- [ ] Backend is deployed and running
- [ ] Backend health endpoint works (`/api/health`)
- [ ] `VITE_API_URL` is set in Netlify environment variables
- [ ] `VITE_API_URL` is correct (starts with `https://`, ends with `/api`)
- [ ] `FRONTEND_URL` is set in backend environment variables
- [ ] `FRONTEND_URL` matches your Netlify URL exactly
- [ ] Netlify has been redeployed after setting environment variable
- [ ] Backend has been restarted after setting environment variables
- [ ] Browser console shows correct API URL
- [ ] No CORS errors in browser console

---

## 🎯 Quick Reference

### Environment Variables

**Netlify (Frontend):**
```env
VITE_API_URL=https://your-backend-url.com/api
```

**Backend (Railway/Heroku/Render):**
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://your-netlify-site.netlify.app
```

### URLs to Test

- **Backend Health**: `https://your-backend-url.com/api/health`
- **Frontend**: `https://your-netlify-site.netlify.app`
- **Login**: `https://your-netlify-site.netlify.app/login`
- **Register**: `https://your-netlify-site.netlify.app/register`

---

## ✅ Success Indicators

Your authentication is working when:

- ✅ Browser console shows: `🔗 API Base URL: https://your-backend-url.com/api`
- ✅ Registration form submits successfully
- ✅ Login form submits successfully
- ✅ User is redirected to dashboard after login
- ✅ No errors in browser console
- ✅ API calls show 200 status in Network tab
- ✅ Token is stored in localStorage

---

## 📞 Still Having Issues?

1. **Check browser console** (F12) for specific errors
2. **Check Network tab** to see API requests and responses
3. **Check backend logs** (Railway/Heroku dashboard)
4. **Verify environment variables** are set correctly
5. **Test backend endpoints** directly (use Postman or curl)

---

## 📚 Additional Resources

- **Detailed Guide**: See `AUTH_FIX_GUIDE.md`
- **Quick Fix**: See `QUICK_AUTH_FIX.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Backend Setup**: See `SETUP.md`

---

**Most Common Issue**: `VITE_API_URL` not set in Netlify environment variables!

**Quick Fix**: Set `VITE_API_URL` to your backend URL + `/api` in Netlify, then redeploy.

