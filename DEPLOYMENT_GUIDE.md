# 🚀 Complete Deployment Guide - Healthcare Booking System

## 📋 Table of Contents
1. [Quick Start Deployment](#quick-start-deployment)
2. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
3. [Backend Deployment (Railway/Render)](#backend-deployment)
4. [Database Setup (Supabase)](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## 🎯 Quick Start Deployment

### Recommended Stack (Free Tier Available)
- **Frontend**: Vercel or Netlify
- **Backend**: Railway or Render
- **Database**: Supabase (PostgreSQL)
- **Email**: Gmail SMTP or SendGrid

### Estimated Time: 30-45 minutes

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended) ⭐

#### Step 1: Prepare Frontend
```bash
cd frontend
npm run build
```

#### Step 2: Deploy to Vercel

**Method A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

**Method B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Step 3: Configure Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

#### Step 4: Deploy
- Click "Deploy"
- Wait for build to complete
- Your frontend will be live at: `https://your-app.vercel.app`

---

### Option 2: Netlify

#### Step 1: Deploy to Netlify

**Using Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod
```

**Using Netlify Dashboard**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

#### Step 2: Environment Variables
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended) ⭐

#### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository

#### Step 3: Configure Service
1. Select "backend" as root directory
2. Railway will auto-detect Node.js

#### Step 4: Add Environment Variables
Go to Variables tab and add:
```env
NODE_ENV=production
PORT=5000

# Database (from Supabase)
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_SSL=true

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Healthcare Booking
SMTP_FROM_EMAIL=your-email@gmail.com

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Step 5: Deploy
- Railway will automatically deploy
- Your backend will be live at: `https://your-app.railway.app`

---

### Option 2: Render

#### Step 1: Create Web Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository

#### Step 2: Configure
```yaml
Name: healthcare-booking-backend
Environment: Node
Region: Choose closest to your users
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

#### Step 3: Add Environment Variables
Same as Railway configuration above

#### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment to complete

---

## 🗄️ Database Setup

### Supabase (PostgreSQL) - Recommended ⭐

#### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: healthcare-booking
   - **Database Password**: (save this!)
   - **Region**: Choose closest to your users

#### Step 2: Get Connection Details
1. Go to Project Settings → Database
2. Copy connection details:
   - Host
   - Database name
   - Port
   - User
   - Password

#### Step 3: Run Database Schema
1. Go to SQL Editor in Supabase
2. Copy content from `database/schema.sql`
3. Run the SQL script

#### Step 4: Verify Tables
Check that these tables were created:
- users
- patients
- doctors
- appointments
- doctor_schedules

---

## ⚙️ Environment Configuration

### Frontend Environment Variables

Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Backend Environment Variables

Create `backend/.env.production`:
```env
# Server
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_SSL=true

# JWT Secret (Generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM_NAME=Healthcare Booking System
SMTP_FROM_EMAIL=your-email@gmail.com

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Notifications
SEND_PATIENT_CONFIRMATIONS=true
SEND_DOCTOR_NOTIFICATIONS=true
```

---

## 🔐 Security Configuration

### 1. Generate JWT Secret
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Gmail App Password
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to App Passwords
4. Generate password for "Mail"
5. Use this password in `SMTP_PASS`

### 3. CORS Configuration
Update `backend/server.js` with your frontend URL:
```javascript
const allowedOrigins = [
  'https://your-app.vercel.app',
  'http://localhost:3000'
];
```

---

## 📝 Post-Deployment Checklist

### ✅ Verification Steps

#### 1. Frontend Checks
- [ ] Website loads at production URL
- [ ] All pages accessible
- [ ] Images and assets loading
- [ ] No console errors
- [ ] Mobile responsive

#### 2. Backend Checks
- [ ] API health check: `GET /api/health`
- [ ] CORS working (no CORS errors in browser)
- [ ] Database connection successful
- [ ] Authentication working

#### 3. Feature Testing
- [ ] User registration works
- [ ] User login works
- [ ] Patient can book appointments
- [ ] Doctor can view appointments
- [ ] Email notifications sent
- [ ] Appointment cancellation works

#### 4. Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Database queries optimized

#### 5. Security
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] Rate limiting active

---

## 🚀 Quick Deploy Commands

### Deploy Everything at Once

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Test backend
cd ../backend
npm test

# 3. Deploy frontend to Vercel
cd ../frontend
vercel --prod

# 4. Deploy backend to Railway
# (Use Railway CLI or dashboard)

# 5. Update frontend with backend URL
# Update VITE_API_URL in Vercel dashboard
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Already Configured)

Your repository includes CI/CD pipeline at `.github/workflows/ci-cd.yml`

**Automatic Deployments:**
- Push to `main` branch → Auto-deploy to production
- Push to `develop` branch → Auto-deploy to staging
- Pull requests → Run tests automatically

**To Enable:**
1. Add secrets in GitHub → Settings → Secrets:
   - `VERCEL_TOKEN`
   - `RAILWAY_TOKEN`
   - All environment variables

---

## 🆘 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: 
- Add frontend URL to CORS whitelist in `backend/server.js`
- Set `FRONTEND_URL` environment variable

#### 2. Database Connection Failed
**Problem**: Backend can't connect to database
**Solution**:
- Verify database credentials
- Check if `DB_SSL=true` is set
- Whitelist Railway/Render IP in Supabase

#### 3. Email Not Sending
**Problem**: Appointment confirmations not received
**Solution**:
- Verify Gmail App Password
- Check SMTP settings
- Enable "Less secure app access" (if needed)

#### 4. Build Failures
**Problem**: Deployment fails during build
**Solution**:
- Check Node.js version (should be 18+)
- Clear cache and rebuild
- Check for missing dependencies

---

## 📊 Monitoring & Maintenance

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry (free tier)
- **Analytics**: Google Analytics
- **Logs**: Railway/Render built-in logs

### Regular Maintenance
- [ ] Weekly: Check error logs
- [ ] Monthly: Review performance metrics
- [ ] Quarterly: Update dependencies
- [ ] Yearly: Security audit

---

## 💰 Cost Estimate

### Free Tier (Recommended for Testing)
- **Vercel**: Free (100GB bandwidth)
- **Railway**: $5/month credit (enough for small apps)
- **Supabase**: Free (500MB database, 2GB bandwidth)
- **Total**: ~$0-5/month

### Production Tier
- **Vercel Pro**: $20/month
- **Railway**: ~$10-20/month
- **Supabase Pro**: $25/month
- **Total**: ~$55-65/month

---

## 📞 Support

### Need Help?
- Check logs in Railway/Vercel dashboard
- Review error messages in browser console
- Test API endpoints with Postman
- Check database connections in Supabase

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Supabase Documentation](https://supabase.com/docs)

---

## 🎉 Success!

Once deployed, your Healthcare Booking System will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **Database**: Managed by Supabase

**Next Steps:**
1. Share the URL with users
2. Monitor performance
3. Gather feedback
4. Iterate and improve

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Production URL**: _____________
**Backend URL**: _____________

---

*For detailed technical documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md)*
