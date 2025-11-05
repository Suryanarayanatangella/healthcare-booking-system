# 🏥 Healthcare Booking System

A modern, full-stack healthcare appointment booking platform built with React, Node.js, and PostgreSQL. This system enables patients to easily book appointments with healthcare providers while giving doctors powerful tools to manage their schedules.

![Healthcare Booking System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12%2B-blue)

## ✨ Features

### For Patients
- 🔐 **Secure Registration & Login** - JWT-based authentication
- 👨‍⚕️ **Doctor Discovery** - Browse qualified healthcare professionals
- 📅 **Easy Appointment Booking** - Real-time availability checking
- 📱 **Responsive Design** - Works perfectly on all devices
- 📧 **Email Notifications** - Automatic confirmations and reminders
- 📊 **Appointment History** - Track all your medical appointments

### For Healthcare Providers
- 🏥 **Practice Management** - Comprehensive dashboard for doctors
- ⏰ **Schedule Management** - Set availability and manage appointments
- 👥 **Patient Management** - View and manage patient information
- 📈 **Analytics Dashboard** - Insights into practice performance
- 🔔 **Real-time Notifications** - Stay updated on bookings and changes

### Technical Features
- 🎨 **Modern UI/UX** - Beautiful, intuitive interface with Framer Motion animations
- 🔒 **HIPAA Compliant** - Enterprise-grade security and privacy
- 🚀 **High Performance** - Optimized for speed and scalability
- 📱 **Mobile First** - Responsive design for all screen sizes
- 🌐 **RESTful API** - Clean, well-documented backend architecture

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Redux Toolkit** - State management
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Robust relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **npm** - Package management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthcare-booking-system.git
   cd healthcare-booking-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb healthcare_booking
   
   # Run database schema
   psql -d healthcare_booking -f ../database/schema.sql
   ```

5. **Configure environment variables**
   
   **Backend (.env)**
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=healthcare_booking
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # Email (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   FRONTEND_URL=http://localhost:3000
   ```
   
   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Healthcare Booking System
   ```

6. **Start the development servers**
   
   **Backend (Terminal 1)**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
healthcare-booking-system/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── store/          # Redux store and slices
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Node.js backend application
│   ├── config/             # Configuration files
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route handlers
│   ├── utils/              # Utility functions
│   ├── package.json
│   └── server.js
├── database/               # Database schema and migrations
│   └── schema.sql
├── docs/                   # Documentation
├── .gitignore
├── README.md
└── package.json
```

## 🔧 Development

### Available Scripts

**Backend**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run demo` - Start demo server with sample data
- `npm test` - Run tests

**Frontend**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### API Documentation

The backend provides a RESTful API with the following main endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user appointments
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Backend Deployment (Railway/Heroku)

1. **Prepare for deployment**
   ```bash
   cd backend
   npm run build
   ```

2. **Deploy to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway deploy
   ```

### Database Deployment

- **Supabase** (Recommended for PostgreSQL)
- **Railway PostgreSQL**
- **Heroku Postgres**

## 🧪 Testing

### Demo Accounts

**Patient Account**
- Email: `patient@demo.com`
- Password: `password123`

**Doctor Account**
- Email: `doctor@demo.com`
- Password: `password123`

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/healthcare-booking-system/issues) page
2. Create a new issue with detailed information
3. Join our [Discussions](https://github.com/yourusername/healthcare-booking-system/discussions)

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this system
- Inspired by the need for better healthcare accessibility
- Built with modern web technologies and best practices

## 📊 Project Status

- ✅ **Core Features**: Complete
- ✅ **Authentication**: Implemented
- ✅ **Appointment Booking**: Functional
- ✅ **Email Notifications**: Working
- ✅ **Responsive Design**: Complete
- ✅ **API Documentation**: Available
- 🔄 **Advanced Analytics**: In Progress
- 📋 **Mobile App**: Planned

---

**Made with ❤️ for better healthcare accessibility**

For more information, visit our [documentation](docs/) or check out the [live demo](https://your-demo-url.com).