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
const { query, getClient } = require('../config/database');
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
  licenseNumber: Joi.string().when('role', { is: 'doctor', then: Joi.required() }),
  yearsOfExperience: Joi.number().min(0).when('role', { is: 'doctor', then: Joi.optional() }),
  consultationFee: Joi.number().min(0).when('role', { is: 'doctor', then: Joi.optional() }),
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
router.post('/register', async (req, res, next) => {
  const client = await getClient();
  
  try {
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

    await client.query('BEGIN');

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: 'Registration failed',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role, created_at`,
      [email, passwordHash, firstName, lastName, phone, role]
    );

    const user = userResult.rows[0];

    // Insert role-specific data
    if (role === 'patient') {
      await client.query(
        `INSERT INTO patients (user_id, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.id, dateOfBirth, gender, address, emergencyContactName, emergencyContactPhone]
      );
    } else if (role === 'doctor') {
      // Check if license number already exists
      const existingLicense = await client.query(
        'SELECT id FROM doctors WHERE license_number = $1',
        [licenseNumber]
      );

      if (existingLicense.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          error: 'Registration failed',
          message: 'Doctor with this license number already exists'
        });
      }

      await client.query(
        `INSERT INTO doctors (user_id, specialization, license_number, years_of_experience, consultation_fee, bio)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.id, specialization, licenseNumber, yearsOfExperience, consultationFee, bio]
      );
    }

    await client.query('COMMIT');

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at
      },
      token
    });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
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

    // Find user by email
    const userResult = await query(
      'SELECT id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get user details with role-specific information
    let userQuery = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.created_at
      FROM users u
      WHERE u.id = $1
    `;

    let roleSpecificQuery = '';
    
    if (userRole === 'patient') {
      roleSpecificQuery = `
        SELECT p.date_of_birth, p.gender, p.address, p.emergency_contact_name, p.emergency_contact_phone,
               p.medical_history, p.allergies
        FROM patients p
        WHERE p.user_id = $1
      `;
    } else if (userRole === 'doctor') {
      roleSpecificQuery = `
        SELECT d.specialization, d.license_number, d.years_of_experience, d.consultation_fee,
               d.bio, d.is_available
        FROM doctors d
        WHERE d.user_id = $1
      `;
    }

    const [userResult, roleResult] = await Promise.all([
      query(userQuery, [userId]),
      roleSpecificQuery ? query(roleSpecificQuery, [userId]) : Promise.resolve({ rows: [{}] })
    ]);

    const user = userResult.rows[0];
    const roleData = roleResult.rows[0] || {};

    res.json({
      user: {
        ...user,
        ...roleData
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, (req, res) => {
  // In a JWT-based system, logout is typically handled client-side
  // by removing the token from storage
  res.json({
    message: 'Logout successful'
  });
});

module.exports = router;