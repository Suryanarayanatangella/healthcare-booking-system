@echo off
echo 🚀 Healthcare Booking System - Netlify Deployment
echo ================================================

echo 📦 Installing dependencies...
cd frontend
call npm install

echo 🏗️ Building the project...
call npm run build

echo ✅ Build completed!
echo.
echo 📁 Your build is ready in: frontend/dist
echo.
echo 🌐 Next steps for Netlify deployment:
echo 1. Go to https://netlify.com
echo 2. Drag and drop the 'frontend/dist' folder
echo 3. Set environment variables in Netlify dashboard:
echo    - VITE_API_URL: Your backend API URL
echo    - VITE_APP_NAME: Healthcare Booking System
echo.
echo 🎉 Ready for deployment!

pause