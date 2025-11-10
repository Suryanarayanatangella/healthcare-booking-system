# 🚀 Start App Locally - Quick Guide

## 📋 Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

## ⚡ Quick Start (2 Steps)

### Step 1: Start Backend Server

**Open Terminal 1:**
```bash
cd backend
npm install
npm run demo
```

**Expected Output:**
```
🚀 Demo server running on port 5000
✅ Server ready for testing
```

### Step 2: Start Frontend Server

**Open Terminal 2 (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 500ms
  ➜  Local:   http://localhost:3000/
```

### Step 3: Open in Browser

Visit: **http://localhost:3000**

---

## 🎯 Test Login/Signup

### Demo Accounts (if using demo server):
- **Patient**: `patient@demo.com` / `password123`
- **Doctor**: `doctor@demo.com` / `password123`

### Or Register New Account:
1. Click "Create one now" on login page
2. Fill in the registration form
3. Submit and login

---

## 🔧 If You Have Issues

### Backend Issues:
- **Port 5000 already in use**: Change PORT in backend/.env or kill process using port 5000
- **Dependencies not installed**: Run `npm install` in backend directory
- **Database connection error**: The demo server works without database, so this shouldn't be an issue

### Frontend Issues:
- **Port 3000 already in use**: Vite will automatically use the next available port
- **Dependencies not installed**: Run `npm install` in frontend directory
- **API connection error**: Make sure backend is running on port 5000

---

## ✅ Verify It's Working

1. **Backend Health Check**: Visit http://localhost:5000/api/health
   - Should see: `{"status": "OK", "message": "Healthcare Booking API is running"}`

2. **Frontend**: Visit http://localhost:3000
   - Should see the homepage

3. **Login**: Try to login with demo credentials or register new account
   - Should work without errors

---

## 🎉 Success!

If everything works locally, you can then:
1. Deploy backend to Railway/Heroku
2. Deploy frontend to Netlify
3. Set environment variables in production
4. Test authentication in production

---

**Need help?** Check browser console (F12) for any errors.

