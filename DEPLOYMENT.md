# 🚀 Deployment Guide - Healthcare Booking System

This guide provides comprehensive instructions for deploying the Healthcare Booking System to various platforms.

## 📋 Pre-Deployment Checklist

### Environment Preparation
- [ ] All environment variables configured
- [ ] Database schema applied
- [ ] SSL certificates ready (for production)
- [ ] Domain names configured
- [ ] Email service configured
- [ ] Backup strategy in place

### Code Preparation
- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Security vulnerabilities addressed
- [ ] Performance optimized
- [ ] Documentation updated

## 🌐 Frontend Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Automatic deployments from GitHub
- Built-in CDN and edge functions
- Excellent React/Vite support
- Free tier available

**Deployment Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Configure Environment Variables**
   ```bash
   # In Vercel dashboard, add:
   VITE_API_URL=https://your-backend-url.com/api
   VITE_APP_NAME=Healthcare Booking System
   ```

5. **Custom Domain Setup**
   - Add domain in Vercel dashboard
   - Configure DNS records
   - SSL automatically handled

### Option 2: Netlify

**Deployment Steps:**

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Configure redirects** (create `frontend/public/_redirects`):
   ```
   /*    /index.html   200
   ```

### Option 3: AWS S3 + CloudFront

**For enterprise deployments:**

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront distribution**
   - Origin: S3 bucket
   - Default root object: index.html
   - Error pages: 404 → /index.html (for SPA routing)

## 🖥️ Backend Deployment Options

### Option 1: Railway (Recommended)

**Why Railway?**
- Simple deployment process
- Built-in PostgreSQL
- Automatic HTTPS
- GitHub integration

**Deployment Steps:**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and initialize**
   ```bash
   railway login
   cd backend
   railway init
   ```

3. **Add PostgreSQL service**
   ```bash
   railway add postgresql
   ```

4. **Configure environment variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-production-secret
   railway variables set SMTP_HOST=smtp.gmail.com
   railway variables set SMTP_USER=your-email@gmail.com
   railway variables set SMTP_PASS=your-app-password
   ```

5. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Heroku

**Deployment Steps:**

1. **Install Heroku CLI**
   ```bash
   # Install from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Configure environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-production-secret
   heroku config:set FRONTEND_URL=https://your-frontend-url.com
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

**Deployment Steps:**

1. **Create app.yaml**
   ```yaml
   name: healthcare-booking-backend
   services:
   - name: api
     source_dir: backend
     github:
       repo: your-username/healthcare-booking-system
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: JWT_SECRET
       value: your-production-secret
   databases:
   - name: healthcare-db
     engine: PG
     version: "13"
   ```

2. **Deploy via DigitalOcean dashboard**
   - Import from GitHub
   - Configure environment variables
   - Deploy

## 🗄️ Database Deployment Options

### Option 1: Supabase (Recommended)

**Why Supabase?**
- Managed PostgreSQL
- Built-in authentication
- Real-time subscriptions
- Generous free tier

**Setup Steps:**

1. **Create Supabase project**
   - Visit [supabase.com](https://supabase.com)
   - Create new project
   - Note connection details

2. **Run database schema**
   ```sql
   -- Copy content from database/schema.sql
   -- Paste in Supabase SQL editor
   -- Execute
   ```

3. **Configure backend connection**
   ```env
   DB_HOST=db.your-project.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your-supabase-password
   DB_SSL=true
   ```

### Option 2: Railway PostgreSQL

**Included with Railway backend deployment:**

```bash
# Automatically configured when you add PostgreSQL
railway add postgresql
```

### Option 3: AWS RDS

**For enterprise deployments:**

1. **Create RDS instance**
   - Engine: PostgreSQL
   - Instance class: db.t3.micro (for testing)
   - Storage: 20GB minimum

2. **Configure security groups**
   - Allow inbound connections on port 5432
   - From your backend server IPs

3. **Run database schema**
   ```bash
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d healthcare_booking -f database/schema.sql
   ```

## 🔧 Environment Configuration

### Production Environment Variables

**Backend (.env.production)**
```env
# Server
NODE_ENV=production
PORT=5000

# Database (Supabase example)
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_SSL=true

# JWT
JWT_SECRET=your-super-secure-production-secret-key-here
JWT_EXPIRES_IN=7d

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-production-app-password

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# Security
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Healthcare Booking System
```

## 🔒 Security Configuration

### SSL/HTTPS Setup

**For custom domains:**

1. **Obtain SSL certificate**
   - Let's Encrypt (free)
   - CloudFlare (free)
   - Commercial certificate

2. **Configure web server**
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Security Headers

**Add to your backend:**

```javascript
// In server.js
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

## 📊 Monitoring & Analytics

### Application Monitoring

**Recommended tools:**
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **New Relic** - Performance monitoring

**Setup Sentry:**

```bash
npm install @sentry/node @sentry/react
```

```javascript
// Backend
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});

// Frontend
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

### Database Monitoring

**For PostgreSQL:**
- **pgAdmin** - Database administration
- **DataDog** - Database performance
- **Supabase Dashboard** - Built-in monitoring

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Healthcare Booking System

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install backend dependencies
      run: |
        cd backend
        npm ci
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run backend tests
      run: |
        cd backend
        npm test
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm test
    
    - name: Build frontend
      run: |
        cd frontend
        npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./frontend

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Railway
      uses: bervProject/railway-deploy@v1.0.0
      with:
        railway_token: ${{ secrets.RAILWAY_TOKEN }}
        service: ${{ secrets.RAILWAY_SERVICE }}
```

## 🔄 Backup Strategy

### Database Backups

**Automated backups:**

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h your-db-host -U postgres healthcare_booking > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
rm backup_$DATE.sql
```

**Schedule with cron:**
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup-script.sh
```

### File Backups

**For uploaded files:**
```bash
# Sync to S3
aws s3 sync /path/to/uploads s3://your-backup-bucket/uploads/
```

## 📈 Performance Optimization

### Frontend Optimization

1. **Code splitting**
   ```javascript
   const LazyComponent = lazy(() => import('./Component'));
   ```

2. **Image optimization**
   ```javascript
   // Use WebP format
   // Implement lazy loading
   // Compress images
   ```

3. **Bundle analysis**
   ```bash
   npm run build -- --analyze
   ```

### Backend Optimization

1. **Database indexing**
   ```sql
   CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
   ```

2. **Caching**
   ```javascript
   // Redis caching
   const redis = require('redis');
   const client = redis.createClient();
   ```

3. **Connection pooling**
   ```javascript
   // PostgreSQL connection pool
   const pool = new Pool({
     max: 20,
     idleTimeoutMillis: 30000,
   });
   ```

## 🆘 Troubleshooting

### Common Issues

**Build failures:**
- Check Node.js version compatibility
- Clear node_modules and reinstall
- Verify environment variables

**Database connection issues:**
- Check firewall settings
- Verify SSL configuration
- Test connection strings

**CORS errors:**
- Configure CORS_ORIGIN correctly
- Check protocol (http vs https)
- Verify domain names

### Health Checks

**Backend health endpoint:**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected' // Add DB check
  });
});
```

**Frontend health check:**
```javascript
// Service worker for offline detection
// Error boundary for crash recovery
// Performance monitoring
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Create an issue on GitHub
4. Contact the development team

---

**Deployment completed successfully! 🎉**

Your Healthcare Booking System is now live and ready to help patients connect with healthcare providers.