/**
 * Doctor Routes
 * 
 * This module handles doctor-related operations including
 * listing doctors, getting doctor details, and managing schedules.
 */

const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database');
const { authenticateToken, requireRole, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const scheduleSchema = Joi.object({
  schedules: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.number().min(0).max(6).required(), // 0=Sunday, 6=Saturday
      startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      slotDuration: Joi.number().min(15).max(120).default(30),
      isActive: Joi.boolean().default(true)
    })
  ).required()
});

/**
 * @route   GET /api/doctors
 * @desc    Get list of all active doctors
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { specialization, search, limit = 20, offset = 0 } = req.query;

    let doctorQuery = `
      SELECT d.id, d.specialization, d.years_of_experience, d.consultation_fee, d.bio, d.is_available,
             u.first_name, u.last_name, u.email, u.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE u.is_active = true AND d.is_available = true
    `;

    const queryParams = [];
    let paramIndex = 1;

    // Add filters
    if (specialization) {
      doctorQuery += ` AND LOWER(d.specialization) LIKE LOWER($${paramIndex})`;
      queryParams.push(`%${specialization}%`);
      paramIndex++;
    }

    if (search) {
      doctorQuery += ` AND (LOWER(u.first_name) LIKE LOWER($${paramIndex}) OR LOWER(u.last_name) LIKE LOWER($${paramIndex}) OR LOWER(d.specialization) LIKE LOWER($${paramIndex}))`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Add ordering and pagination
    doctorQuery += ` ORDER BY u.first_name, u.last_name`;
    doctorQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(doctorQuery, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE u.is_active = true AND d.is_available = true
    `;

    const countParams = [];
    let countParamIndex = 1;

    if (specialization) {
      countQuery += ` AND LOWER(d.specialization) LIKE LOWER($${countParamIndex})`;
      countParams.push(`%${specialization}%`);
      countParamIndex++;
    }

    if (search) {
      countQuery += ` AND (LOWER(u.first_name) LIKE LOWER($${countParamIndex}) OR LOWER(u.last_name) LIKE LOWER($${countParamIndex}) OR LOWER(d.specialization) LIKE LOWER($${countParamIndex}))`;
      countParams.push(`%${search}%`);
    }

    const countResult = await query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].total);

    res.json({
      doctors: result.rows.map(doctor => ({
        id: doctor.id,
        name: `Dr. ${doctor.first_name} ${doctor.last_name}`,
        firstName: doctor.first_name,
        lastName: doctor.last_name,
        specialization: doctor.specialization,
        yearsOfExperience: doctor.years_of_experience,
        consultationFee: doctor.consultation_fee,
        bio: doctor.bio,
        isAvailable: doctor.is_available,
        // Only show contact info to authenticated users
        ...(req.user && {
          email: doctor.email,
          phone: doctor.phone
        })
      })),
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/doctors/:id
 * @desc    Get specific doctor details
 * @access  Public
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const doctorId = req.params.id;

    const doctorResult = await query(
      `SELECT d.id, d.specialization, d.license_number, d.years_of_experience, 
              d.consultation_fee, d.bio, d.is_available, d.created_at,
              u.first_name, u.last_name, u.email, u.phone
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = $1 AND u.is_active = true`,
      [doctorId]
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor not found or not available'
      });
    }

    const doctor = doctorResult.rows[0];

    // Get doctor's schedule
    const scheduleResult = await query(
      `SELECT day_of_week, start_time, end_time, slot_duration, is_active
       FROM doctor_schedules
       WHERE doctor_id = $1 AND is_active = true
       ORDER BY day_of_week`,
      [doctorId]
    );

    // Get recent reviews/ratings if available (placeholder for future implementation)
    const reviews = [];

    res.json({
      doctor: {
        id: doctor.id,
        name: `Dr. ${doctor.first_name} ${doctor.last_name}`,
        firstName: doctor.first_name,
        lastName: doctor.last_name,
        specialization: doctor.specialization,
        licenseNumber: doctor.license_number,
        yearsOfExperience: doctor.years_of_experience,
        consultationFee: doctor.consultation_fee,
        bio: doctor.bio,
        isAvailable: doctor.is_available,
        joinedDate: doctor.created_at,
        // Only show contact info to authenticated users
        ...(req.user && {
          email: doctor.email,
          phone: doctor.phone
        }),
        schedule: scheduleResult.rows.map(schedule => ({
          dayOfWeek: schedule.day_of_week,
          dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][schedule.day_of_week],
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          slotDuration: schedule.slot_duration,
          isActive: schedule.is_active
        })),
        reviews
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/doctors/specializations
 * @desc    Get list of all specializations
 * @access  Public
 */
