# Deploy Backend to Railway - Step by Step

## Prerequisites
✅ GitHub repository pushed
✅ Railway configuration files created
✅ Backend code ready

## Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click **Login with GitHub**
3. Authorize Railway to access your GitHub account

## Step 2: Create New Project

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository: `healthcare-booking-system`
4. Railway will detect your project

## Step 3: Configure Service

Railway should auto-detect the configuration, but verify:
- **Root Directory**: Should be auto-detected (we have nixpacks.toml)
- **Build Command**: `cd backend && npm ci`
- **Start Command**: `cd backend && npm start`

## Step 4: Add PostgreSQL Database

1. In your Railway project, click **New**
2. Select **Database** → **PostgreSQL**
3. Railway will automatically create a database and set `DATABASE_URL` environment variable

## Step 5: Add Environment Variables

Click on your service → **Variables** tab → Add these:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://doctorseasy.netlify.app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (Optional - for appointment notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Healthcare Booking <your-email@gmail.com>

# Database will be auto-set by Railway
# DATABASE_URL is automatically provided by Railway PostgreSQL
```

**Important**: Generate a strong JWT_SECRET:
```bash
# Run this in your terminal to generate a random secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 6: Deploy

1. Click **Deploy**
2. Wait for deployment to complete (2-3 minutes)
3. Railway will provide you a URL like: `https://healthcare-booking-production.up.railway.app`

## Step 7: Initialize Database

After deployment, you need to set up the database schema:

1. Go to Railway → Your service → **Settings** → **Networking**
2. Copy the **Public URL**
3. Test the health endpoint: `https://your-url.railway.app/api/health`

To initialize the database, you have two options:

### Option A: Use Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run database setup
railway run node backend/config/database.js
```

### Option B: Manual SQL (if needed)
Connect to your PostgreSQL database and run the schema from `database/schema.sql`

## Step 8: Update Netlify Environment Variables

1. Go to Netlify Dashboard: https://app.netlify.com
2. Select your site: `doctorseasy`
3. Go to **Site settings** → **Environment variables**
4. Add/Update:
   - Variable: `VITE_API_URL`
   - Value: `https://your-railway-url.railway.app/api` (replace with your actual Railway URL)
5. Click **Save**
6. Go to **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

## Step 9: Test the Connection

1. Wait for Netlify to redeploy (2-3 minutes)
2. Visit https://doctorseasy.netlify.app
3. Try to login or register
4. Check browser console for any errors

## Troubleshooting

### CORS Errors
Make sure `FRONTEND_URL=https://doctorseasy.netlify.app` is set in Railway environment variables.

### Database Connection Errors
Railway automatically sets `DATABASE_URL`. Check that PostgreSQL service is running.

### 502 Bad Gateway
- Check Railway logs for errors
- Verify the start command is correct
- Make sure PORT is set to 5000

### View Logs
Railway Dashboard → Your service → **Deployments** → Click latest deployment → **View Logs**

## Quick Commands

```bash
# Test backend health
curl https://your-railway-url.railway.app/api/health

# Test CORS
curl -H "Origin: https://doctorseasy.netlify.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-railway-url.railway.app/api/auth/login
```

## Cost

Railway offers:
- **Free tier**: $5 credit per month (enough for small projects)
- **Pro plan**: $20/month for more resources

Your backend should run fine on the free tier for development/testing.

## Next Steps

After successful deployment:
1. ✅ Backend deployed on Railway
2. ✅ Database initialized
3. ✅ Netlify environment variables updated
4. ✅ CORS configured
5. ✅ Test login/registration
6. 🎉 Your app is live!
