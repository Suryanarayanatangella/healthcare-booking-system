/**
 * Healthcare Appointment Booking System - Demo Server
 * 
 * This is a simplified demo server that works without a database
 * for quick testing and demonstration purposes.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4173'  // Vite preview port
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Healthcare Booking API is running (Demo Mode)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Demo data
const demoUsers = [
  {
    id: '1',
    email: 'patient@demo.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'patient'
  },
  {
    id: '2',
    email: 'doctor@demo.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'doctor'
  }
];

const demoDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialization: 'Cardiology',
    yearsOfExperience: 15,
    consultationFee: 200,
    bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Dr. Michael Williams',
    firstName: 'Michael',
    lastName: 'Williams',
    specialization: 'General Practice',
    yearsOfExperience: 8,
    consultationFee: 100,
    bio: 'Family medicine physician providing comprehensive primary care services.',
    isAvailable: true
  }
];

// Demo API Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔍 Login attempt - Email:', email);
  console.log('🔍 Login attempt - Password:', password ? '[PROVIDED]' : '[MISSING]');
  
  const user = demoUsers.find(u => u.email === email);
  console.log('🔍 Login attempt - User found:', user ? user.email : 'Not found');
  
  if (user && password === 'password123') {
    const token = 'demo-jwt-token-' + user.id;
    console.log('✅ Login successful - Token:', token);
    
    res.json({
      message: 'Login successful',
      user: user,
      token: token
    });
  } else {
    console.log('❌ Login failed - Invalid credentials');
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid email or password'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { 
    email, 
    firstName, 
    lastName, 
    role, 
    specialization, 
    licenseNumber, 
    yearsOfExperience, 
    consultationFee, 
    bio 
  } = req.body;
  
  const newUser = {
    id: Date.now().toString(),
    email,
    firstName,
    lastName,
    role: role || 'patient'
  };
  
  demoUsers.push(newUser);
  
  // If registering as a doctor, add to doctors list
  if (role === 'doctor') {
    const newDoctor = {
      id: newUser.id,
      name: `Dr. ${firstName} ${lastName}`,
      firstName,
      lastName,
      specialization: specialization || 'General Practice',
      yearsOfExperience: parseInt(yearsOfExperience) || 0,
      consultationFee: parseFloat(consultationFee) || 100,
      bio: bio || `${specialization || 'General Practice'} physician providing quality healthcare services.`,
      isAvailable: true
    };
    
    demoDoctors.push(newDoctor);
    
    console.log(`✅ New doctor registered: Dr. ${firstName} ${lastName} (${specialization})`);
  }
  
  res.status(201).json({
    message: 'User registered successfully',
    user: newUser,
    token: 'demo-jwt-token-' + newUser.id
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('🔍 Auth check - Header:', authHeader);
  console.log('🔍 Auth check - Token:', token);
  
  if (token && token.startsWith('demo-jwt-token-')) {
    const userId = token.replace('demo-jwt-token-', '');
    const user = demoUsers.find(u => u.id === userId);
    
    console.log('🔍 Auth check - User ID:', userId);
    console.log('🔍 Auth check - Found user:', user ? user.email : 'Not found');
    
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ error: 'Invalid token - user not found' });
    }
  } else {
    res.status(401).json({ error: 'No token provided or invalid format' });
  }
});

app.get('/api/doctors', (req, res) => {
  const { specialization, search } = req.query;
  
  let filteredDoctors = [...demoDoctors];
  
  // Apply specialization filter
  if (specialization) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
    );
  }
  
  // Apply search filter
  if (search) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    doctors: filteredDoctors,
    pagination: {
      limit: 20,
      offset: 0,
      total: filteredDoctors.length,
      pages: Math.ceil(filteredDoctors.length / 20)
    }
  });
});

app.get('/api/doctors/meta/specializations', (req, res) => {
  // Get unique specializations from current doctors list
  const specializations = [...new Set(demoDoctors.map(d => d.specialization))];
  
  res.json({
    specializations: specializations.map(spec => ({
      name: spec,
      doctorCount: demoDoctors.filter(d => d.specialization === spec).length
    }))
  });
});

app.get('/api/doctors/:id', (req, res) => {
  const doctor = demoDoctors.find(d => d.id === req.params.id);
  if (doctor) {
    res.json({
      doctor: {
        ...doctor,
        schedule: [
          { dayOfWeek: 1, dayName: 'Monday', startTime: '09:00', endTime: '17:00', slotDuration: 30 },
          { dayOfWeek: 2, dayName: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDuration: 30 },
          { dayOfWeek: 3, dayName: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDuration: 30 },
          { dayOfWeek: 4, dayName: 'Thursday', startTime: '09:00', endTime: '17:00', slotDuration: 30 },
          { dayOfWeek: 5, dayName: 'Friday', startTime: '09:00', endTime: '17:00', slotDuration: 30 }
        ]
      }
    });
  } else {
    res.status(404).json({ error: 'Doctor not found' });
  }
});

app.get('/api/appointments', (req, res) => {
  res.json({
    appointments: [],
    pagination: { limit: 20, offset: 0, total: 0 }
  });
});

app.post('/api/appointments', (req, res) => {
  const appointment = {
    id: Date.now().toString(),
    ...req.body,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    message: 'Appointment booked successfully',
    appointment
  });
});

app.get('/api/appointments/doctor/:doctorId/availability', (req, res) => {
  const { date } = req.query;
  const availableSlots = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: true },
    { time: '10:30', available: false },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: true }
  ];
  
  res.json({
    date,
    availableSlots: availableSlots.filter(slot => slot.available),
    doctorSchedule: {
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30
    }
  });
});

// Debug endpoints for development
app.get('/api/debug/doctors', (req, res) => {
  res.json({
    totalDoctors: demoDoctors.length,
    doctors: demoDoctors.map(d => ({
      id: d.id,
      name: d.name,
      specialization: d.specialization,
      isAvailable: d.isAvailable
    }))
  });
});

app.get('/api/debug/users', (req, res) => {
  res.json({
    totalUsers: demoUsers.length,
    users: demoUsers.map(u => ({
      id: u.id,
      email: u.email,
      name: `${u.firstName} ${u.lastName}`,
      role: u.role
    }))
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Healthcare Booking API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Demo Mode: No database required`);
  console.log(`👤 Demo Login: patient@demo.com / password123`);
  console.log(`👨‍⚕️ Demo Doctor: doctor@demo.com / password123`);
  console.log(`🔍 Debug endpoints: /api/debug/doctors, /api/debug/users`);
});

module.exports = app;