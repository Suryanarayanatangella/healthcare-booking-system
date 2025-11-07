#!/bin/bash

# Healthcare Booking System - Production Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Healthcare Booking System - Production Deployment"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if required tools are installed
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_success "Node.js installed"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm installed"

if ! command -v git &> /dev/null; then
    print_error "git is not installed"
    exit 1
fi
print_success "git installed"

echo ""

# Check for uncommitted changes
echo "🔍 Checking git status..."
if [[ -n $(git status -s) ]]; then
    print_warning "You have uncommitted changes"
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
print_success "Git status checked"

echo ""

# Run tests
echo "🧪 Running tests..."
cd backend
if npm test; then
    print_success "Backend tests passed"
else
    print_error "Backend tests failed"
    exit 1
fi
cd ..

echo ""

# Build frontend
echo "🏗️  Building frontend..."
cd frontend
if npm run build; then
    print_success "Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi
cd ..

echo ""

# Check environment variables
echo "⚙️  Checking environment variables..."
if [ ! -f "backend/.env.production" ]; then
    print_warning "backend/.env.production not found"
    print_warning "Make sure to configure environment variables in your deployment platform"
fi

if [ ! -f "frontend/.env.production" ]; then
    print_warning "frontend/.env.production not found"
    print_warning "Make sure to configure VITE_API_URL in your deployment platform"
fi

echo ""

# Deployment options
echo "📦 Choose deployment method:"
echo "1. Deploy to Vercel (Frontend)"
echo "2. Deploy to Netlify (Frontend)"
echo "3. Deploy to Railway (Backend)"
echo "4. Deploy to Render (Backend)"
echo "5. Deploy Everything (Vercel + Railway)"
echo "6. Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "🚀 Deploying frontend to Vercel..."
        if command -v vercel &> /dev/null; then
            cd frontend
            vercel --prod
            print_success "Frontend deployed to Vercel"
        else
            print_error "Vercel CLI not installed. Install with: npm install -g vercel"
            exit 1
        fi
        ;;
    2)
        echo "🚀 Deploying frontend to Netlify..."
        if command -v netlify &> /dev/null; then
            cd frontend
            netlify deploy --prod
            print_success "Frontend deployed to Netlify"
        else
            print_error "Netlify CLI not installed. Install with: npm install -g netlify-cli"
            exit 1
        fi
        ;;
    3)
        echo "🚀 Deploying backend to Railway..."
        print_warning "Please deploy backend through Railway dashboard or CLI"
        echo "Visit: https://railway.app"
        ;;
    4)
        echo "🚀 Deploying backend to Render..."
        print_warning "Please deploy backend through Render dashboard"
        echo "Visit: https://render.com"
        ;;
    5)
        echo "🚀 Deploying everything..."
        if command -v vercel &> /dev/null; then
            cd frontend
            vercel --prod
            cd ..
            print_success "Frontend deployed to Vercel"
        else
            print_error "Vercel CLI not installed"
        fi
        print_warning "Please deploy backend through Railway dashboard"
        ;;
    6)
        echo "👋 Deployment cancelled"
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "=================================================="
echo "✅ Deployment process completed!"
echo ""
echo "📝 Next steps:"
echo "1. Verify deployment at your production URL"
echo "2. Test all features (registration, login, booking)"
echo "3. Check email notifications"
echo "4. Monitor logs for any errors"
echo ""
echo "🎉 Your Healthcare Booking System is live!"
echo "=================================================="
