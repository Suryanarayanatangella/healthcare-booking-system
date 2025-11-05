#!/bin/bash

# Healthcare Booking System - Deployment Script
# This script automates the deployment process for both frontend and backend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
DATABASE_DIR="database"

# Functions
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

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 16+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        log_error "Node.js version 16+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed."
        exit 1
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        log_error "git is not installed."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

install_dependencies() {
    log_info "Installing dependencies..."
    
    # Backend dependencies
    log_info "Installing backend dependencies..."
    cd "$BACKEND_DIR"
    npm ci
    cd ..
    
    # Frontend dependencies
    log_info "Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm ci
    cd ..
    
    log_success "Dependencies installed successfully"
}

run_tests() {
    log_info "Running tests..."
    
    # Backend tests
    log_info "Running backend tests..."
    cd "$BACKEND_DIR"
    if npm test; then
        log_success "Backend tests passed"
    else
        log_error "Backend tests failed"
        exit 1
    fi
    cd ..
    
    # Frontend tests
    log_info "Running frontend tests..."
    cd "$FRONTEND_DIR"
    if npm test -- --run; then
        log_success "Frontend tests passed"
    else
        log_error "Frontend tests failed"
        exit 1
    fi
    cd ..
    
    log_success "All tests passed"
}

build_frontend() {
    log_info "Building frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        log_warning ".env file not found in frontend directory"
        log_info "Creating .env file with default values..."
        cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Healthcare Booking System
EOF
    fi
    
    # Build the frontend
    if npm run build; then
        log_success "Frontend build completed"
    else
        log_error "Frontend build failed"
        exit 1
    fi
    
    cd ..
}

deploy_to_vercel() {
    log_info "Deploying frontend to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    cd "$FRONTEND_DIR"
    
    # Deploy to Vercel
    if vercel --prod; then
        log_success "Frontend deployed to Vercel successfully"
    else
        log_error "Vercel deployment failed"
        exit 1
    fi
    
    cd ..
}

deploy_to_railway() {
    log_info "Deploying backend to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        log_info "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    cd "$BACKEND_DIR"
    
    # Deploy to Railway
    if railway up; then
        log_success "Backend deployed to Railway successfully"
    else
        log_error "Railway deployment failed"
        exit 1
    fi
    
    cd ..
}

deploy_to_netlify() {
    log_info "Deploying frontend to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        log_info "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    cd "$FRONTEND_DIR"
    
    # Create _redirects file for SPA routing
    echo "/*    /index.html   200" > dist/_redirects
    
    # Deploy to Netlify
    if netlify deploy --prod --dir=dist; then
        log_success "Frontend deployed to Netlify successfully"
    else
        log_error "Netlify deployment failed"
        exit 1
    fi
    
    cd ..
}

deploy_to_heroku() {
    log_info "Deploying backend to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        log_error "Heroku CLI is not installed. Please install it and try again."
        exit 1
    fi
    
    cd "$BACKEND_DIR"
    
    # Initialize git if not already done
    if [ ! -d ".git" ]; then
        git init
        git add .
        git commit -m "Initial commit for Heroku deployment"
    fi
    
    # Create Heroku app if it doesn't exist
    read -p "Enter your Heroku app name: " HEROKU_APP_NAME
    
    if ! heroku apps:info "$HEROKU_APP_NAME" &> /dev/null; then
        log_info "Creating Heroku app: $HEROKU_APP_NAME"
        heroku create "$HEROKU_APP_NAME"
    fi
    
    # Add PostgreSQL addon
    heroku addons:create heroku-postgresql:hobby-dev --app "$HEROKU_APP_NAME" || true
    
    # Set environment variables
    log_info "Setting environment variables..."
    heroku config:set NODE_ENV=production --app "$HEROKU_APP_NAME"
    
    # Deploy to Heroku
    if git push heroku main; then
        log_success "Backend deployed to Heroku successfully"
    else
        log_error "Heroku deployment failed"
        exit 1
    fi
    
    cd ..
}

setup_database() {
    log_info "Setting up database..."
    
    read -p "Enter database host: " DB_HOST
    read -p "Enter database name: " DB_NAME
    read -p "Enter database user: " DB_USER
    read -s -p "Enter database password: " DB_PASSWORD
    echo
    
    # Run database schema
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$DATABASE_DIR/schema.sql"; then
        log_success "Database schema applied successfully"
    else
        log_error "Failed to apply database schema"
        exit 1
    fi
}

health_check() {
    log_info "Performing health checks..."
    
    read -p "Enter your backend URL (e.g., https://your-app.railway.app): " BACKEND_URL
    
    # Wait for deployment to be ready
    log_info "Waiting for deployment to be ready..."
    sleep 30
    
    # Health check
    if curl -f "$BACKEND_URL/health"; then
        log_success "Backend health check passed"
    else
        log_warning "Backend health check failed - this might be normal if the app is still starting"
    fi
    
    read -p "Enter your frontend URL (e.g., https://your-app.vercel.app): " FRONTEND_URL
    
    # Check if frontend is accessible
    if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
        log_success "Frontend is accessible"
    else
        log_warning "Frontend accessibility check failed"
    fi
}

