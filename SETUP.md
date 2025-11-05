# Healthcare Appointment Booking System - Setup Guide

This guide will help you set up and run the Healthcare Appointment Booking System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## Project Structure

```
healthcare-booking/
├── backend/                 # Node.js + Express API
├── frontend/               # React + Redux Toolkit
├── database/              # Database schema and migrations
└── README.md
```

## Database Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** on your system
2. **Create a new database**:
   ```sql
   CREATE DATABASE healthcare_booking;
   CREATE USER healthcare_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE healthcare_booking TO healthcare_user;
   ```

3. **Run the database schema**:
   ```bash
   psql -U healthcare_user -d healthcare_booking -f database/schema.sql
   ```

### Option 2: Supabase (Recommended)

1. **Create a Supabase account** at [supabase.com](https://supabase.com)
2. **Create a new project**
3. **Copy the database schema** from `database/schema.sql` and run it in the Supabase SQL editor
4. **Get your connection details** from Project Settings > Database

## Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration (Supabase)
   DB_HOST=your-supabase-host
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=your-supabase-password
   DB_SSL=true

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   JWT_EXPIRES_IN=7d

   # Email Configuration (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the backend server**:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

## Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Healthcare Booking System
   ```

5. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Email Configuration

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a password for "Mail"
3. **Use the app password** in your `.env` file as `SMTP_PASS`

### Other Email Providers

The system supports any SMTP provider. Update the SMTP settings in your backend `.env` file accordingly.

## Testing the Setup

1. **Check API Health**:
   Visit `http://localhost:5000/api/health` - you should see a JSON response

2. **Test Database Connection**:
   The backend logs should show "✅ Database connected successfully"

3. **Test Frontend**:
   Visit `http://localhost:3000` - you should see the homepage

4. **Test Registration**:
   - Go to `http://localhost:3000/register`
   - Create a test patient account
   - Check that you receive a welcome email

## Sample Data

The database schema includes sample doctors and schedules. You can:

1. **Register as a patient** to book appointments
2. **Register as a doctor** to manage appointments
3. **Use the demo accounts** (if you've set them up):
   - Patient: `patient@demo.com` / `password123`
   - Doctor: `doctor@demo.com` / `password123`

## Common Issues and Solutions

### Database Connection Issues

- **Check your database credentials** in the `.env` file
- **Ensure PostgreSQL is running** (if using local setup)
- **Check Supabase project status** (if using Supabase)
- **Verify SSL settings** match your database configuration

### Email Not Working

- **Check SMTP credentials** in the `.env` file
- **Verify app password** (for Gmail)
- **Check spam folder** for test emails
- **Review backend logs** for email errors

### Frontend API Errors

- **Ensure backend is running** on port 5000
- **Check CORS settings** in backend configuration
- **Verify API URL** in frontend `.env` file

### Port Conflicts

- **Backend (5000)**: Change `PORT` in backend `.env`
- **Frontend (3000)**: Change port in `frontend/vite.config.js`

## Development Workflow

1. **Start the backend**: `cd backend && npm run dev`
2. **Start the frontend**: `cd frontend && npm run dev`
3. **Make changes** to either backend or frontend
4. **Both servers auto-reload** on file changes

## Production Deployment

### Backend Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Set production environment variables**
3. **Deploy to your preferred platform** (Heroku, Railway, DigitalOcean, etc.)

### Frontend Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred platform (Vercel, Netlify, etc.)

## Security Considerations

- **Change default JWT secret** to a strong, random string
- **Use environment variables** for all sensitive data
- **Enable HTTPS** in production
- **Set up proper CORS** for production domains
- **Use strong database passwords**
- **Enable database SSL** in production

## Support

If you encounter any issues:

1. **Check the logs** in both backend and frontend terminals
2. **Review this setup guide** for missed steps
3. **Check the database connection** and schema
4. **Verify all environment variables** are set correctly

## Next Steps

Once you have the system running:

1. **Explore the codebase** to understand the architecture
2. **Customize the styling** and branding
3. **Add additional features** as needed
4. **Set up proper monitoring** for production
5. **Configure backup strategies** for your database

The system is designed to be easily extensible and customizable for your specific healthcare booking needs.