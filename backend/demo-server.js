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

// In-memory message storage (shared between all users)
const conversations = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    createdAt: '2024-01-15T09:00:00'
  }
];

const messages = [
  {
    id: '1',
    conversationId: '1',
    senderId: '1',
    senderRole: 'patient',
    text: 'Hello Doctor, I have a question about my prescription.',
    timestamp: '2024-01-15T10:00:00',
    read: true
  },
  {
    id: '2',
    conversationId: '1',
    senderId: '2',
    senderRole: 'doctor',
    text: 'Hello! Of course, what would you like to know?',
    timestamp: '2024-01-15T10:05:00',
    read: true
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '1',
    senderRole: 'patient',
    text: 'Should I take the medication before or after meals?',
    timestamp: '2024-01-15T10:10:00',
    read: true
  },
  {
    id: '4',
    conversationId: '1',
    senderId: '2',
    senderRole: 'doctor',
    text: 'Please take the medication after meals, twice a day.',
    timestamp: '2024-01-15T10:30:00',
    read: true
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
  
  // In demo mode, accept any password as long as user exists
  if (user && password) {
    const token = 'demo-jwt-token-' + user.id;
    console.log('✅ Login successful - Token:', token);
    
    res.json({
      message: 'Login successful',
      user: user,
      token: token
    });
  } else if (!user) {
    console.log('❌ Login failed - User not found');
    res.status(401).json({
      error: 'Authentication failed',
      message: 'User not found. Please register first or use demo accounts: patient@demo.com or doctor@demo.com'
    });
  } else {
    console.log('❌ Login failed - No password provided');
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Password is required'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  console.log('👋 Logout request');
  res.json({
    message: 'Logged out successfully'
  });
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
  
  console.log('📝 Registration attempt - Email:', email, 'Role:', role || 'patient');
  
  // Check if user already exists
  const existingUser = demoUsers.find(u => u.email === email);
  if (existingUser) {
    console.log('⚠️ Registration failed - User already exists');
    return res.status(400).json({
      error: 'Registration failed',
      message: 'User with this email already exists. Please login instead.'
    });
  }
  
  const newUser = {
    id: Date.now().toString(),
    email,
    firstName,
    lastName,
    role: role || 'patient'
  };
  
  demoUsers.push(newUser);
  console.log('✅ User registered:', email);
  
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

// Specializations endpoint (both routes for compatibility)
app.get('/api/doctors/specializations', (req, res) => {
  // Get unique specializations from current doctors list
  const specializations = [...new Set(demoDoctors.map(d => d.specialization))];
  
  res.json({
    specializations: specializations.map(spec => ({
      name: spec,
      doctorCount: demoDoctors.filter(d => d.specialization === spec).length
    }))
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

// Get current patient profile
app.get('/api/patients/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (user.role !== 'patient') {
    return res.status(403).json({ error: 'Access denied. Patient role required.' });
  }
  
  // Return patient profile with additional details
  res.json({
    patient: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543'
      },
      bloodGroup: 'O+',
      allergies: ['Penicillin'],
      chronicConditions: ['Hypertension'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  });
});

// Update patient profile
app.put('/api/patients/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (user.role !== 'patient') {
    return res.status(403).json({ error: 'Access denied. Patient role required.' });
  }
  
  // In a real app, we would update the database
  // For demo, just return the updated profile with the request data merged
  const updatedProfile = {
    id: user.id,
    email: user.email,
    firstName: req.body.firstName || user.firstName,
    lastName: req.body.lastName || user.lastName,
    fullName: `${req.body.firstName || user.firstName} ${req.body.lastName || user.lastName}`,
    role: user.role,
    phone: req.body.phone || '+1 (555) 123-4567',
    dateOfBirth: req.body.dateOfBirth || '1990-05-15',
    gender: req.body.gender || 'male',
    address: req.body.address || {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    emergencyContact: req.body.emergencyContact || {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    },
    bloodGroup: req.body.bloodGroup || 'O+',
    allergies: req.body.allergies || ['Penicillin'],
    chronicConditions: req.body.chronicConditions || ['Hypertension'],
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: 'Profile updated successfully',
    patient: updatedProfile
  });
});

app.get('/api/patients/me/stats', (req, res) => {
  // Return mock patient statistics
  res.json({
    stats: {
      totalAppointments: 5,
      upcomingAppointments: 2,
      completedAppointments: 3,
      cancelledAppointments: 0,
      totalDoctors: 2,
      unreadMessages: 1
    }
  });
});

app.get('/api/appointments', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  // Filter appointments by user role
  let userAppointments = [];
  if (user.role === 'patient') {
    userAppointments = appointments.filter(apt => apt.patientId === userId);
  } else if (user.role === 'doctor') {
    userAppointments = appointments.filter(apt => apt.doctorId === userId);
  }
  
  // Enrich with doctor/patient details
  const enrichedAppointments = userAppointments.map(apt => {
    const doctor = demoDoctors.find(d => d.id === apt.doctorId);
    const patient = demoUsers.find(u => u.id === apt.patientId);
    
    return {
      ...apt,
      doctorName: doctor?.name || 'Unknown Doctor',
      doctorSpecialization: doctor?.specialization,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'
    };
  });
  
  res.json({
    appointments: enrichedAppointments,
    pagination: { 
      limit: 20, 
      offset: 0, 
      total: enrichedAppointments.length 
    }
  });
});

// Get single appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  const { id } = req.params;
  const appointment = appointments.find(apt => apt.id === id);
  
  if (!appointment) {
    return res.status(404).json({ 
      error: 'Appointment not found',
      message: 'The requested appointment does not exist'
    });
  }
  
  // Check if user has access to this appointment
  if (user.role === 'patient' && appointment.patientId !== userId) {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to view this appointment'
    });
  }
  
  if (user.role === 'doctor' && appointment.doctorId !== userId) {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to view this appointment'
    });
  }
  
  // Enrich with doctor/patient details
  const doctor = demoDoctors.find(d => d.id === appointment.doctorId);
  const patient = demoUsers.find(u => u.id === appointment.patientId);
  
  const enrichedAppointment = {
    ...appointment,
    doctorName: doctor?.name || 'Unknown Doctor',
    doctorSpecialization: doctor?.specialization,
    doctorFee: doctor?.consultationFee,
    patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
    patientEmail: patient?.email
  };
  
  res.json({
    appointment: enrichedAppointment
  });
});