router.get('/meta/specializations', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT DISTINCT specialization, COUNT(*) as doctor_count
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       WHERE u.is_active = true AND d.is_available = true
       GROUP BY specialization
       ORDER BY specialization`,
      []
    );

    res.json({
      specializations: result.rows.map(row => ({
        name: row.specialization,
        doctorCount: parseInt(row.doctor_count)
      }))
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/doctors/me/schedule
 * @desc    Get current doctor's schedule
 * @access  Private (Doctor only)
 */
router.get('/me/schedule', authenticateToken, requireRole(['doctor']), async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get doctor ID
    const doctorResult = await query(
      'SELECT id FROM doctors WHERE user_id = $1',
      [userId]
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Doctor profile not found',
        message: 'Doctor profile not found'
      });
    }

    const doctorId = doctorResult.rows[0].id;

    // Get schedule
    const scheduleResult = await query(
      `SELECT id, day_of_week, start_time, end_time, slot_duration, is_active, created_at, updated_at
       FROM doctor_schedules
       WHERE doctor_id = $1
       ORDER BY day_of_week`,
      [doctorId]
    );

    res.json({
      schedule: scheduleResult.rows.map(schedule => ({
        id: schedule.id,
        dayOfWeek: schedule.day_of_week,
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][schedule.day_of_week],
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        slotDuration: schedule.slot_duration,
        isActive: schedule.is_active,
        createdAt: schedule.created_at,
        updatedAt: schedule.updated_at
      }))
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/doctors/me/schedule
 * @desc    Update doctor's schedule
 * @access  Private (Doctor only)
 */
router.put('/me/schedule', authenticateToken, requireRole(['doctor']), async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = scheduleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const { schedules } = value;

    // Get doctor ID
    const doctorResult = await query(
      'SELECT id FROM doctors WHERE user_id = $1',
      [userId]
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Doctor profile not found',
        message: 'Doctor profile not found'
      });
    }

    const doctorId = doctorResult.rows[0].id;

    // Delete existing schedules
    await query(
      'DELETE FROM doctor_schedules WHERE doctor_id = $1',
      [doctorId]
    );

    // Insert new schedules
    const insertPromises = schedules.map(schedule => {
      return query(
        `INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [doctorId, schedule.dayOfWeek, schedule.startTime, schedule.endTime, schedule.slotDuration, schedule.isActive]
      );
    });

    const results = await Promise.all(insertPromises);

    res.json({
      message: 'Schedule updated successfully',
      schedule: results.map(result => {
        const schedule = result.rows[0];
        return {
          id: schedule.id,
          dayOfWeek: schedule.day_of_week,
          dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][schedule.day_of_week],
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          slotDuration: schedule.slot_duration,
          isActive: schedule.is_active
        };
      })
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/doctors/me/appointments
 * @desc    Get doctor's appointments (weekly view)
 * @access  Private (Doctor only)
 */
router.get('/me/appointments', authenticateToken, requireRole(['doctor']), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, status } = req.query;

    // Get doctor ID
    const doctorResult = await query(
      'SELECT id FROM doctors WHERE user_id = $1',
      [userId]
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Doctor profile not found',
        message: 'Doctor profile not found'
      });
    }

    const doctorId = doctorResult.rows[0].id;

    // Build query for appointments
    let appointmentQuery = `
      SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason_for_visit,
             a.notes, a.created_at,
             u.first_name as patient_first_name, u.last_name as patient_last_name,
             u.phone as patient_phone, u.email as patient_email,
             p.date_of_birth, p.gender
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.doctor_id = $1
    `;

    const queryParams = [doctorId];
    let paramIndex = 2;

    // Add date filters
    if (startDate) {
      appointmentQuery += ` AND a.appointment_date >= $${paramIndex}`;
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      appointmentQuery += ` AND a.appointment_date <= $${paramIndex}`;
      queryParams.push(endDate);
      paramIndex++;
    }

    if (status) {
      appointmentQuery += ` AND a.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    appointmentQuery += ` ORDER BY a.appointment_date, a.appointment_time`;

    const appointmentResult = await query(appointmentQuery, queryParams);

    res.json({
      appointments: appointmentResult.rows.map(appointment => ({
        id: appointment.id,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        status: appointment.status,
        reasonForVisit: appointment.reason_for_visit,
        notes: appointment.notes,
        createdAt: appointment.created_at,
        patient: {
          name: `${appointment.patient_first_name} ${appointment.patient_last_name}`,
          firstName: appointment.patient_first_name,
          lastName: appointment.patient_last_name,
          phone: appointment.patient_phone,
          email: appointment.patient_email,
          dateOfBirth: appointment.date_of_birth,
          gender: appointment.gender
        }
      }))
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/doctors/me/availability
 * @desc    Update doctor's availability status
 * @access  Private (Doctor only)
 */
router.put('/me/availability', authenticateToken, requireRole(['doctor']), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'isAvailable must be a boolean value'
      });
    }

    const result = await query(
      'UPDATE doctors SET is_available = $1, updated_at = NOW() WHERE user_id = $2 RETURNING is_available',
      [isAvailable, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Doctor profile not found',
        message: 'Doctor profile not found'
      });
    }

    res.json({
      message: 'Availability updated successfully',
      isAvailable: result.rows[0].is_available
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;