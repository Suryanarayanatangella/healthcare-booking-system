#!/bin/bash

# Healthcare Booking System - Netlify Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 Healthcare Booking System - Netlify Deployment"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
log_info "Installing frontend dependencies..."
cd frontend
npm ci

# Build the project
log_info "Building the frontend..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    log_error "Build failed - dist directory not found"
    exit 1
fi

log_success "Build completed successfully!"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    log_info "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
log_info "Deploying to Netlify..."

# Create _redirects file if it doesn't exist
if [ ! -f "dist/_redirects" ]; then
    echo "/*    /index.html   200" > dist/_redirects
    log_info "Created _redirects file for SPA routing"
fi

# Deploy
netlify deploy --prod --dir=dist

log_success "🎉 Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Configure environment variables in Netlify dashboard:"
echo "   - VITE_API_URL: Your backend API URL"
echo "   - VITE_APP_NAME: Healthcare Booking System"
echo ""
echo "2. Set up your backend on Railway or Heroku"
echo "3. Update VITE_API_URL with your backend URL"
echo "4. Test your live application"

cd ..