/**
 * Appointment Routes
 * 
 * This module handles all appointment-related operations including
 * booking, cancellation, rescheduling, and viewing appointments.
 */

const express = require('express');
const Joi = require('joi');
const { database, getClient } = require('../config/database');
const { requireRole } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Validation schemas
const bookAppointmentSchema = Joi.object({
  doctorId: Joi.number().integer().positive().required(),
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

    // Get patient ID using database wrapper
    const patient = await database.getPatientByUserId(userId);
    if (!patient) {
      return res.status(404).json({
        error: 'Patient profile required',
        message: 'Patient profile not found. Please contact support or try registering again with complete patient information.',
        suggestion: 'Make sure you registered as a patient and provided all required information including date of birth, address, and emergency contact details.'
      });
    }

    const patientId = patient.id;

    // Verify doctor exists and is available
    const doctor = await database.getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        error: 'Doctor not found',
        message: 'Doctor not found or not available'
      });
    }

    if (!doctor.is_available) {
      return res.status(400).json({
        error: 'Doctor unavailable',
        message: 'Doctor is currently not accepting appointments'
      });
    }

    // Check if the time slot is available (prevent double booking)
    const existingAppointments = await database.getAppointmentsByDoctorId(doctorId);
    const conflictingAppointment = existingAppointments.find(apt => 
      apt.appointment_date === appointmentDate && 
      apt.appointment_time === appointmentTime && 
      apt.status !== 'cancelled'
    );

    if (conflictingAppointment) {
      return res.status(409).json({
        error: 'Time slot unavailable',
        message: 'This time slot is already booked'
      });
    }

    // Create appointment using database wrapper
    const appointmentData = {
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      reason_for_visit: reasonForVisit
    };

    const appointment = await database.createAppointment(appointmentData);

    // Get patient details for email
    const patientUser = await database.getUserById(userId);

    // Send email notifications
    try {
      // Prepare email data
      const emailData = {
        appointmentId: appointment.id,
        patientName: `${patientUser.firstName} ${patientUser.lastName}`,
        patientEmail: patientUser.email,
        doctorName: `${doctor.first_name} ${doctor.last_name}`,
        doctorEmail: doctor.email,
        appointmentDate,
        appointmentTime,
        reasonForVisit: reasonForVisit || 'General consultation'
      };

      // Send confirmation email to patient
      await emailService.sendAppointmentConfirmation(emailData);

      // Send notification email to doctor
      await emailService.sendDoctorNotification(emailData);

      console.log('✅ Email notifications sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email notification failed:', emailError.message);
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
    console.error('Appointment booking error:', error);
    res.status(500).json({
      error: 'Booking failed',
      message: 'Failed to book appointment. Please try again.'
    });
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
        const emailData = {
          appointmentId: appointmentId,
          patientName: `${currentAppointment.patient_first_name} ${currentAppointment.patient_last_name}`,
          patientEmail: currentAppointment.patient_email,
          doctorName: `${currentAppointment.doctor_first_name} ${currentAppointment.doctor_last_name}`,
          appointmentDate: currentAppointment.appointment_date,
          appointmentTime: currentAppointment.appointment_time,
          cancellationReason: updates.cancellationReason
        };

        await emailService.sendCancellationEmail(emailData);
        console.log('✅ Cancellation email sent successfully');
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError.message);
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