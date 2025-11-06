#!/bin/bash

# Test build script to catch issues before deployment

set -e

echo "🧪 Testing Healthcare Booking System Build"
echo "=========================================="

# Test frontend build
echo "📦 Testing frontend build..."
cd frontend

# Install dependencies
npm ci

# Run linting
echo "🔍 Running ESLint..."
npm run lint || echo "⚠️ Linting issues found (non-blocking)"

# Build the project
echo "🏗️ Building frontend..."
npm run build

# Check build output
if [ -d "dist" ]; then
    echo "✅ Frontend build successful!"
    echo "📊 Build size:"
    du -sh dist/
    echo "📁 Build contents:"
    ls -la dist/
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Test if critical files exist
if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html not found in build!"
    exit 1
fi

if [ ! -f "dist/_redirects" ]; then
    echo "⚠️ _redirects file not found - creating it..."
    echo "/*    /index.html   200" > dist/_redirects
fi

echo "✅ All build tests passed!"
echo ""
echo "🚀 Ready for deployment to Netlify!"

cd ..