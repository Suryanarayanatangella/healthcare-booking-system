#!/bin/bash

# Healthcare Booking System - GitHub Initialization Script
# This script helps you set up the GitHub repository and initial deployment

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

echo "🏥 Healthcare Booking System - GitHub Setup"
echo "==========================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    log_error "Git is not installed. Please install Git and try again."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    log_info "Initializing Git repository..."
    git init
    log_success "Git repository initialized"
fi

# Get GitHub repository URL
echo ""
log_info "Please provide your GitHub repository information:"
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name (default: healthcare-booking-system): " REPO_NAME
REPO_NAME=${REPO_NAME:-healthcare-booking-system}

GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Add remote origin if it doesn't exist
if ! git remote get-url origin &> /dev/null; then
    log_info "Adding GitHub remote origin..."
    git remote add origin "$GITHUB_URL"
    log_success "Remote origin added: $GITHUB_URL"
else
    log_info "Remote origin already exists"
fi

# Create initial commit if no commits exist
if ! git rev-parse HEAD &> /dev/null; then
    log_info "Creating initial commit..."
    
    # Add all files
    git add .
    
    # Create comprehensive initial commit
    git commit -m "feat: initial commit with complete healthcare booking system

🏥 Healthcare Booking System - Full Stack Application

Features:
- ✅ React frontend with modern UI/UX and Framer Motion animations
- ✅ Node.js backend with Express and JWT authentication
- ✅ PostgreSQL database with comprehensive schema
- ✅ Email notifications with Nodemailer
- ✅ Responsive design with Tailwind CSS
- ✅ Redux Toolkit for state management
- ✅ Comprehensive documentation and deployment guides
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Security best practices and HIPAA compliance considerations

Tech Stack:
- Frontend: React 18, Redux Toolkit, Tailwind CSS, Framer Motion, Vite
- Backend: Node.js, Express, PostgreSQL, JWT, Bcrypt, Nodemailer
- Deployment: Vercel (Frontend), Railway (Backend), Supabase (Database)
- DevOps: GitHub Actions, ESLint, Automated testing

Ready for production deployment! 🚀"
    
    log_success "Initial commit created"
fi

# Push to GitHub
log_info "Pushing to GitHub..."
if git push -u origin main; then
    log_success "Code pushed to GitHub successfully!"
else
    log_warning "Push failed. You may need to create the repository on GitHub first."
    echo ""
    echo "Please:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a repository named: $REPO_NAME"
    echo "3. Don't initialize with README, .gitignore, or license"
    echo "4. Run this script again"
    exit 1
fi

# Display next steps
echo ""
log_success "🎉 GitHub repository setup completed!"
echo ""
echo "Repository URL: $GITHUB_URL"
echo ""
echo "Next Steps:"
echo "==========="
echo ""
echo "1. 🔧 Set up deployment platforms:"
echo "   • Frontend: Vercel (https://vercel.com)"
echo "   • Backend: Railway (https://railway.app)"
echo "   • Database: Supabase (https://supabase.com)"
echo ""
echo "2. 🔐 Configure GitHub Secrets (Settings → Secrets and variables → Actions):"
echo "   • VERCEL_TOKEN"
echo "   • VERCEL_ORG_ID"
echo "   • VERCEL_PROJECT_ID"
echo "   • RAILWAY_TOKEN_PRODUCTION"
echo "   • RAILWAY_SERVICE_PRODUCTION"
echo ""
echo "3. 🚀 Deploy your application:"
echo "   npm run deploy"
echo ""
echo "4. 📚 Read the documentation:"
echo "   • README.md - Project overview"
echo "   • DEPLOYMENT.md - Deployment guide"
echo "   • GITHUB_HOSTING_GUIDE.md - GitHub hosting guide"
echo ""
echo "5. 🔄 Enable branch protection:"
echo "   • Go to Settings → Branches"
echo "   • Add protection rule for 'main' branch"
echo ""
echo "6. 📊 Set up monitoring:"
echo "   • Sentry for error tracking"
echo "   • Google Analytics for usage"
echo "   • Uptime monitoring"
echo ""

# Ask if user wants to open GitHub repository
echo ""
read -p "Do you want to open the GitHub repository in your browser? (y/n): " open_browser
if [[ $open_browser =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "$GITHUB_URL"
    elif command -v open &> /dev/null; then
        open "$GITHUB_URL"
    elif command -v start &> /dev/null; then
        start "$GITHUB_URL"
    else
        echo "Please open: $GITHUB_URL"
    fi
fi

echo ""
log_success "Happy coding! 🚀"