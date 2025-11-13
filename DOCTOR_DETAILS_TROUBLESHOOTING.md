# 🔧 Doctor Details Page - Troubleshooting Guide

## Issue Reported
Getting "Doctor Not Found" when accessing `http://localhost:3000/doctors/1`

## Root Cause Identified

### ❌ Wrong Port
You're accessing: `http://localhost:3000/doctors/1`
Frontend is running on: `http://localhost:3001/`

**Port 3000 is in use by another application**, so Vite automatically switched to port 3001.

## ✅ Solution

### Use the Correct URL
Access the doctor details page at:
```
http://localhost:3001/doctors/1
```

## Quick Test

### Test Doctor 1 (Dr. Sarah Johnson)
```
URL: http://localhost:3001/doctors/1
Expected: Full doctor profile with schedule
```

### Test Doctor 2 (Dr. Michael Williams)
```
URL: http://localhost:3001/doctors/2
Expected: Full doctor profile with schedule
```

### Test Invalid Doctor
```
URL: http://localhost:3001/doctors/999
Expected: "Doctor Not Found" message
```

## Verification Steps

### Step 1: Check Frontend Port
```bash
# Look at the terminal output
Port 3000 is in use, trying another one...
➜  Local:   http://localhost:3001/
```

### Step 2: Access Correct URL
1. Go to: `http://localhost:3001/doctors`
2. Click "View Profile" on any doctor
3. URL should be: `http://localhost:3001/doctors/1` or `/doctors/2`

### Step 3: Verify Backend
```bash
# Test backend endpoint
curl http://localhost:5000/api/doctors/1
# Should return 200 OK with doctor data
```

## What You Should See

### Doctor Details Page (Working)

```
┌─────────────────────────────────────────────┐
│  [← Back to Doctors]                        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  👤  Dr. Sarah Johnson              │   │
│  │      Cardiology                     │   │
│  │      ⭐ 4.8 (124 reviews)           │   │
│  │                                     │   │
│  │  🕐 15 years experience             │   │
│  │  💰 $200 consultation fee           │   │
│  │  📍 Available for appointments      │   │
│  │                                     │   │
│  │  About:                             │   │
│  │  Experienced cardiologist...        │   │
│  │                                     │   │
│  │  Schedule:                          │   │
│  │  Monday: 09:00 AM - 05:00 PM       │   │
│  │  Tuesday: 09:00 AM - 05:00 PM      │   │
│  │  ...                                │   │
│  │                                     │   │
│  │  [Book Appointment]                 │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Doctor Not Found (Error State)

```
┌─────────────────────────────────────────────┐
│                                             │
│              Doctor Not Found               │
│                                             │
│  The doctor you're looking for doesn't      │
│  exist or is not available.                 │
│                                             │
│         [Back to Doctors]                   │
│                                             │
└─────────────────────────────────────────────┘
```

## Common Issues & Solutions

### Issue 1: Wrong Port
**Problem**: Accessing port 3000 instead of 3001
**Solution**: Use `http://localhost:3001`

### Issue 2: Backend Not Running
**Problem**: Backend server is down
**Solution**: 
```bash
cd backend
node demo-server.js
```

### Issue 3: Invalid Doctor ID
**Problem**: Doctor ID doesn't exist
**Solution**: Use ID 1 or 2 (only 2 doctors in demo)

### Issue 4: Browser Cache
**Problem**: Old data cached
**Solution**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue 5: API URL Misconfigured
**Problem**: Frontend can't reach backend
**Solution**: Check `frontend/.env` has `VITE_API_URL=http://localhost:5000/api`

## Testing Checklist

### ✅ Basic Tests
- [ ] Frontend running on port 3001
- [ ] Backend running on port 5000
- [ ] Can access http://localhost:3001/doctors
- [ ] Can click "View Profile" button
- [ ] URL changes to /doctors/1 or /doctors/2
- [ ] Doctor details page loads

