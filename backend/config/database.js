/**
 * Database Configuration for PostgreSQL (Supabase)
 * 
 * This module handles the database connection setup and provides
 * a connection pool for efficient database operations.
 */

const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database time:', result.rows[0].now);
    
    client.release();
  } catch (err) {
    console.warn('⚠️ Database connection failed:', err.message);
    console.log('🔄 Running in demo mode without database');
    // Don't exit in demo mode
  }
};

// Initialize database connection test
testConnection();

/**
 * Execute a database query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Executed query:', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('❌ Database query error, using demo mode:', error.message);
    
    // Return demo data for common queries
    if (text.includes('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id')) {
      const userId = params[0];
      const user = await database.getUserById(userId);
      if (user) {
        return { 
          rows: [{
            id: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role,
            is_active: true
          }]
        };
      }
      return { rows: [] };
    }
    
    if (text.includes('SELECT id FROM patients WHERE user_id')) {
      const userId = params[0];
      const patient = await database.getPatientByUserId(userId);
      return { rows: patient ? [{ id: patient.id }] : [] };
    }
    
    if (text.includes('SELECT') && text.includes('FROM appointments') && text.includes('patient_id')) {
      const patientId = params[0];
      if (text.includes('COUNT(*)')) {
        // Stats query
        const stats = await database.getPatientStats(patientId);
        return { rows: [stats] };
      } else {
        // Appointments query
        const appointments = await database.getAppointmentsByPatient(patientId, 5);
        return { rows: appointments };
      }
    }
    
    // Default empty result for other queries
    return { rows: [] };
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
const getClient = async () => {
  try {
    return await pool.connect();
  } catch (error) {
    console.error('❌ Database client error, using demo mode:', error.message);
    
    // Return a mock client for demo mode
    return {
      query: async (text, params) => {
        return await query(text, params);
      },
      release: () => {}
    };
  }
};

const fs = require('fs');
const path = require('path');

// File paths for persistent storage
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');
const DOCTORS_FILE = path.join(DATA_DIR, 'doctors.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default data
const defaultUsers = [
  {
    id: 1,
    email: 'demo@patient.com',
    firstName: 'Demo',
    lastName: 'Patient',
    role: 'patient',
    password: '$2b$10$demo.hash.for.testing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    email: 'demo@doctor.com',
    firstName: 'Demo',
    lastName: 'Doctor',
    role: 'doctor',
    password: '$2b$10$demo.hash.for.testing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    email: 'sarah.johnson@hospital.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'doctor',
    password: '$2b$10$demo.hash.for.testing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    email: 'michael.chen@hospital.com',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'doctor',
    password: '$2b$10$demo.hash.for.testing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const defaultPatients = [
  {
    id: 1,
    user_id: 1,
    date_of_birth: '1990-01-01',
    gender: 'male',
    address: '123 Test St',
    emergency_contact_name: 'Emergency Contact',
    emergency_contact_phone: '0987654321',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const defaultDoctors = [
  {
    id: 1,
    user_id: 2,
    first_name: 'Demo',
    last_name: 'Doctor',
    email: 'demo@doctor.com',
    specialization: 'General Medicine',
    license_number: 'MD12345',
    experience: 10,
    consultation_fee: 100,
    bio: 'Experienced general practitioner with 10 years of experience',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: 3,
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@hospital.com',
    specialization: 'Cardiology',
    license_number: 'MD67890',
    experience: 15,
    consultation_fee: 150,
    bio: 'Specialist in cardiovascular diseases and heart conditions',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    user_id: 4,
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'michael.chen@hospital.com',
    specialization: 'Pediatrics',
    license_number: 'MD11111',
    experience: 8,
    consultation_fee: 120,
    bio: 'Pediatric specialist focusing on child healthcare and development',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper functions for file operations
const loadData = (filePath, defaultData) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn(`Error loading ${filePath}:`, error.message);
  }
  return defaultData;
};

const saveData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error.message);
  }
};

/**
 * Simple database wrapper for demo mode with file persistence
 * Provides basic CRUD operations for users, patients, and doctors
 */
const database = {
  // Load data from files or use defaults
  users: loadData(USERS_FILE, defaultUsers),
  patients: loadData(PATIENTS_FILE, defaultPatients),
  doctors: loadData(DOCTORS_FILE, defaultDoctors),
  appointments: loadData(APPOINTMENTS_FILE, []),
  nextUserId: 7,
  nextDoctorId: 6, // Start after existing demo doctors
  nextPatientId: 3, // Start after existing demo patients

  async getUserByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  },

  async getUserById(id) {
    return this.users.find(user => user.id === parseInt(id)) || null;
  },

  async createUser(userData) {
    const user = {
      id: this.nextUserId++,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.push(user);
    saveData(USERS_FILE, this.users);
    return user;
  },

  async createPatient(patientData) {
    const patient = {
      id: this.nextPatientId++,
      ...patientData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.patients.push(patient);
    saveData(PATIENTS_FILE, this.patients);
    return patient;
  },

  async createDoctor(doctorData) {
    // Get user information
    const user = await this.getUserById(doctorData.userId);
    if (!user) {
      throw new Error('User not found for doctor creation');
    }

    const doctor = {
      id: this.nextDoctorId++,
      user_id: doctorData.userId,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      specialization: doctorData.specialization,
      license_number: doctorData.licenseNumber,
      experience: doctorData.experience,
      consultation_fee: doctorData.consultationFee,
      bio: doctorData.bio,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.doctors.push(doctor);
    saveData(DOCTORS_FILE, this.doctors);
    return doctor;
  },

  async getAllDoctors() {
    return this.doctors;
  },

  async getDoctorById(id) {
    return this.doctors.find(doctor => doctor.id === parseInt(id)) || null;
  },

  // Appointment methods
  nextAppointmentId: 1,

  async createAppointment(appointmentData) {
    const appointment = {
      id: this.nextAppointmentId++,
      ...appointmentData,
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.appointments.push(appointment);
    saveData(APPOINTMENTS_FILE, this.appointments);
    return appointment;
  },

  async getAppointmentsByPatient(patientId, limit = null) {
    let appointments = this.appointments.filter(apt => apt.patient_id === parseInt(patientId));
    if (limit) {
      appointments = appointments.slice(0, limit);
    }
    return appointments;
  },

  async getPatientStats(patientId) {
    const appointments = this.appointments.filter(apt => apt.patient_id === parseInt(patientId));
    return {
      total_appointments: appointments.length,
      completed_appointments: appointments.filter(apt => apt.status === 'completed').length,
      cancelled_appointments: appointments.filter(apt => apt.status === 'cancelled').length,
      upcoming_appointments: appointments.filter(apt => ['scheduled', 'confirmed'].includes(apt.status)).length,
      missed_appointments: appointments.filter(apt => apt.status === 'no_show').length
    };
  },

  async getPatientByUserId(userId) {
    return this.patients.find(patient => patient.user_id === parseInt(userId)) || null;
  },

  async getAppointmentsByDoctorId(doctorId) {
    return this.appointments.filter(apt => apt.doctor_id === parseInt(doctorId));
  }
};

module.exports = {
  query,
  getClient,
  pool,
  database
};