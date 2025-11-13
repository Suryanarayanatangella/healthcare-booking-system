# 🔌 Port Reference Guide

## Current Server Ports

### Frontend (React + Vite)
```
Port: 3001
URL:  http://localhost:3001
```

**Why 3001?**
Port 3000 is already in use by another application, so Vite automatically switched to 3001.

### Backend (Express API)
```
Port: 5000
URL:  http://localhost:5000
```

## ⚠️ Important: Use Port 3001 for Frontend

### ❌ Wrong URLs (Port 3000)
```
http://localhost:3000/
http://localhost:3000/doctors
http://localhost:3000/doctors/1
```

### ✅ Correct URLs (Port 3001)
```
http://localhost:3001/
http://localhost:3001/doctors
http://localhost:3001/doctors/1
```

## Quick Reference

### Frontend Pages (Port 3001)

| Page | URL |
|------|-----|
| Home | http://localhost:3001/ |
| Login | http://localhost:3001/login |
| Register | http://localhost:3001/register |
| Dashboard | http://localhost:3001/dashboard |
| Find Doctors | http://localhost:3001/doctors |
| Doctor Details | http://localhost:3001/doctors/1 |
| Book Appointment | http://localhost:3001/book-appointment |
| My Appointments | http://localhost:3001/appointments |
| Messages | http://localhost:3001/messages |
| Profile | http://localhost:3001/profile |
| Settings | http://localhost:3001/settings |

### Backend API (Port 5000)

| Endpoint | URL |
|----------|-----|
| Health Check | http://localhost:5000/api/health |
| Login | http://localhost:5000/api/auth/login |
| Register | http://localhost:5000/api/auth/register |
| Doctors List | http://localhost:5000/api/doctors |
| Doctor Details | http://localhost:5000/api/doctors/1 |
| Specializations | http://localhost:5000/api/doctors/specializations |
| Appointments | http://localhost:5000/api/appointments |
| Messages | http://localhost:5000/api/messages/conversations |

## How to Check Current Ports

### Check Terminal Output

**Frontend Terminal:**
```
Port 3000 is in use, trying another one...
  VITE v5.4.21  ready in 1857 ms
  ➜  Local:   http://localhost:3001/  ← Use this!
```

**Backend Terminal:**
```
🚀 Healthcare Booking API server running on port 5000
```

### Check with Commands

**Windows:**
```bash
netstat -ano | findstr :3001
netstat -ano | findstr :5000
```

**Mac/Linux:**
```bash
lsof -i :3001
lsof -i :5000
```

## Troubleshooting

### "Cannot GET /" or 404 Error
**Problem**: Using wrong port
**Solution**: Change 3000 to 3001 in URL

### "Failed to fetch" or Network Error
**Problem**: Backend not running
**Solution**: Start backend with `node demo-server.js`

### "Connection refused"
**Problem**: Server not running on that port
**Solution**: Check terminal output for actual port

## Bookmark These URLs

For easy access, bookmark:
- 📱 Frontend: http://localhost:3001
- 🔧 Backend Health: http://localhost:5000/api/health
- 👥 Find Doctors: http://localhost:3001/doctors

## Environment Configuration

The frontend is configured to use the backend at:
```
VITE_API_URL=http://localhost:5000/api
```

This is set in `frontend/.env` file.

## Summary

### Remember:
- ✅ Frontend: **Port 3001**
- ✅ Backend: **Port 5000**
- ❌ Don't use: Port 3000 (it's taken!)

### Always use:
```
http://localhost:3001/[page]
```

Not:
```
http://localhost:3000/[page]  ← Wrong!
```