// Update appointment status (cancel, reschedule, etc.)
app.patch('/api/appointments/:id', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  const { id } = req.params;
  const appointment = appointments.find(apt => apt.id === id);
  
  if (!appointment) {
    return res.status(404).json({ 
      error: 'Appointment not found',
      message: 'The requested appointment does not exist'
    });
  }
  
  // Check if user has access to this appointment
  if (user.role === 'patient' && appointment.patientId !== userId) {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to modify this appointment'
    });
  }
  
  if (user.role === 'doctor' && appointment.doctorId !== userId) {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to modify this appointment'
    });
  }
  
  // Update appointment
  const { status, appointmentDate, appointmentTime, reasonForVisit } = req.body;
  
  if (status) appointment.status = status;
  if (appointmentDate) appointment.appointmentDate = appointmentDate;
  if (appointmentTime) appointment.appointmentTime = appointmentTime;
  if (reasonForVisit) appointment.reasonForVisit = reasonForVisit;
  
  appointment.updatedAt = new Date().toISOString();
  
  console.log(`✅ Appointment ${id} updated: status=${appointment.status}`);
  
  // Enrich with details
  const doctor = demoDoctors.find(d => d.id === appointment.doctorId);
  const patient = demoUsers.find(u => u.id === appointment.patientId);
  
  res.json({
    message: 'Appointment updated successfully',
    appointment: {
      ...appointment,
      doctorName: doctor?.name,
      doctorSpecialization: doctor?.specialization,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'
    }
  });
});

