@echo off
echo 🔄 Reverting Healthcare System to Clean State
echo ============================================
echo.

echo 📋 This will:
echo ✅ Remove all complex implementations
echo ✅ Keep only the working homepage
echo ✅ Clean up unnecessary files
echo ✅ Reset to simple, reference-based approach
echo.

echo ⚠️  WARNING: This will remove recent changes
set /p confirm="Continue with revert? (y/N): "
if /i not "%confirm%"=="y" (
    echo ❌ Revert cancelled
    pause
    exit /b 1
)

echo.
echo 🧹 Cleaning up files...

echo Removing complex backend files...
if exist "backend\server-fixed.js" del "backend\server-fixed.js"
if exist "backend\simple-server.js" del "backend\simple-server.js"
if exist "backend\config\simple-database.js" del "backend\config\simple-database.js"

echo Removing complex frontend files...
if exist "frontend\src\pages\SimpleBookingPage.jsx" del "frontend\src\pages\SimpleBookingPage.jsx"
if exist "frontend\src\pages\SimpleBookingPageFixed.jsx" del "frontend\src\pages\SimpleBookingPageFixed.jsx"
if exist "frontend\src\pages\doctor\DoctorDashboard.jsx" del "frontend\src\pages\doctor\DoctorDashboard.jsx"

echo Removing test and debug files...
if exist "test-fixed-system.js" del "test-fixed-system.js"
if exist "create-test-appointments.js" del "create-test-appointments.js"
if exist "test-cors.js" del "test-cors.js"
if exist "start-fixed-system.bat" del "start-fixed-system.bat"
if exist "start-simple-booking.bat" del "start-simple-booking.bat"
if exist "start-with-cors-fix.bat" del "start-with-cors-fix.bat"

echo Removing documentation files...
if exist "VITE_ENVIRONMENT_FIX.md" del "VITE_ENVIRONMENT_FIX.md"
if exist "FIXED_IMPORTS_SUMMARY.md" del "FIXED_IMPORTS_SUMMARY.md"
if exist "SIMPLE_WORKING_SOLUTION.md" del "SIMPLE_WORKING_SOLUTION.md"

echo.
echo ✅ Files cleaned up successfully!
echo.
echo 📋 What remains:
echo ✅ Original homepage (working)
echo ✅ Basic authentication pages
echo ✅ Clean project structure
echo ✅ Original backend server
echo ✅ Database schema
echo.
echo 🎯 Next Steps:
echo 1. Focus on the reference system: https://medscheduler-16.preview.emergentagent.com/
echo 2. Build simple, clean features one at a time
echo 3. Follow the reference design and functionality
echo 4. Keep it minimal and working
echo.
echo 🚀 Ready for fresh start based on reference!
echo.
pause