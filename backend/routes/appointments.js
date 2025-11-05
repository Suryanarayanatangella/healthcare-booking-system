/**
 * Appointment Routes
 * 
 * This module handles all appointment-related operations including
 * booking, cancellation, rescheduling, and viewing appointments.
 */

const express = require('express');
const Joi = require('joi');
const { query, getClient } = require('../config/database');
const { requireRole } = require('../middleware/auth');
const { sendAppointmentConfirmation, sendAppointmentCancellation } = require('../utils/emailService');

const router = express.Router();

// Validation schemas
const bookAppointmentSchema = Joi.object({
  doctorId: Joi.string().uuid().required(),
  appointmentDate: Joi.date().min('now').required(),
  appointmentTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  reasonForVisit: Joi.string().max(500).optional()
});

const updateAppointmentSchema = Joi.object({
  appointmentDate: Joi.date().min('now').optional(),
  appointmentTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  reasonForVisit: Joi.string().max(500).optional(),
  status: Joi.string().valid('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show').optional(),
  cancellationReason: Joi.string().max(500).optional()
});

/**
 * @route   POST /api/appointments
 * @desc    Book a new appointment
 * @access  Private (Patient only)
 */
router.post('/', requireRole(['patient']), async (req, res, next) => {
  const client = await getClient();
  
  try {
    // Validate request body
    const { error, value } = bookAppointmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    const { doctorId, appointmentDate, appointmentTime, reasonForVisit } = value;
    const userId = req.user.id;

    await client.query('BEGIN');

    // Get patient ID
    const patientResult = await client.query(
      'SELECT id FROM patients WHERE user_id = $1',
      [userId]
    );

    if (patientResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Patient not found',
        message: 'Patient profile not found'
      });
    }

    const patientId = patientResult.rows[0].id;

    // Verify doctor exists and is available
    const doctorResult = await client.query(
      `SELECT d.id, d.is_available, u.first_name, u.last_name, u.email
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = $1 AND u.is_active = true`,
      [doctorId]
    );

    if (doctorResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor not found or not available'
      });
    }

    const doctor = doctorResult.rows[0];

    if (!doctor.is_available) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Doctor unavailable',
        message: 'Doctor is currently not accepting appointments'
      });
    }

    // Check if the time slot is available (prevent double booking)
    const existingAppointment = await client.query(
      `SELECT id FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3 
       AND status NOT IN ('cancelled')`,
      [doctorId, appointmentDate, appointmentTime]
    );

    if (existingAppointment.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: 'Time slot unavailable',
        message: 'This time slot is already booked'
      });
    }

    // Check doctor's schedule availability
    const dayOfWeek = new Date(appointmentDate).getDay();
    const scheduleResult = await client.query(
      `SELECT id FROM doctor_schedules 
       WHERE doctor_id = $1 AND day_of_week = $2 
       AND start_time <= $3 AND end_time > $4 AND is_active = true`,
      [doctorId, dayOfWeek, appointmentTime, appointmentTime]
    );

    if (scheduleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Time slot unavailable',
        message: 'Doctor is not available at this time'
      });
    }

    // Create appointment
    const appointmentResult = await client.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason_for_visit, status)
       VALUES ($1, $2, $3, $4, $5, 'scheduled')
       RETURNING id, appointment_date, appointment_time, status, created_at`,
      [patientId, doctorId, appointmentDate, appointmentTime, reasonForVisit]
    );

    const appointment = appointmentResult.rows[0];

    await client.query('COMMIT');

    // Get patient details for email
    const patientDetailsResult = await query(
      `SELECT u.first_name, u.last_name, u.email
       FROM users u
       JOIN patients p ON u.id = p.user_id
       WHERE p.id = $1`,
      [patientId]
    );

    const patient = patientDetailsResult.rows[0];

    // Send confirmation emails
    try {
      await sendAppointmentConfirmation({
        patientEmail: patient.email,
        patientName: `${patient.first_name} ${patient.last_name}`,
        doctorEmail: doctor.email,
        doctorName: `${doctor.first_name} ${doctor.last_name}`,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        appointmentId: appointment.id,
        reasonForVisit
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the appointment booking if email fails
    }

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment.id,
        doctorName: `Dr. ${doctor.first_name} ${doctor.last_name}`,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        status: appointment.status,
        reasonForVisit,
        createdAt: appointment.created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

/**
 * @route   GET /api/appointments
 * @desc    Get user's appointments
 * @access  Private
 */
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, date, limit = 50, offset = 0 } = req.query;

    let baseQuery = '';
    let queryParams = [userId];
    let paramIndex = 2;

    if (userRole === 'patient') {
      baseQuery = `
        SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason_for_visit,
               a.notes, a.created_at, a.updated_at,
               u.first_name as doctor_first_name, u.last_name as doctor_last_name,
               d.specialization, d.consultation_fee
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE p.user_id = $1
      `;
    } else if (userRole === 'doctor') {
      baseQuery = `
        SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason_for_visit,
               a.notes, a.created_at, a.updated_at,
               u.first_name as patient_first_name, u.last_name as patient_last_name,
               u.phone as patient_phone
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE d.user_id = $1
      `;
    }

    // Add filters
    if (status) {
      baseQuery += ` AND a.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (date) {
      baseQuery += ` AND a.appointment_date = $${paramIndex}`;
      queryParams.push(date);
      paramIndex++;
    }

    // Add ordering and pagination
    baseQuery += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC`;
    baseQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await query(baseQuery, queryParams);

    res.json({
      appointments: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/appointments/:id
 * @desc    Get specific appointment details
 * @access  Private
 */
router.get('/:id', async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    let appointmentQuery = '';
    
    if (userRole === 'patient') {
      appointmentQuery = `
        SELECT a.*, 
               u.first_name as doctor_first_name, u.last_name as doctor_last_name,
               d.specialization, d.consultation_fee, d.bio
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE a.id = $1 AND p.user_id = $2
      `;
    } else if (userRole === 'doctor') {
      appointmentQuery = `
        SELECT a.*,
               u.first_name as patient_first_name, u.last_name as patient_last_name,
               u.phone as patient_phone, u.email as patient_email,
               p.date_of_birth, p.gender, p.medical_history, p.allergies
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE a.id = $1 AND d.user_id = $2
      `;
    }

    const result = await query(appointmentQuery, [appointmentId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Appointment not found',
        message: 'Appointment not found or access denied'
      });
    }

    res.json({
      appointment: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/appointments/:id
 * @desc    Update appointment (reschedule, cancel, etc.)
 * @access  Private
 */
router.put('/:id', async (req, res, next) => {
  const client = await getClient();
  
  try {
    // Validate request body
    const { error, value } = updateAppointmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    const appointmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const updates = value;

    await client.query('BEGIN');

    // Get current appointment details
    let appointmentQuery = '';
    if (userRole === 'patient') {
      appointmentQuery = `
        SELECT a.*, p.id as patient_id,
               du.first_name as doctor_first_name, du.last_name as doctor_last_name, du.email as doctor_email,
               pu.first_name as patient_first_name, pu.last_name as patient_last_name, pu.email as patient_email
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        JOIN users pu ON p.user_id = pu.id
        WHERE a.id = $1 AND p.user_id = $2
      `;
    } else if (userRole === 'doctor') {
      appointmentQuery = `
        SELECT a.*, d.id as doctor_id,
               du.first_name as doctor_first_name, du.last_name as doctor_last_name, du.email as doctor_email,
               pu.first_name as patient_first_name, pu.last_name as patient_last_name, pu.email as patient_email
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users du ON d.user_id = du.id
        JOIN users pu ON p.user_id = pu.id
        WHERE a.id = $1 AND d.user_id = $2
      `;
    }

    const appointmentResult = await client.query(appointmentQuery, [appointmentId, userId]);

    if (appointmentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'Appointment not found',
        message: 'Appointment not found or access denied'
      });
    }

    const currentAppointment = appointmentResult.rows[0];

    // Check if appointment can be modified
    if (currentAppointment.status === 'cancelled' || currentAppointment.status === 'completed') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Cannot modify appointment',
        message: 'Cannot modify cancelled or completed appointments'
      });
    }

    // If rescheduling, check for conflicts
    if (updates.appointmentDate || updates.appointmentTime) {
      const newDate = updates.appointmentDate || currentAppointment.appointment_date;
      const newTime = updates.appointmentTime || currentAppointment.appointment_time;

      // Check for conflicts (excluding current appointment)
      const conflictResult = await client.query(
        `SELECT id FROM appointments 
         WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3 
         AND status NOT IN ('cancelled') AND id != $4`,
        [currentAppointment.doctor_id, newDate, newTime, appointmentId]
      );

      if (conflictResult.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          error: 'Time slot unavailable',
          message: 'This time slot is already booked'
        });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateFields.push(`${dbField} = $${paramIndex}`);
        updateValues.push(updates[key]);
        paramIndex++;
      }
    });

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(appointmentId);

    const updateQuery = `
      UPDATE appointments 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const updateResult = await client.query(updateQuery, updateValues);
    const updatedAppointment = updateResult.rows[0];

    await client.query('COMMIT');

    // Send cancellation email if appointment was cancelled
    if (updates.status === 'cancelled') {
      try {
        await sendAppointmentCancellation({
          patientEmail: currentAppointment.patient_email,
          patientName: `${currentAppointment.patient_first_name} ${currentAppointment.patient_last_name}`,
          doctorEmail: currentAppointment.doctor_email,
          doctorName: `${currentAppointment.doctor_first_name} ${currentAppointment.doctor_last_name}`,
          appointmentDate: currentAppointment.appointment_date,
          appointmentTime: currentAppointment.appointment_time,
          appointmentId: appointmentId,
          cancellationReason: updates.cancellationReason
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Cancel appointment
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { cancellationReason } = req.body;

    // Use the PUT endpoint to cancel the appointment
    req.body = {
      status: 'cancelled',
      cancellationReason
    };

    // Call the PUT handler
    return router.put('/:id')(req, res, next);

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/appointments/doctor/:doctorId/availability
 * @desc    Get available time slots for a doctor on a specific date
 * @access  Public
 */
router.get('/doctor/:doctorId/availability', async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Date parameter is required'
      });
    }

    const dayOfWeek = new Date(date).getDay();

    // Get doctor's schedule for the day
    const scheduleResult = await query(
      `SELECT start_time, end_time, slot_duration
       FROM doctor_schedules
       WHERE doctor_id = $1 AND day_of_week = $2 AND is_active = true`,
      [doctorId, dayOfWeek]
    );

    if (scheduleResult.rows.length === 0) {
      return res.json({
        availableSlots: [],
        message: 'Doctor is not available on this day'
      });
    }

    const schedule = scheduleResult.rows[0];

    // Get booked appointments for the date
    const bookedResult = await query(
      `SELECT appointment_time
       FROM appointments
       WHERE doctor_id = $1 AND appointment_date = $2 AND status NOT IN ('cancelled')`,
      [doctorId, date]
    );

    const bookedTimes = bookedResult.rows.map(row => row.appointment_time);

    // Generate available time slots
    const availableSlots = [];
    const startTime = new Date(`2000-01-01T${schedule.start_time}`);
    const endTime = new Date(`2000-01-01T${schedule.end_time}`);
    const slotDuration = schedule.slot_duration;

    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      
      if (!bookedTimes.includes(timeString)) {
        availableSlots.push({
          time: timeString,
          available: true
        });
      }

      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }

    res.json({
      date,
      availableSlots,
      doctorSchedule: {
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        slotDuration: schedule.slot_duration
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;