// Delete/Cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  const { id } = req.params;
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ 
      error: 'Appointment not found',
      message: 'The requested appointment does not exist'
    });
  }
  
  const appointment = appointments[appointmentIndex];
  
  // Check if user has access to this appointment
  if (user.role === 'patient' && appointment.patientId !== userId) {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'You do not have permission to cancel this appointment'
    });
  }
  
  // Mark as cancelled instead of deleting
  appointment.status = 'cancelled';
  appointment.updatedAt = new Date().toISOString();
  
  console.log(`❌ Appointment ${id} cancelled by ${user.role}`);
  
  res.json({
    message: 'Appointment cancelled successfully',
    appointment
  });
});

app.post('/api/appointments', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  const { doctorId, appointmentDate, appointmentTime, reasonForVisit } = req.body;
  
  // Validate required fields
  if (!doctorId || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'Please provide doctorId, appointmentDate, and appointmentTime',
      details: {
        doctorId: !doctorId ? 'Doctor ID is required' : null,
        appointmentDate: !appointmentDate ? 'Appointment date is required' : null,
        appointmentTime: !appointmentTime ? 'Appointment time is required' : null
      }
    });
  }
  
  // Validate doctor exists
  const doctor = demoDoctors.find(d => d.id === doctorId.toString());
  if (!doctor) {
    return res.status(404).json({
      error: 'Invalid doctor',
      message: `Doctor with ID ${doctorId} does not exist. Please select a valid doctor.`
    });
  }
  
  // Validate date format and value
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(appointmentDate)) {
    return res.status(400).json({
      error: 'Invalid date format',
      message: 'Date must be in YYYY-MM-DD format (e.g., 2024-01-15)'
    });
  }
  
  const selectedDate = new Date(appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'The provided date is not valid. Please select a valid date.'
    });
  }
  
  if (selectedDate < today) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'Cannot book appointments in the past. Please select a future date.'
    });
  }
  
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  if (selectedDate > maxDate) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'Cannot book appointments more than 30 days in advance.'
    });
  }
  
  // Validate time format and value
  const validTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];
  
  if (!validTimeSlots.includes(appointmentTime)) {
    return res.status(400).json({
      error: 'Invalid time',
      message: `Invalid time slot "${appointmentTime}". Please select a valid time between 09:00 AM and 04:30 PM.`,
      validTimeSlots
    });
  }
  
  // Validate reason for visit
  if (reasonForVisit && reasonForVisit.length < 10) {
    return res.status(400).json({
      error: 'Invalid reason',
      message: 'Reason for visit must be at least 10 characters long.'
    });
  }
  
  if (reasonForVisit && reasonForVisit.length > 500) {
    return res.status(400).json({
      error: 'Invalid reason',
      message: 'Reason for visit must not exceed 500 characters.'
    });
  }
  
  // Check if slot is already booked
  const existingAppointment = appointments.find(apt =>
    apt.doctorId === doctorId.toString() &&
    apt.appointmentDate === appointmentDate &&
    apt.appointmentTime === appointmentTime &&
    apt.status !== 'cancelled'
  );
  
  if (existingAppointment) {
    return res.status(409).json({
      error: 'Slot already booked',
      message: 'This time slot is no longer available. Please choose another time.'
    });
  }
  
  // Create appointment
  const appointment = {
    id: Date.now().toString(),
    patientId: userId,
    doctorId: doctorId.toString(),
    appointmentDate,
    appointmentTime,
    reasonForVisit: reasonForVisit || '',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  appointments.push(appointment);
  
  console.log(`✅ Appointment booked: ${user.firstName} with ${doctor.name} on ${appointmentDate} at ${appointmentTime}`);
  
  res.status(201).json({
    message: 'Appointment booked successfully',
    appointment: {
      ...appointment,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      patientName: `${user.firstName} ${user.lastName}`
    }
  });
});

// Store appointments in memory
const appointments = [];

