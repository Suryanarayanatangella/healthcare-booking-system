/**
 * Authentication Routes
 * 
 * This module handles user authentication including registration,
 * login, and password management for the healthcare booking system.
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { database } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  role: Joi.string().valid('patient', 'doctor').default('patient'),
  // Patient-specific fields
  dateOfBirth: Joi.date().when('role', { is: 'patient', then: Joi.optional() }),
  gender: Joi.string().valid('male', 'female', 'other').when('role', { is: 'patient', then: Joi.optional() }),
  address: Joi.string().when('role', { is: 'patient', then: Joi.optional() }),
  emergencyContactName: Joi.string().when('role', { is: 'patient', then: Joi.optional() }),
  emergencyContactPhone: Joi.string().when('role', { is: 'patient', then: Joi.optional() }),
  // Doctor-specific fields
  specialization: Joi.string().when('role', { is: 'doctor', then: Joi.required() }),
  licenseNumber: Joi.string().when('role', { is: 'doctor', then: Joi.optional() }),
  yearsOfExperience: Joi.number().when('role', { is: 'doctor', then: Joi.optional() }),
  consultationFee: Joi.number().when('role', { is: 'doctor', then: Joi.optional() }),
  bio: Joi.string().when('role', { is: 'doctor', then: Joi.optional() })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (patient or doctor)
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    // Debug CORS
    console.log('📝 Registration request received');
    console.log('   Origin:', req.headers.origin);
    console.log('   Method:', req.method);
    console.log('   Content-Type:', req.headers['content-type']);

    // Validate request body
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      dateOfBirth,
      gender,
      address,
      bloodGroup,
      height,
      weight,
      emergencyContactName,
      emergencyContactPhone,
      specialization,
      licenseNumber,
      yearsOfExperience,
      consultationFee,
      bio
    } = value;

    // Check if user already exists
    const existingUser = await database.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Registration failed',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      phone,
      isVerified: true
    };

    const user = await database.createUser(userData);

    // Create role-specific profile
    if (role === 'patient') {
      const patientData = {
        userId: user.id,
        dateOfBirth,
        gender,
        address,
        bloodGroup,
        height,
        weight,
        emergencyContactName,
        emergencyContactPhone,
      };
      await database.createPatient(patientData);
    } else if (role === 'doctor') {
      const doctorData = {
        userId: user.id,
        specialization,
        licenseNumber,
        experience: yearsOfExperience,
        consultationFee,
        bio
      };
      await database.createDoctor(doctorData);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    const { email, password } = value;

    // Find user
    const user = await database.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Login failed',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Login failed',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await database.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Logout successful'
  });
});
/**
 * @route   POST /api/auth/register/patient
 * @desc    Register a new patient with medical information
 * @access  Public
 */
router.post('/register/patient', async (req, res, next) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      // Medical fields
      bloodGroup,
      height,
      weight,
      bloodPressure,
      allergies,
      currentMedications,
      pastMedicalHistory,
      familyMedicalHistory,
      smoking,
      alcohol,
      exercise,
      diet
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, first name, and last name are required'
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
         VALUES ($1, $2, $3, $4, $5, 'patient')
         RETURNING id`,
        [email, await bcrypt.hash(password, 12), firstName, lastName, phone]
      );

      const userId = userResult.rows[0].id;

      // Calculate BMI
      let bmi = null;
      if (height && weight) {
        const heightInMeters = height / 100;
        bmi = Math.round((weight / (heightInMeters * heightInMeters)) * 100) / 100;
      }

      // Create patient record with all medical information
      const patientResult = await client.query(
        `INSERT INTO patients (
          user_id, date_of_birth, gender, address, 
          emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
          blood_group, height_cm, weight_kg, bmi, blood_pressure,
          allergies, current_medications, past_medical_history, family_medical_history,
          smoking, alcohol, exercise, diet
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING id`,
        [
          userId, dateOfBirth, gender, address,
          emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
          bloodGroup, height, weight, bmi, bloodPressure,
          allergies, currentMedications, pastMedicalHistory, familyMedicalHistory,
          smoking, alcohol, exercise, diet
        ]
      );

      await client.query('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        { userId: userId, email: email, role: 'patient' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Patient registered successfully',
        token: token,
        user: {
          id: userId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: 'patient'
        },
        patient: {
          id: patientResult.rows[0].id,
          bloodGroup: bloodGroup,
          height: height,
          weight: weight,
          bmi: bmi
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Error creating patient account'
    });
  }
});

module.exports = router;