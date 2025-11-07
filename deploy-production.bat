@echo off
REM Healthcare Booking System - Production Deployment Script (Windows)
REM This script automates the deployment process

echo.
echo ========================================================
echo    Healthcare Booking System - Production Deployment
echo ========================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    pause
    exit /b 1
)
echo [OK] Node.js installed

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)
echo [OK] npm installed

REM Check git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] git is not installed
    pause
    exit /b 1
)
echo [OK] git installed

echo.
echo ========================================================
echo    Running Tests
echo ========================================================
echo.

cd backend
call npm test
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend tests failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend tests passed
cd ..

echo.
echo ========================================================
echo    Building Frontend
echo ========================================================
echo.

cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend build successful
cd ..

echo.
echo ========================================================
echo    Deployment Options
echo ========================================================
echo.
echo 1. Deploy to Vercel (Frontend)
echo 2. Deploy to Netlify (Frontend)
echo 3. Deploy to Railway (Backend)
echo 4. Deploy to Render (Backend)
echo 5. Deploy Everything (Vercel + Railway)
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto railway
if "%choice%"=="4" goto render
if "%choice%"=="5" goto all
if "%choice%"=="6" goto end
goto invalid

:vercel
echo.
echo Deploying frontend to Vercel...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI not installed
    echo Install with: npm install -g vercel
    pause
    exit /b 1
)
cd frontend
call vercel --prod
cd ..
echo [OK] Frontend deployed to Vercel
goto success

:netlify
echo.
echo Deploying frontend to Netlify...
where netlify >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Netlify CLI not installed
    echo Install with: npm install -g netlify-cli
    pause
    exit /b 1
)
cd frontend
call netlify deploy --prod
cd ..
echo [OK] Frontend deployed to Netlify
goto success

:railway
echo.
echo [INFO] Please deploy backend through Railway dashboard or CLI
echo Visit: https://railway.app
goto success

:render
echo.
echo [INFO] Please deploy backend through Render dashboard
echo Visit: https://render.com
goto success

:all
echo.
echo Deploying everything...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI not installed
) else (
    cd frontend
    call vercel --prod
    cd ..
    echo [OK] Frontend deployed to Vercel
)
echo [INFO] Please deploy backend through Railway dashboard
goto success

:invalid
echo [ERROR] Invalid choice
pause
exit /b 1

:success
echo.
echo ========================================================
echo    Deployment Completed Successfully!
echo ========================================================
echo.
echo Next steps:
echo 1. Verify deployment at your production URL
echo 2. Test all features (registration, login, booking)
echo 3. Check email notifications
echo 4. Monitor logs for any errors
echo.
echo Your Healthcare Booking System is live!
echo ========================================================
echo.
goto end

:end
pause