### ✅ Doctor 1 (Dr. Sarah Johnson)
- [ ] Access http://localhost:3001/doctors/1
- [ ] See doctor name and photo placeholder
- [ ] See specialization: Cardiology
- [ ] See experience: 15 years
- [ ] See fee: $200
- [ ] See bio text
- [ ] See schedule (Mon-Fri)
- [ ] See "Book Appointment" button

### ✅ Doctor 2 (Dr. Michael Williams)
- [ ] Access http://localhost:3001/doctors/2
- [ ] See doctor name
- [ ] See specialization: General Practice
- [ ] See experience: 8 years
- [ ] See fee: $100
- [ ] See bio text
- [ ] See schedule
- [ ] See "Book Appointment" button

### ✅ Error Handling
- [ ] Access http://localhost:3001/doctors/999
- [ ] See "Doctor Not Found" message
- [ ] See "Back to Doctors" button
- [ ] Button works and navigates back

## API Endpoints Status

### ✅ GET /api/doctors
- **Status**: Working
- **Returns**: List of doctors
- **Test**: http://localhost:5000/api/doctors

### ✅ GET /api/doctors/:id
- **Status**: Working
- **Returns**: Single doctor with schedule
- **Test**: http://localhost:5000/api/doctors/1

### ✅ GET /api/doctors/specializations
- **Status**: Working (Fixed)
- **Returns**: List of specializations
- **Test**: http://localhost:5000/api/doctors/specializations

## Browser Console Check

Open browser console (F12) and check for:

### ✅ No Errors
```
No errors should appear
```

### ✅ Successful API Calls
```
GET http://localhost:5000/api/doctors/1 200 OK
```

### ❌ If You See Errors
```
GET http://localhost:5000/api/doctors/1 404 Not Found
→ Backend not running or doctor doesn't exist

GET http://localhost:5000/api/doctors/1 Failed to fetch
→ Backend not running or CORS issue

GET http://localhost:3000/api/doctors/1 Failed to fetch
→ Wrong port! Use 3001
```

## Network Tab Check

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `/api/doctors/1` request
5. Should show:
   - **Status**: 200 OK
   - **Response**: JSON with doctor data

## Quick Fix Commands

### Restart Frontend
```bash
cd frontend
npm run dev
# Note the port it starts on (should be 3001)
```

### Restart Backend
```bash
cd backend
node demo-server.js
# Should show: running on port 5000
```

### Check Ports
```bash
# Windows
netstat -ano | findstr :3001
netstat -ano | findstr :5000

# Should see both ports in use
```

## Correct URLs Reference

### Frontend URLs (Port 3001)
- Home: http://localhost:3001/
- Doctors List: http://localhost:3001/doctors
- Doctor 1 Details: http://localhost:3001/doctors/1
- Doctor 2 Details: http://localhost:3001/doctors/2
- Book Appointment: http://localhost:3001/book-appointment

### Backend URLs (Port 5000)
- Health Check: http://localhost:5000/api/health
- Doctors List: http://localhost:5000/api/doctors
- Doctor Details: http://localhost:5000/api/doctors/1
- Specializations: http://localhost:5000/api/doctors/specializations

## Summary

### The Issue
❌ Accessing `http://localhost:3000/doctors/1` (wrong port)

### The Solution
✅ Access `http://localhost:3001/doctors/1` (correct port)

### Why Port 3001?
Port 3000 is already in use by another application, so Vite automatically chose port 3001.

### How to Verify
1. Check terminal output for frontend
2. Look for: `Local: http://localhost:3001/`
3. Use that URL for all frontend pages

## Test Now!

Try these URLs:
1. ✅ http://localhost:3001/doctors (List)
2. ✅ http://localhost:3001/doctors/1 (Dr. Sarah Johnson)
3. ✅ http://localhost:3001/doctors/2 (Dr. Michael Williams)

All should work perfectly! 🎉
