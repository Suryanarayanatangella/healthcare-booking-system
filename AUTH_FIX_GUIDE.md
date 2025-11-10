# 🔐 Authentication Fix Guide - Login & Signup Issues

## Problem
Unable to login or signup on the deployed Netlify site.

## Root Cause
The frontend is deployed on Netlify, but the **backend API is not connected**. The frontend needs the `VITE_API_URL` environment variable set to point to your backend server.

## Quick Diagnosis

### Check Browser Console
1. Open your Netlify site
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try to login or signup
5. Look for errors like:
   - `Network error` or `Failed to fetch`
   - `404 Not Found` when calling `/api/auth/login`
   - `CORS error`

### Common Errors
- **"Network error"** → Backend not deployed or wrong URL
- **"404 Not Found"** → API endpoint doesn't exist or wrong URL
- **"CORS error"** → Backend not configured to allow your Netlify domain

## ✅ Solution: Connect Backend to Frontend

### Option 1: Backend Already Deployed

If you have a backend deployed (Railway, Heroku, Render, etc.):

#### Step 1: Get Your Backend URL
- Railway: `https://your-app.railway.app`
- Heroku: `https://your-app.herokuapp.com`
- Render: `https://your-app.onrender.com`
- Other: Your backend URL

#### Step 2: Set Environment Variable in Netlify

1. Go to **Netlify Dashboard** → Your Site
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api`
   - **Scopes**: Select "All scopes" or "Production"
5. Click **Save**

#### Step 3: Redeploy
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for deployment to complete

#### Step 4: Test
- Try to login/signup
- Check browser console for errors
- Verify API calls are going to the correct URL

---

### Option 2: Deploy Backend First

If you don't have a backend deployed yet:

#### Step 1: Deploy Backend to Railway (Recommended)

1. **Sign up at [railway.app](https://railway.app)**
2. **Create New Project** → **Deploy from GitHub repo**
3. **Select your repository**
4. **Configure Service**:
   - Root directory: `backend`
   - Railway will auto-detect Node.js
5. **Add Environment Variables** (in Railway dashboard):
   ```env
   NODE_ENV=production
   PORT=5000
   
   # Database (if using Supabase/PostgreSQL)
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your-password
   DB_SSL=true
   
   # JWT Secret (generate one)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Frontend URL (your Netlify URL)
   FRONTEND_URL=https://your-netlify-site.netlify.app
   
   # CORS (important!)
   CORS_ORIGIN=https://your-netlify-site.netlify.app
   ```
6. **Deploy** - Railway will automatically deploy
7. **Get your backend URL**: `https://your-app.railway.app`

#### Step 2: Configure Frontend (Netlify)

1. Go to **Netlify Dashboard** → Your Site
2. **Site settings** → **Environment variables**
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-app.railway.app/api`
4. **Save**

#### Step 3: Redeploy Netlify

1. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

#### Step 4: Test Authentication

1. Visit your Netlify site
2. Try to register a new account
3. Try to login
4. Check browser console for errors

---

## 🔍 Verify Backend is Working

### Test Backend Health Endpoint
Visit in browser: `https://your-backend-url.com/api/health`

You should see a JSON response like:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### Test Authentication Endpoint
Use a tool like Postman or curl:
```bash
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User",
    "role": "patient"
  }'
```

---

## 🐛 Troubleshooting

### Issue: "Network error" or "Failed to fetch"

**Possible causes:**
1. Backend not deployed
2. Wrong API URL
3. Backend server is down
4. CORS not configured

**Solutions:**
1. Verify backend is deployed and running
2. Check `VITE_API_URL` is set correctly in Netlify
3. Test backend health endpoint
4. Check backend CORS configuration allows your Netlify domain

### Issue: "404 Not Found"

**Possible causes:**
1. Wrong API URL (missing `/api` prefix)
2. Backend routes not configured correctly

**Solutions:**
1. Ensure `VITE_API_URL` ends with `/api`
2. Check backend routes are set up correctly
3. Test backend endpoints directly

### Issue: "CORS error"

**Possible causes:**
1. Backend CORS not configured for Netlify domain
2. Missing CORS headers

**Solutions:**
1. Update backend CORS configuration to include your Netlify URL
2. Check backend `server.js` or `app.js` for CORS settings
3. Ensure `FRONTEND_URL` environment variable is set in backend

### Issue: "401 Unauthorized" or "Invalid credentials"

**Possible causes:**
1. User doesn't exist (for login)
2. Wrong password
3. JWT token issues

**Solutions:**
1. Try registering a new account first
2. Check if user exists in database
3. Verify JWT_SECRET is set in backend

---

## 📋 Checklist

- [ ] Backend is deployed and running
- [ ] Backend health endpoint works (`/api/health`)
- [ ] `VITE_API_URL` is set in Netlify environment variables
- [ ] `VITE_API_URL` points to correct backend URL with `/api` suffix
- [ ] Backend CORS is configured to allow Netlify domain
- [ ] Netlify site has been redeployed after setting environment variable
- [ ] Browser console shows no errors
- [ ] API calls are going to the correct URL (check Network tab)

---

## 🚀 Quick Fix Steps

1. **Check if backend is deployed**
   - Visit backend URL: `https://your-backend-url.com/api/health`
   - If not deployed, deploy to Railway/Heroku/Render

2. **Set environment variable in Netlify**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com/api`

3. **Redeploy Netlify**
   - Clear cache and redeploy

4. **Test**
   - Try login/signup
   - Check browser console

---

## 📞 Still Having Issues?

### Check These:

1. **Browser Console** (F12) - Look for specific error messages
2. **Network Tab** (F12) - Check if API calls are being made and what the response is
3. **Backend Logs** - Check Railway/Heroku logs for errors
4. **Environment Variables** - Verify they're set correctly in both Netlify and backend

### Common Mistakes:

- ❌ Forgetting to add `/api` to the end of `VITE_API_URL`
- ❌ Using `http://` instead of `https://` for production
- ❌ Not redeploying after setting environment variable
- ❌ CORS not configured in backend
- ❌ Backend not deployed or server is down

---

## ✅ Success Indicators

Your authentication is working when:
- ✅ Registration form submits successfully
- ✅ Login form submits successfully
- ✅ User is redirected to dashboard after login
- ✅ No errors in browser console
- ✅ API calls show 200 status in Network tab
- ✅ Token is stored in localStorage

---

**Next Steps:**
1. Deploy backend (if not deployed)
2. Set `VITE_API_URL` in Netlify
3. Redeploy Netlify
4. Test authentication

If you need help deploying the backend, see `DEPLOYMENT_GUIDE.md` or `START_HERE_DEPLOYMENT.md`.

