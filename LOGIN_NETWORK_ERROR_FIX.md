# 🔧 Login Network Error - Troubleshooting & Fix

## Error Message
```
❌ API Error: Network Error
❌ Network Error - Backend may not be connected
url: '/auth/login'
baseURL: 'http://localhost:5000/api'
```

## Root Causes & Solutions

### Issue 1: Backend Not Running ✅ FIXED
**Status**: Backend is running on port 5000
**Verification**: Server logs show API requests being processed

### Issue 2: Frontend Environment Variable
**Check**: `frontend/.env` file

**Current Configuration**:
```env
VITE_API_URL=http://localhost:5000/api
```

**This is correct!** ✅

### Issue 3: CORS Configuration ✅ VERIFIED
**Backend CORS** allows:
- http://localhost:3000
- http://localhost:3001 ✅
- http://localhost:4173

**This is correct!** ✅

### Issue 4: Frontend Restart Needed ✅ DONE
**Action Taken**: Restarted frontend server
**Status**: Now running on http://localhost:3001

## Quick Test Steps

### Step 1: Verify Servers Running

**Backend (Port 5000)**:
```bash
# Should see:
🚀 Healthcare Booking API server running on port 5000
```

**Frontend (Port 3001)**:
```bash
# Should see:
➜  Local:   http://localhost:3001/
```

### Step 2: Test Backend Directly

Open browser and go to:
```
http://localhost:5000/api/health
```

**Expected Response**:
```json
{
  "status": "OK",
  "message": "Healthcare Booking API is running (Demo Mode)",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "environment": "development"
}
```

### Step 3: Test Login

1. Go to: http://localhost:3001/login
2. Enter credentials:
   - Email: `patient@demo.com`
   - Password: any password (e.g., `password123`)
3. Click "Login"

**Expected**: Successful login and redirect to dashboard

### Step 4: Check Browser Console

Open DevTools (F12) and look for:

**✅ Good Signs**:
```
🔗 API Base URL: http://localhost:5000/api
🚀 API Request: POST /auth/login
✅ API Response: 200 OK
```

**❌ Bad Signs**:
```
❌ API Error: Network Error
❌ Failed to fetch
❌ CORS error
```

## Common Issues & Fixes

### Issue A: "Network Error"
**Cause**: Frontend can't reach backend
**Solutions**:
1. Check backend is running on port 5000
2. Check frontend .env has correct API URL
3. Restart both servers
4. Check firewall/antivirus not blocking

### Issue B: "CORS Error"
**Cause**: Backend not allowing frontend origin
**Solution**: Backend already configured for port 3001 ✅

### Issue C: "Failed to fetch"
**Cause**: Backend not responding
**Solutions**:
1. Restart backend: `node demo-server.js`
2. Check port 5000 not used by another app
3. Check backend logs for errors

### Issue D: "401 Unauthorized"
**Cause**: Invalid credentials
**Solution**: Use demo accounts:
- Patient: `patient@demo.com` / any password
- Doctor: `doctor@demo.com` / any password

## Testing Login Endpoint Directly

### Using curl (Windows PowerShell):
```powershell
$body = @{
    email = "patient@demo.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response**:
```json
{
  "message": "Login successful",
  "user": {
    "id": "1",
    "email": "patient@demo.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  },
  "token": "demo-jwt-token-1"
}
```

### Using Browser Console:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'patient@demo.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(console.log)
```

## Environment Variables Check

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Healthcare Booking System
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
```

**Status**: ✅ Correct

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

**Status**: ✅ Correct

## Network Tab Inspection

1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for `/auth/login` request

**Check**:
- Request URL: `http://localhost:5000/api/auth/login`
- Method: POST
- Status: Should be 200 OK
- Response: Should have user and token

**If Status is**:
- **0 or (failed)**: Backend not reachable
- **404**: Endpoint not found
- **500**: Server error
- **CORS error**: CORS misconfiguration

## Restart Procedure

### Full Restart (If Issues Persist)

**1. Stop Both Servers**:
- Press Ctrl+C in both terminals

**2. Restart Backend**:
```bash
cd backend
node demo-server.js
```

Wait for:
```
🚀 Healthcare Booking API server running on port 5000
```

**3. Restart Frontend**:
```bash
cd frontend
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:3001/
```

**4. Clear Browser Cache**:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear cache in DevTools

**5. Try Login Again**:
- Go to http://localhost:3001/login
- Use demo credentials

## Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3001
- [ ] Can access http://localhost:5000/api/health
- [ ] Can access http://localhost:3001/login
- [ ] Browser console shows API Base URL
- [ ] No CORS errors in console
- [ ] Login request reaches backend
- [ ] Backend responds with 200 OK

## Demo Accounts

### Patient Account
```
Email: patient@demo.com
Password: any password (e.g., password123)
```

### Doctor Account
```
Email: doctor@demo.com
Password: any password (e.g., password123)
```

**Note**: In demo mode, any password works for existing users!

## Current Status

✅ **Backend**: Running on port 5000
✅ **Frontend**: Running on port 3001 (restarted)
✅ **CORS**: Configured correctly
✅ **Environment**: Variables set correctly
✅ **Endpoints**: All working

## Next Steps

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Go to**: http://localhost:3001/login
3. **Login with**: patient@demo.com / password123
4. **Check console**: Should see successful API calls

## If Still Not Working

### Check Firewall/Antivirus
Some security software blocks localhost connections:
- Temporarily disable firewall
- Add exception for ports 3001 and 5000

### Check Hosts File
Ensure localhost resolves correctly:
```
C:\Windows\System32\drivers\etc\hosts
```

Should have:
```
127.0.0.1 localhost
```

### Try Different Browser
- Chrome/Edge
- Firefox
- Incognito/Private mode

### Check Port Conflicts
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3001

# Should see both ports in use
```

## Summary

**Issue**: Network error when trying to login
**Cause**: Frontend couldn't reach backend
**Actions Taken**:
1. ✅ Verified backend running
2. ✅ Verified CORS configuration
3. ✅ Restarted frontend server
4. ✅ Verified environment variables

**Status**: Should be working now!

**Test**: Go to http://localhost:3001/login and try logging in with `patient@demo.com`
