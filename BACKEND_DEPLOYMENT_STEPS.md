# Backend Deployment Steps

## Current Issue
Your frontend is deployed at: `https://doctorseasy.netlify.app`
But the backend URL is still a placeholder: `https://your-backend-url.railway.app/api`

## Quick Fix Options

### Option 1: Deploy to Railway (Recommended - Free tier available)

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your repository**: `healthcare-booking-system`
5. **Configure**:
   - Root Directory: `backend`
   - Start Command: `npm start`
6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://doctorseasy.netlify.app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Database (Railway will provide PostgreSQL)
   DATABASE_URL=<Railway will auto-fill this>
   
   # Email (optional for now)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```
7. **Deploy** - Railway will give you a URL like: `https://healthcare-booking-production.up.railway.app`

### Option 2: Deploy to Render (Free tier available)

1. **Go to Render**: https://render.com
2. **Sign up/Login** with GitHub
3. **New** → **Web Service**
4. **Connect your repository**
5. **Configure**:
   - Name: `healthcare-booking-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. **Add Environment Variables** (same as above)
7. **Create Web Service**

### Option 3: Use Mock Backend (Temporary)

If you want to test the frontend without a real backend, I can set up a mock API.

## After Backend Deployment

Once you have your backend URL (e.g., `https://healthcare-booking-production.up.railway.app`):

### 1. Update Netlify Environment Variables

Go to Netlify Dashboard:
- Site settings → Environment variables → Add variables
- Add: `VITE_API_URL` = `https://your-actual-backend-url.railway.app/api`
- Click **Save**
- Go to Deploys → Trigger deploy → **Clear cache and deploy site**

### 2. Update Backend CORS

Make sure your backend has this environment variable:
```
FRONTEND_URL=https://doctorseasy.netlify.app
```

This is already configured in your `backend/server.js` file!

## Current Status

✅ Frontend deployed: https://doctorseasy.netlify.app
❌ Backend not deployed yet
❌ VITE_API_URL not configured in Netlify

## What would you like to do?

1. Deploy backend to Railway (I can guide you)
2. Deploy backend to Render (I can guide you)
3. Use a different platform
4. Set up mock backend for testing
