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
        emergencyContactName,
        emergencyContactPhone
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
        role: user.role
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

module.exports = router;