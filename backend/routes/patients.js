/**
 * Patient Routes
 * 
 * This module handles patient-related operations including
 * profile management and medical history.
 */

const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const updatePatientSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  address: Joi.string().max(500).optional(),
  emergencyContactName: Joi.string().max(100).optional(),
  emergencyContactPhone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  medicalHistory: Joi.string().max(2000).optional(),
  allergies: Joi.string().max(1000).optional()
});

/**
 * @route   GET /api/patients/me
 * @desc    Get current patient's profile
 * @access  Private (Patient only)
 */
router.get('/me', requireRole(['patient']), async (req, res, next) => {
  try {
    const userId = req.user.id;

    const patientResult = await query(
      `SELECT u.id as user_id, u.email, u.first_name, u.last_name, u.phone, u.created_at,
              p.id as patient_id, p.date_of_birth, p.gender, p.address, 
              p.emergency_contact_name, p.emergency_contact_phone, 
              p.medical_history, p.allergies, p.created_at as patient_created_at
       FROM users u
       JOIN patients p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Patient profile not found',
        message: 'Patient profile not found'
      });
    }

    const patient = patientResult.rows[0];

    res.json({
      patient: {
        id: patient.patient_id,
        userId: patient.user_id,
        email: patient.email,
        firstName: patient.first_name,
        lastName: patient.last_name,
        phone: patient.phone,
        dateOfBirth: patient.date_of_birth,
        gender: patient.gender,
        address: patient.address,
        emergencyContactName: patient.emergency_contact_name,
        emergencyContactPhone: patient.emergency_contact_phone,
        medicalHistory: patient.medical_history,
        allergies: patient.allergies,
        createdAt: patient.created_at,
        patientSince: patient.patient_created_at
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/patients/me
 * @desc    Update current patient's profile
 * @access  Private (Patient only)
 */
router.put('/me', requireRole(['patient']), async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = updatePatientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    const userId = req.user.id;
    const updates = value;

    // Separate user table updates from patient table updates
    const userUpdates = {};
    const patientUpdates = {};

    // Map fields to appropriate tables
    const userFields = ['firstName', 'lastName', 'phone'];
    const patientFields = ['dateOfBirth', 'gender', 'address', 'emergencyContactName', 'emergencyContactPhone', 'medicalHistory', 'allergies'];

    Object.keys(updates).forEach(key => {
      if (userFields.includes(key)) {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        userUpdates[dbField] = updates[key];
      } else if (patientFields.includes(key)) {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        patientUpdates[dbField] = updates[key];
      }
    });

    // Update user table if needed
    if (Object.keys(userUpdates).length > 0) {
      const userUpdateFields = [];
      const userUpdateValues = [];
      let paramIndex = 1;

      Object.keys(userUpdates).forEach(field => {
        userUpdateFields.push(`${field} = $${paramIndex}`);
        userUpdateValues.push(userUpdates[field]);
        paramIndex++;
      });

      userUpdateFields.push(`updated_at = NOW()`);
      userUpdateValues.push(userId);

      const userUpdateQuery = `
        UPDATE users 
        SET ${userUpdateFields.join(', ')}
        WHERE id = $${paramIndex}
      `;

      await query(userUpdateQuery, userUpdateValues);
    }

    // Update patient table if needed
    if (Object.keys(patientUpdates).length > 0) {
      const patientUpdateFields = [];
      const patientUpdateValues = [];
      let paramIndex = 1;

      Object.keys(patientUpdates).forEach(field => {
        patientUpdateFields.push(`${field} = $${paramIndex}`);
        patientUpdateValues.push(patientUpdates[field]);
        paramIndex++;
      });

      patientUpdateFields.push(`updated_at = NOW()`);
      patientUpdateValues.push(userId);

      const patientUpdateQuery = `
        UPDATE patients 
        SET ${patientUpdateFields.join(', ')}
        WHERE user_id = $${paramIndex}
      `;

      await query(patientUpdateQuery, patientUpdateValues);
    }

    // Get updated patient data
    const updatedPatientResult = await query(
      `SELECT u.id as user_id, u.email, u.first_name, u.last_name, u.phone, u.updated_at,
              p.id as patient_id, p.date_of_birth, p.gender, p.address, 
              p.emergency_contact_name, p.emergency_contact_phone, 
              p.medical_history, p.allergies, p.updated_at as patient_updated_at
       FROM users u
       JOIN patients p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    const updatedPatient = updatedPatientResult.rows[0];

    res.json({
      message: 'Patient profile updated successfully',
      patient: {
        id: updatedPatient.patient_id,
        userId: updatedPatient.user_id,
        email: updatedPatient.email,
        firstName: updatedPatient.first_name,
        lastName: updatedPatient.last_name,
        phone: updatedPatient.phone,
        dateOfBirth: updatedPatient.date_of_birth,
        gender: updatedPatient.gender,
        address: updatedPatient.address,
        emergencyContactName: updatedPatient.emergency_contact_name,
        emergencyContactPhone: updatedPatient.emergency_contact_phone,
        medicalHistory: updatedPatient.medical_history,
        allergies: updatedPatient.allergies,
        updatedAt: updatedPatient.updated_at,
        patientUpdatedAt: updatedPatient.patient_updated_at
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/patients/me/appointments
 * @desc    Get current patient's appointments
 * @access  Private (Patient only)
 */
router.get('/me/appointments', requireRole(['patient']), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, upcoming, limit = 20, offset = 0 } = req.query;

    // Get patient ID
    const patientResult = await query(
      'SELECT id FROM patients WHERE user_id = $1',
      [userId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Patient profile not found',
        message: 'Patient profile not found'
      });
    }

    const patientId = patientResult.rows[0].id;

    // Build appointments query
    let appointmentQuery = `
      SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason_for_visit,
             a.notes, a.created_at, a.updated_at,
             u.first_name as doctor_first_name, u.last_name as doctor_last_name,
             d.specialization, d.consultation_fee
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE a.patient_id = $1
    `;

    const queryParams = [patientId];
    let paramIndex = 2;

    // Add filters
    if (status) {
      appointmentQuery += ` AND a.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (upcoming === 'true') {
      appointmentQuery += ` AND (a.appointment_date > CURRENT_DATE OR (a.appointment_date = CURRENT_DATE AND a.appointment_time > CURRENT_TIME))`;
      appointmentQuery += ` AND a.status NOT IN ('cancelled', 'completed')`;
    }

    // Add ordering and pagination
    appointmentQuery += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC`;
    appointmentQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

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
        updatedAt: appointment.updated_at,
        doctor: {
          name: `Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}`,
          firstName: appointment.doctor_first_name,
          lastName: appointment.doctor_last_name,
          specialization: appointment.specialization,
          consultationFee: appointment.consultation_fee
        }
      })),
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: appointmentResult.rows.length
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/patients/me/medical-history
 * @desc    Get patient's medical history and past appointments
 * @access  Private (Patient only)
 */
router.get('/me/medical-history', requireRole(['patient']), async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get patient ID and basic info
    const patientResult = await query(
      `SELECT p.id, p.medical_history, p.allergies, p.date_of_birth, p.gender,
              u.first_name, u.last_name
       FROM patients p
       JOIN users u ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Patient profile not found',
        message: 'Patient profile not found'
      });
    }

    const patient = patientResult.rows[0];

    // Get past appointments with notes
    const appointmentHistoryResult = await query(
      `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.reason_for_visit,
              a.notes, a.created_at,
              u.first_name as doctor_first_name, u.last_name as doctor_last_name,
              d.specialization
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE a.patient_id = $1 AND a.status = 'completed'
       ORDER BY a.appointment_date DESC, a.appointment_time DESC
       LIMIT 50`,
      [patient.id]
    );

    res.json({
      medicalHistory: {
        patientInfo: {
          name: `${patient.first_name} ${patient.last_name}`,
          dateOfBirth: patient.date_of_birth,
          gender: patient.gender
        },
        medicalHistory: patient.medical_history,
        allergies: patient.allergies,
        appointmentHistory: appointmentHistoryResult.rows.map(appointment => ({
          id: appointment.id,
          appointmentDate: appointment.appointment_date,
          appointmentTime: appointment.appointment_time,
          status: appointment.status,
          reasonForVisit: appointment.reason_for_visit,
          notes: appointment.notes,
          createdAt: appointment.created_at,
          doctor: {
            name: `Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}`,
            specialization: appointment.specialization
          }
        }))
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/patients/me/stats
 * @desc    Get patient's appointment statistics
 * @access  Private (Patient only)
 */
router.get('/me/stats', requireRole(['patient']), async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get patient ID
    const patientResult = await query(
      'SELECT id FROM patients WHERE user_id = $1',
      [userId]
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Patient profile not found',
        message: 'Patient profile not found'
      });
    }

    const patientId = patientResult.rows[0].id;

    // Get appointment statistics
    const statsResult = await query(
      `SELECT 
         COUNT(*) as total_appointments,
         COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_appointments,
         COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_appointments,
         COUNT(CASE WHEN status = 'scheduled' OR status = 'confirmed' THEN 1 END) as upcoming_appointments,
         COUNT(CASE WHEN status = 'no_show' THEN 1 END) as missed_appointments
       FROM appointments
       WHERE patient_id = $1`,
      [patientId]
    );

    // Get next upcoming appointment
    const nextAppointmentResult = await query(
      `SELECT a.id, a.appointment_date, a.appointment_time, a.reason_for_visit,
              u.first_name as doctor_first_name, u.last_name as doctor_last_name,
              d.specialization
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE a.patient_id = $1 
       AND (a.appointment_date > CURRENT_DATE OR (a.appointment_date = CURRENT_DATE AND a.appointment_time > CURRENT_TIME))
       AND a.status IN ('scheduled', 'confirmed')
       ORDER BY a.appointment_date, a.appointment_time
       LIMIT 1`,
      [patientId]
    );

    const stats = statsResult.rows[0];
    const nextAppointment = nextAppointmentResult.rows[0] || null;

    res.json({
      stats: {
        totalAppointments: parseInt(stats.total_appointments),
        completedAppointments: parseInt(stats.completed_appointments),
        cancelledAppointments: parseInt(stats.cancelled_appointments),
        upcomingAppointments: parseInt(stats.upcoming_appointments),
        missedAppointments: parseInt(stats.missed_appointments),
        nextAppointment: nextAppointment ? {
          id: nextAppointment.id,
          appointmentDate: nextAppointment.appointment_date,
          appointmentTime: nextAppointment.appointment_time,
          reasonForVisit: nextAppointment.reason_for_visit,
          doctor: {
            name: `Dr. ${nextAppointment.doctor_first_name} ${nextAppointment.doctor_last_name}`,
            specialization: nextAppointment.specialization
          }
        } : null
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;