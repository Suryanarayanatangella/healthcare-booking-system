# 🏥 Healthcare Booking System - Step-by-Step Execution Guide

## 📋 Prerequisites Check

Before starting, ensure you have:
- ✅ **Node.js** (v16+) - `node --version`
- ✅ **npm** - `npm --version`
- ✅ **Git** - `git --version`
- ✅ **PostgreSQL** (optional, can use demo mode)

## 🚀 Quick Start (Demo Mode)

### Step 1: Clone & Navigate
```bash
# If not already in project directory
cd healthcare-booking-system
```

### Step 2: Backend Setup (Demo Mode)
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start demo server (no database required)
npm run demo
```
**Expected Output:**
```
🚀 Demo server running on port 5000
📊 Demo data loaded successfully
✅ Server ready for testing
```

### Step 3: Frontend Setup
```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
**Expected Output:**
```
  VITE v5.0.0  ready in 500ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 4: Access Application
1. **Open browser**: `http://localhost:3000`
2. **Demo credentials**:
   - Patient: `patient@demo.com` / `password123`
   - Doctor: `doctor@demo.com` / `password123`

---

## 🔧 Full Production Setup

### Step 1: Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb healthcare_booking

# Run schema
psql -d healthcare_booking -f database/schema.sql
```

#### Option B: Supabase (Recommended)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy `database/schema.sql` content to SQL editor
4. Execute the schema

### Step 2: Backend Configuration
```bash
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env
# OR on Linux/Mac: cp .env.example .env
```

**Edit `.env` file:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database (Supabase example)
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSL=true

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Step 3: Frontend Configuration
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env
# OR on Linux/Mac: cp .env.example .env
```

**Edit `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Healthcare Booking System
```

### Step 4: Start Services

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
**Expected Output:**
```
[nodemon] starting `node server.js`
🚀 Server running on port 5000
✅ Database connected successfully
📧 Email service configured
🔒 Security middleware loaded
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
  VITE v5.0.0  ready in 500ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

## 🧪 Testing the Application

### Step 1: Health Check
```bash
# Test API health
curl http://localhost:5000/api/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 30.5
}
```

### Step 2: Frontend Access
1. **Open**: `http://localhost:3000`
2. **Check**: Homepage loads with navigation
3. **Verify**: New favicon appears in browser tab

### Step 3: Registration Flow
1. **Navigate**: `http://localhost:3000/register`
2. **Fill form**: Create test patient account
3. **Submit**: Should redirect to dashboard
4. **Check email**: Welcome email received

### Step 4: Login Flow
1. **Navigate**: `http://localhost:3000/login`
2. **Use credentials**: From registration or demo
3. **Login**: Should redirect to dashboard
4. **Check**: User data displays correctly

### Step 5: Booking Flow
1. **Go to**: "Find Doctors" page
2. **Select doctor**: Choose available doctor
3. **Book appointment**: Select date/time
4. **Confirm**: Appointment created successfully
5. **Check**: Appears in "My Appointments"

---

## 🔍 Troubleshooting Guide

### Backend Issues

#### Port 5000 Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <process_id> /F

# Or change port in backend/.env
PORT=5001
```

#### Database Connection Failed
```bash
# Check database status
# For local PostgreSQL:
pg_ctl status

# Check environment variables
echo $DB_HOST  # Linux/Mac
echo %DB_HOST% # Windows
```

#### Email Not Working
1. **Gmail**: Enable 2FA and create app password
2. **Check logs**: Look for SMTP errors in backend terminal
3. **Test SMTP**: Use online SMTP tester

### Frontend Issues

#### Port 3000 Already in Use
```bash
# Vite will automatically suggest next available port
# Or specify port in vite.config.js:
export default defineConfig({
  server: { port: 3001 }
})
```

#### API Connection Failed
1. **Check backend**: Ensure running on port 5000
2. **Check CORS**: Backend should allow localhost:3000
3. **Check .env**: Verify VITE_API_URL is correct

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or on Windows:
rmdir /s node_modules
del package-lock.json
npm install
```

---

## 📊 Application Flow

### User Journey - Patient
1. **Homepage** → Learn about services
2. **Register** → Create patient account
3. **Login** → Access dashboard
4. **Find Doctors** → Browse available doctors
5. **Book Appointment** → Select date/time
6. **My Appointments** → View/manage bookings
7. **Profile** → Update personal info

### User Journey - Doctor
1. **Register** → Create doctor account
2. **Login** → Access doctor dashboard
3. **My Schedule** → Set availability
4. **Patient Management** → View patient list
5. **Analytics** → View appointment stats
6. **Profile** → Update professional info

### System Flow
1. **Authentication** → JWT-based auth system
2. **Authorization** → Role-based access control
3. **Data Flow** → Redux state management
4. **API Communication** → Axios HTTP client
5. **Email Notifications** → Nodemailer service

---

## 🎯 Development Commands

### Backend Commands
```bash
npm run dev      # Development with auto-reload
npm run demo     # Demo mode (no database)
npm start        # Production mode
npm test         # Run tests
```

### Frontend Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

---

## 🔧 Advanced Configuration

### Custom Ports
```bash
# Backend (.env)
PORT=8000

# Frontend (vite.config.js)
server: { port: 4000 }

# Update frontend .env
VITE_API_URL=http://localhost:8000/api
```

### SSL/HTTPS (Development)
```bash
# Generate certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Update vite.config.js
server: {
  https: {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }
}
```

### Environment Modes
```bash
# Development
NODE_ENV=development npm run dev

# Production
NODE_ENV=production npm start

# Testing
NODE_ENV=test npm test
```

---

## 📈 Performance Monitoring

### Backend Monitoring
- **Logs**: Check terminal for errors/warnings
- **Memory**: Monitor Node.js memory usage
- **Database**: Check connection pool status

### Frontend Monitoring
- **Network**: Use browser dev tools
- **Bundle Size**: Check build output
- **Performance**: Use Lighthouse audit

---

## 🚀 Deployment Ready

Once everything works locally:

1. **Backend**: Deploy to Heroku, Railway, or DigitalOcean
2. **Frontend**: Deploy to Vercel, Netlify, or AWS S3
3. **Database**: Use managed PostgreSQL service
4. **Domain**: Configure custom domain and SSL
5. **Monitoring**: Set up error tracking and analytics

Your healthcare booking system is now ready for production! 🎉