app.get('/api/doctors/:doctorId/availability', (req, res) => {
  const { date } = req.query;
  const { doctorId } = req.params;
  
  // Validate doctor exists
  const doctor = demoDoctors.find(d => d.id === doctorId);
  if (!doctor) {
    return res.status(404).json({
      error: 'Invalid doctor',
      message: `Doctor with ID ${doctorId} does not exist.`
    });
  }
  
  // Validate date is provided
  if (!date) {
    return res.status(400).json({
      error: 'Missing date',
      message: 'Please provide a date parameter (YYYY-MM-DD format)'
    });
  }
  
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({
      error: 'Invalid date format',
      message: 'Date must be in YYYY-MM-DD format (e.g., 2024-01-15)'
    });
  }
  
  // Validate date value
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'The provided date is not valid.'
    });
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'Cannot check availability for past dates.'
    });
  }
  
  console.log(`📅 Fetching availability for doctor ${doctorId} (${doctor.name}) on ${date}`);
  
  // Generate time slots from 9 AM to 5 PM (30-minute intervals)
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];
  
  // Filter out booked slots (check appointments array)
  const bookedSlots = appointments
    .filter(apt => 
      apt.doctorId === doctorId && 
      apt.appointmentDate === date &&
      apt.status !== 'cancelled'
    )
    .map(apt => apt.appointmentTime);
  
  // Return only available slots
  const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));
  
  console.log(`✅ Found ${availableSlots.length} available slots (${bookedSlots.length} booked)`);
  
  res.json({
    date,
    availableSlots,
    bookedSlots,
    doctorSchedule: {
      startTime: '09:00 AM',
      endTime: '05:00 PM',
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

// Messaging endpoints
app.get('/api/messages/conversations', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  // Get conversations for this user
  const userConversations = conversations.filter(conv => 
    conv.patientId === userId || conv.doctorId === userId
  );
  
  // Enrich with last message and unread count
  const enrichedConversations = userConversations.map(conv => {
    const convMessages = messages.filter(m => m.conversationId === conv.id);
    const lastMessage = convMessages[convMessages.length - 1];
    const unreadCount = convMessages.filter(m => 
      m.senderId !== userId && !m.read
    ).length;
    
    return {
      ...conv,
      lastMessage: lastMessage ? lastMessage.text : '',
      timestamp: lastMessage ? lastMessage.timestamp : conv.createdAt,
      unread: unreadCount
    };
  });
  
  res.json({ conversations: enrichedConversations });
});

app.get('/api/messages/conversation/:conversationId', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const { conversationId } = req.params;
  
  // Get messages for this conversation
  const conversationMessages = messages.filter(m => m.conversationId === conversationId);
  
  // Mark messages as read
  conversationMessages.forEach(m => {
    if (m.senderId !== userId) {
      m.read = true;
    }
  });
  
  res.json({ messages: conversationMessages });
});

app.post('/api/messages/send', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  const { conversationId, text, recipientId } = req.body;
  
  let convId = conversationId;
  
  // If no conversation exists, create one
  if (!convId && recipientId) {
    const recipient = demoUsers.find(u => u.id === recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }
    
    // Check if conversation already exists
    const existingConv = conversations.find(c => 
      (c.patientId === userId && c.doctorId === recipientId) ||
      (c.patientId === recipientId && c.doctorId === userId)
    );
    
    if (existingConv) {
      convId = existingConv.id;
    } else {
      // Create new conversation
      const newConv = {
        id: Date.now().toString(),
        patientId: user.role === 'patient' ? userId : recipientId,
        doctorId: user.role === 'doctor' ? userId : recipientId,
        patientName: user.role === 'patient' ? `${user.firstName} ${user.lastName}` : `${recipient.firstName} ${recipient.lastName}`,
        doctorName: user.role === 'doctor' ? `Dr. ${user.firstName} ${user.lastName}` : `Dr. ${recipient.firstName} ${recipient.lastName}`,
        createdAt: new Date().toISOString()
      };
      
      conversations.push(newConv);
      convId = newConv.id;
    }
  }
  
  // Create message
  const newMessage = {
    id: Date.now().toString(),
    conversationId: convId,
    senderId: userId,
    senderRole: user.role,
    text,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  messages.push(newMessage);
  
  res.status(201).json({
    message: 'Message sent successfully',
    data: newMessage
  });
});

app.post('/api/messages/conversation/create', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  const { recipientId } = req.body;
  const recipient = demoUsers.find(u => u.id === recipientId);
  
  if (!recipient) {
    return res.status(404).json({ error: 'Recipient not found' });
  }
  
  // Check if conversation already exists
  const existingConv = conversations.find(c => 
    (c.patientId === userId && c.doctorId === recipientId) ||
    (c.patientId === recipientId && c.doctorId === userId)
  );
  
  if (existingConv) {
    return res.json({ conversation: existingConv });
  }
  
  // Create new conversation
  const newConv = {
    id: Date.now().toString(),
    patientId: user.role === 'patient' ? userId : recipientId,
    doctorId: user.role === 'doctor' ? userId : recipientId,
    patientName: user.role === 'patient' ? `${user.firstName} ${user.lastName}` : `${recipient.firstName} ${recipient.lastName}`,
    doctorName: user.role === 'doctor' ? `Dr. ${user.firstName} ${user.lastName}` : `Dr. ${recipient.firstName} ${recipient.lastName}`,
    createdAt: new Date().toISOString()
  };
  
  conversations.push(newConv);
  
  res.status(201).json({
    message: 'Conversation created successfully',
    conversation: newConv
  });
});