show_help() {
    echo "Healthcare Booking System - Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h          Show this help message"
    echo "  --check-only        Only run prerequisite checks"
    echo "  --test-only         Only run tests"
    echo "  --build-only        Only build the frontend"
    echo "  --frontend-only     Deploy only frontend"
    echo "  --backend-only      Deploy only backend"
    echo "  --vercel            Deploy frontend to Vercel"
    echo "  --netlify           Deploy frontend to Netlify"
    echo "  --railway           Deploy backend to Railway"
    echo "  --heroku            Deploy backend to Heroku"
    echo "  --setup-db          Setup database schema"
    echo "  --health-check      Perform health checks"
    echo ""
    echo "Examples:"
    echo "  $0                  # Full deployment (interactive)"
    echo "  $0 --vercel         # Deploy frontend to Vercel only"
    echo "  $0 --railway        # Deploy backend to Railway only"
    echo "  $0 --test-only      # Run tests only"
}

main() {
    echo "🏥 Healthcare Booking System - Deployment Script"
    echo "================================================"
    
    # Parse command line arguments
    case "${1:-}" in
        --help|-h)
            show_help
            exit 0
            ;;
        --check-only)
            check_prerequisites
            exit 0
            ;;
        --test-only)
            check_prerequisites
            install_dependencies
            run_tests
            exit 0
            ;;
        --build-only)
            check_prerequisites
            install_dependencies
            build_frontend
            exit 0
            ;;
        --vercel)
            check_prerequisites
            install_dependencies
            build_frontend
            deploy_to_vercel
            exit 0
            ;;
        --netlify)
            check_prerequisites
            install_dependencies
            build_frontend
            deploy_to_netlify
            exit 0
            ;;
        --railway)
            check_prerequisites
            install_dependencies
            deploy_to_railway
            exit 0
            ;;
        --heroku)
            check_prerequisites
            install_dependencies
            deploy_to_heroku
            exit 0
            ;;
        --setup-db)
            setup_database
            exit 0
            ;;
        --health-check)
            health_check
            exit 0
            ;;
        --frontend-only)
            check_prerequisites
            install_dependencies
            build_frontend
            echo "Choose frontend deployment platform:"
            echo "1) Vercel"
            echo "2) Netlify"
            read -p "Enter your choice (1-2): " choice
            case $choice in
                1) deploy_to_vercel ;;
                2) deploy_to_netlify ;;
                *) log_error "Invalid choice" && exit 1 ;;
            esac
            exit 0
            ;;
        --backend-only)
            check_prerequisites
            install_dependencies
            echo "Choose backend deployment platform:"
            echo "1) Railway"
            echo "2) Heroku"
            read -p "Enter your choice (1-2): " choice
            case $choice in
                1) deploy_to_railway ;;
                2) deploy_to_heroku ;;
                *) log_error "Invalid choice" && exit 1 ;;
            esac
            exit 0
            ;;
    esac
    
    # Interactive deployment
    log_info "Starting interactive deployment process..."
    
    # Step 1: Prerequisites
    check_prerequisites
    
    # Step 2: Install dependencies
    install_dependencies
    
    # Step 3: Run tests
    echo ""
    read -p "Do you want to run tests? (y/n): " run_tests_choice
    if [[ $run_tests_choice =~ ^[Yy]$ ]]; then
        run_tests
    fi
    
    # Step 4: Build frontend
    build_frontend
    
    # Step 5: Choose deployment platforms
    echo ""
    echo "Choose deployment platforms:"
    echo ""
    
    # Frontend deployment
    echo "Frontend deployment options:"
    echo "1) Vercel (Recommended)"
    echo "2) Netlify"
    echo "3) Skip frontend deployment"
    read -p "Choose frontend deployment (1-3): " frontend_choice
    
    case $frontend_choice in
        1) deploy_to_vercel ;;
        2) deploy_to_netlify ;;
        3) log_info "Skipping frontend deployment" ;;
        *) log_error "Invalid choice" && exit 1 ;;
    esac
    
    # Backend deployment
    echo ""
    echo "Backend deployment options:"
    echo "1) Railway (Recommended)"
    echo "2) Heroku"
    echo "3) Skip backend deployment"
    read -p "Choose backend deployment (1-3): " backend_choice
    
    case $backend_choice in
        1) deploy_to_railway ;;
        2) deploy_to_heroku ;;
        3) log_info "Skipping backend deployment" ;;
        *) log_error "Invalid choice" && exit 1 ;;
    esac
    
    # Database setup
    echo ""
    read -p "Do you want to set up the database schema? (y/n): " setup_db_choice
    if [[ $setup_db_choice =~ ^[Yy]$ ]]; then
        setup_database
    fi
    
    # Health checks
    echo ""
    read -p "Do you want to perform health checks? (y/n): " health_check_choice
    if [[ $health_check_choice =~ ^[Yy]$ ]]; then
        health_check
    fi
    
    echo ""
    log_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Configure your environment variables in the deployment platforms"
    echo "2. Set up your custom domains"
    echo "3. Configure SSL certificates"
    echo "4. Set up monitoring and analytics"
    echo ""
    echo "For more information, check the DEPLOYMENT.md file."
}

# Run main function
main "$@"