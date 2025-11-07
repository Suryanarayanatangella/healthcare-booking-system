# ✅ Deployment Checklist - Healthcare Booking System

## Pre-Deployment (Do This First!)

### 1. Code Preparation
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Backend tests passing: `cd backend && npm test`
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] All changes committed to git
- [ ] Code pushed to GitHub

### 2. Environment Variables Prepared
- [ ] JWT_SECRET generated (32+ characters)
- [ ] Gmail App Password obtained
- [ ] Database credentials ready
- [ ] Frontend URL decided
- [ ] Backend URL decided

---

## Database Setup (Supabase)

### Step 1: Create Supabase Project
- [ ] Sign up at [supabase.com](https://supabase.com)
- [ ] Create new project: "healthcare-booking"
- [ ] Choose region closest to users
- [ ] Save database password securely

### Step 2: Run Database Schema
- [ ] Go to SQL Editor in Supabase
- [ ] Copy content from `database/schema.sql`
- [ ] Execute SQL script
- [ ] Verify tables created (users, patients, doctors, appointments)

### Step 3: Get Connection Details
- [ ] Go to Settings → Database
- [ ] Copy Host, Port, Database name, User, Password
- [ ] Save for backend configuration

**Connection String Format:**
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

---

## Backend Deployment (Railway)

### Step 1: Create Railway Account
- [ ] Sign up at [railway.app](https://railway.app) with GitHub
- [ ] Verify email

### Step 2: Create New Project
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository
- [ ] Select "backend" as root directory

### Step 3: Configure Environment Variables
Go to Variables tab and add:

```env
NODE_ENV=production
PORT=5000

# Database (from Supabase)
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_SSL=true

# JWT (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-generated-secret-here

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM_NAME=Healthcare Booking
SMTP_FROM_EMAIL=your-email@gmail.com

# Frontend URL (will update after frontend deployment)
FRONTEND_URL=https://your-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://your-app.railway.app`)
- [ ] Test health endpoint: `https://your-app.railway.app/api/health`

---

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
- [ ] Sign up at [vercel.com](https://vercel.com) with GitHub
- [ ] Verify email

### Step 2: Import Project
- [ ] Click "Add New Project"
- [ ] Import your GitHub repository
- [ ] Configure:
  - Framework Preset: **Vite**
  - Root Directory: **frontend**
  - Build Command: **npm run build**
  - Output Directory: **dist**

### Step 3: Configure Environment Variables
Add in Settings → Environment Variables:

```env
VITE_API_URL=https://your-app.railway.app/api
```

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Copy frontend URL (e.g., `https://your-app.vercel.app`)

### Step 5: Update Backend CORS
- [ ] Go back to Railway
- [ ] Update `FRONTEND_URL` environment variable with your Vercel URL
- [ ] Redeploy backend

---

## Post-Deployment Testing

### 1. Frontend Tests
- [ ] Website loads at production URL
- [ ] Homepage displays correctly
- [ ] Login page accessible
- [ ] Registration page accessible
- [ ] No console errors (F12 → Console)
- [ ] Images and icons loading
- [ ] Mobile responsive (test on phone)

### 2. Backend Tests
- [ ] Health check works: `GET /api/health`
- [ ] Returns: `{"status":"OK","message":"Healthcare Booking API is running"}`

### 3. Authentication Tests
- [ ] Register new patient account
- [ ] Login with new account
- [ ] Token persists after page refresh
- [ ] Logout works correctly

### 4. Booking Flow Tests
- [ ] Patient can view doctors list
- [ ] Patient can select a doctor
- [ ] Date picker works
- [ ] Time slots load correctly
- [ ] Appointment booking succeeds
- [ ] Confirmation message appears

### 5. Email Tests
- [ ] Patient receives confirmation email
- [ ] Doctor receives notification email
- [ ] Email formatting looks professional
- [ ] Links in email work (if any)

### 6. Doctor Dashboard Tests
- [ ] Doctor can login
- [ ] Doctor sees appointments
- [ ] Schedule page loads
- [ ] Can update availability

---

## Security Verification

### 1. HTTPS
- [ ] Frontend uses HTTPS (Vercel provides automatically)
- [ ] Backend uses HTTPS (Railway provides automatically)
- [ ] No mixed content warnings

### 2. Environment Variables
- [ ] No secrets in code
- [ ] All sensitive data in environment variables
- [ ] `.env` files not committed to git

### 3. CORS
- [ ] Only your frontend URL allowed
- [ ] No CORS errors in browser console

### 4. Rate Limiting
- [ ] Rate limiting active (test by making many requests)
- [ ] Returns 429 status when limit exceeded

---

## Performance Checks

### 1. Frontend Performance
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 80
- [ ] Images optimized
- [ ] No unnecessary re-renders

### 2. Backend Performance
- [ ] API response time < 500ms
- [ ] Database queries optimized
- [ ] No N+1 query problems

### 3. Database Performance
- [ ] Indexes created on frequently queried columns
- [ ] Connection pooling configured
- [ ] Query performance acceptable

---

## Monitoring Setup

### 1. Uptime Monitoring
- [ ] Set up UptimeRobot (free)
- [ ] Monitor frontend URL
- [ ] Monitor backend health endpoint
- [ ] Configure email alerts

### 2. Error Tracking
- [ ] Set up Sentry (optional)
- [ ] Configure error reporting
- [ ] Test error capture

### 3. Analytics
- [ ] Set up Google Analytics (optional)
- [ ] Add tracking code to frontend
- [ ] Verify events tracking

---

## Documentation

### 1. Update README
- [ ] Add production URLs
- [ ] Update deployment instructions
- [ ] Add troubleshooting section

### 2. Record Credentials
- [ ] Save all URLs in password manager
- [ ] Document environment variables
- [ ] Save database credentials securely

### 3. Create Runbook
- [ ] Document common issues
- [ ] Add rollback procedures
- [ ] List emergency contacts

---

## Final Steps

### 1. Announcement
- [ ] Notify team of deployment
- [ ] Share production URLs
- [ ] Provide login credentials for testing

### 2. Backup
- [ ] Set up database backups (Supabase does this automatically)
- [ ] Test backup restoration
- [ ] Document backup procedures

### 3. Maintenance Plan
- [ ] Schedule regular updates
- [ ] Plan for dependency updates
- [ ] Set up security scanning

---

## Deployment Information

**Deployment Date:** _______________

**Deployed By:** _______________

**Production URLs:**
- Frontend: _______________
- Backend: _______________
- Database: _______________

**Environment:**
- Node.js Version: _______________
- Database Version: _______________

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________

---

## Rollback Plan

If something goes wrong:

1. **Frontend Issues:**
   - Revert to previous deployment in Vercel dashboard
   - Or: `vercel rollback` in CLI

2. **Backend Issues:**
   - Revert to previous deployment in Railway dashboard
   - Or: Redeploy previous git commit

3. **Database Issues:**
   - Restore from Supabase backup
   - Or: Run rollback SQL scripts

4. **Emergency Contact:**
   - Check logs in Railway/Vercel dashboard
   - Review error messages
   - Contact support if needed

---

## Success Criteria

✅ **Deployment is successful when:**
- [ ] All tests pass
- [ ] Users can register and login
- [ ] Appointments can be booked
- [ ] Emails are sent
- [ ] No critical errors in logs
- [ ] Performance is acceptable
- [ ] Security checks pass

---

## 🎉 Congratulations!

Your Healthcare Booking System is now live in production!

**Next Steps:**
1. Monitor for 24 hours
2. Gather user feedback
3. Plan next iteration
4. Celebrate! 🎊

---

*For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)*