// ============================================
// SETTINGS ENDPOINTS
// ============================================

// Get all user settings
app.get('/api/settings', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return user settings
  res.json({
    settings: {
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,
        promotionalEmails: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false
      },
      preferences: {
        language: 'en',
        timezone: 'UTC',
        theme: 'light'
      }
    }
  });
});

// Update profile settings
app.put('/api/settings/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // In a real app, update database
  // For demo, return updated profile
  const updatedProfile = {
    firstName: req.body.firstName || user.firstName,
    lastName: req.body.lastName || user.lastName,
    email: req.body.email || user.email,
    phone: req.body.phone || '+1 (555) 123-4567',
    dateOfBirth: req.body.dateOfBirth || '1990-05-15',
    gender: req.body.gender || 'male',
    address: req.body.address || {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  };
  
  res.json({
    message: 'Profile updated successfully',
    profile: updatedProfile
  });
});

// Update notification settings
app.put('/api/settings/notifications', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const notifications = {
    emailNotifications: req.body.emailNotifications !== undefined ? req.body.emailNotifications : true,
    smsNotifications: req.body.smsNotifications !== undefined ? req.body.smsNotifications : false,
    appointmentReminders: req.body.appointmentReminders !== undefined ? req.body.appointmentReminders : true,
    promotionalEmails: req.body.promotionalEmails !== undefined ? req.body.promotionalEmails : false
  };
  
  res.json({
    message: 'Notification settings updated successfully',
    notifications
  });
});

// Update security settings (change password)
app.put('/api/settings/security', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { currentPassword, newPassword, confirmPassword } = req.body;
  
  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'All password fields are required' });
  }
  
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }
  
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }
  
  // In demo mode, just return success
  res.json({
    message: 'Password updated successfully'
  });
});

// Update privacy settings
app.put('/api/settings/privacy', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const privacy = {
    profileVisibility: req.body.profileVisibility || 'public',
    showEmail: req.body.showEmail !== undefined ? req.body.showEmail : false,
    showPhone: req.body.showPhone !== undefined ? req.body.showPhone : false
  };
  
  res.json({
    message: 'Privacy settings updated successfully',
    privacy
  });
});

// Update preferences
app.put('/api/settings/preferences', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const preferences = {
    language: req.body.language || 'en',
    timezone: req.body.timezone || 'UTC',
    theme: req.body.theme || 'light'
  };
  
  res.json({
    message: 'Preferences updated successfully',
    preferences
  });
});

// Export user data
app.get('/api/settings/export-data', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const userId = token.replace('demo-jwt-token-', '');
  const user = demoUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return user data export
  const userAppointments = appointments.filter(apt => apt.patientId === userId);
  
  res.json({
    message: 'User data exported successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      appointments: userAppointments,
      exportDate: new Date().toISOString()
    }
  });
});

// Delete account
app.post('/api/settings/delete-account', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token || !token.startsWith('demo-jwt-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { password, confirmation } = req.body;
  
  if (!password || confirmation !== 'DELETE') {
    return res.status(400).json({ error: 'Invalid confirmation' });
  }
  
  // In demo mode, just return success
  res.json({
    message: 'Account deletion request received. Your account will be deleted within 30 days.'
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