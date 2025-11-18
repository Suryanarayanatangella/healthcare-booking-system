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
// Updated validation schemas
const updatePatientSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').optional(),
  address: Joi.string().max(500).optional(),
  emergencyContactName: Joi.string().max(100).optional(),
  emergencyContactPhone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  emergencyContactRelationship: Joi.string().max(50).optional(),
  medicalHistory: Joi.string().max(2000).optional(),
  allergies: Joi.string().max(1000).optional(),
  currentMedications: Joi.string().max(1000).optional(),
  
  // UPDATED FIELD NAMES - Match frontend exactly
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional(),
  height: Joi.number().min(50).max(250).optional(), // Changed from heightCm to height
  weight: Joi.number().min(2).max(300).optional(), // Changed from weightKg to weight
  bloodPressure: Joi.string().pattern(/^\d{2,3}\/\d{2,3}$/).optional(),
  pastMedicalHistory: Joi.string().max(2000).optional(),
  familyMedicalHistory: Joi.string().max(2000).optional(),
  smoking: Joi.string().valid('never', 'occasionally', 'regularly', 'former').optional(),
  alcohol: Joi.string().valid('never', 'occasionally', 'regularly', 'former').optional(),
  exercise: Joi.string().valid('sedentary', 'light', 'moderate', 'intense').optional(),
  diet: Joi.string().valid('vegetarian', 'non-vegetarian', 'vegan', 'balanced', 'keto', 'other').optional(),
  preferredLanguage: Joi.string().max(50).optional(),
  communicationPreferences: Joi.object().optional()
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
              p.emergency_contact_name, p.emergency_contact_phone, p.emergency_contact_relationship,
              p.medical_history, p.allergies, p.current_medications, p.insurance_provider, p.insurance_policy_number,
              p.blood_group, p.height_cm, p.weight_kg, p.bmi, p.blood_pressure,
              p.past_medical_history, p.family_medical_history,
              p.smoking, p.alcohol, p.exercise, p.diet,
              p.preferred_language, p.communication_preferences,
              p.created_at as patient_created_at
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

    // Parse JSON fields
    let communicationPreferences = {};
    try {
      if (patient.communication_preferences) {
        communicationPreferences = JSON.parse(patient.communication_preferences);
      }
    } catch (e) {
      console.warn('Failed to parse communication preferences:', e);
    }

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
        emergencyContactRelationship: patient.emergency_contact_relationship,
        medicalHistory: patient.medical_history,
        allergies: patient.allergies,
        currentMedications: patient.current_medications,
        insuranceProvider: patient.insurance_provider,
        insurancePolicyNumber: patient.insurance_policy_number,
        
        // NEW MEDICAL FIELDS
        bloodGroup: patient.blood_group,
        heightCm: patient.height_cm,
        weightKg: patient.weight_kg,
        bmi: patient.bmi,
        bloodPressure: patient.blood_pressure,
        pastMedicalHistory: patient.past_medical_history,
        familyMedicalHistory: patient.family_medical_history,
        smoking: patient.smoking,
        alcohol: patient.alcohol,
        exercise: patient.exercise,
        diet: patient.diet,
        preferredLanguage: patient.preferred_language,
        communicationPreferences: communicationPreferences,
        
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

    // Map fields to appropriate tables - UPDATED FIELD MAPPING
const userFields = ['firstName', 'lastName', 'phone'];
const patientFields = [
  'dateOfBirth', 'gender', 'address', 'emergencyContactName', 'emergencyContactPhone', 
  'emergencyContactRelationship', 'medicalHistory', 'allergies', 'currentMedications',
  'insuranceProvider', 'insurancePolicyNumber',
  // UPDATED FIELD NAMES
  'bloodGroup', 'height', 'weight', 'bloodPressure', 'pastMedicalHistory', // Changed heightCm→height, weightKg→weight
  'familyMedicalHistory', 'smoking', 'alcohol', 'exercise', 'diet',
  'preferredLanguage', 'communicationPreferences'
];

Object.keys(updates).forEach(key => {
  if (userFields.includes(key)) {
    const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    userUpdates[dbField] = updates[key];
  } else if (patientFields.includes(key)) {
    // SPECIAL MAPPING FOR DATABASE COLUMNS
    let dbField;
    if (key === 'height') {
      dbField = 'height_cm'; // Map 'height' from frontend to 'height_cm' in database
    } else if (key === 'weight') {
      dbField = 'weight_kg'; // Map 'weight' from frontend to 'weight_kg' in database
    } else {
      dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
    
    // Handle JSON fields
    if (key === 'communicationPreferences' && typeof updates[key] === 'object') {
      patientUpdates[dbField] = JSON.stringify(updates[key]);
    } else {
      patientUpdates[dbField] = updates[key];
    }
  }
});

// Calculate BMI if height and weight are provided
if (updates.height && updates.weight) {
  const heightInMeters = updates.height / 100;
  const bmi = updates.weight / (heightInMeters * heightInMeters);
  patientUpdates.bmi = Math.round(bmi * 100) / 100; // Round to 2 decimal places
}

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
              p.emergency_contact_name, p.emergency_contact_phone, p.emergency_contact_relationship,
              p.medical_history, p.allergies, p.current_medications,
              p.blood_group, p.height_cm, p.weight_kg, p.bmi, p.blood_pressure,
              p.past_medical_history, p.family_medical_history,
              p.smoking, p.alcohol, p.exercise, p.diet,
              p.preferred_language, p.communication_preferences,
              p.updated_at as patient_updated_at
       FROM users u
       JOIN patients p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    const updatedPatient = updatedPatientResult.rows[0];

    // Parse JSON fields for response
    let communicationPreferences = {};
    try {
      if (updatedPatient.communication_preferences) {
        communicationPreferences = JSON.parse(updatedPatient.communication_preferences);
      }
    } catch (e) {
      console.warn('Failed to parse communication preferences:', e);
    }

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
        emergencyContactRelationship: updatedPatient.emergency_contact_relationship,
        medicalHistory: updatedPatient.medical_history,
        allergies: updatedPatient.allergies,
        currentMedications: updatedPatient.current_medications,
        
        // NEW MEDICAL FIELDS
        bloodGroup: updatedPatient.blood_group,
        heightCm: updatedPatient.height_cm,
        weightKg: updatedPatient.weight_kg,
        bmi: updatedPatient.bmi,
        bloodPressure: updatedPatient.blood_pressure,
        pastMedicalHistory: updatedPatient.past_medical_history,
        familyMedicalHistory: updatedPatient.family_medical_history,
        smoking: updatedPatient.smoking,
        alcohol: updatedPatient.alcohol,
        exercise: updatedPatient.exercise,
        diet: updatedPatient.diet,
        preferredLanguage: updatedPatient.preferred_language,
        communicationPreferences: communicationPreferences,
        
        updatedAt: updatedPatient.updated_at,
        patientUpdatedAt: updatedPatient.patient_updated_at
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/patients/me/stats
 * @desc    Get patient's appointment statistics with enhanced medical data
 * @access  Private (Patient only)
 */
router.get('/me/stats', requireRole(['patient']), async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get patient ID and medical information
    const patientResult = await query(
      `SELECT p.id, p.blood_group, p.height_cm, p.weight_kg, p.bmi, p.blood_pressure,
              p.allergies, p.current_medications, p.date_of_birth, p.gender,
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
    const patientId = patient.id;

    // Calculate age
    const calculateAge = (dateOfBirth) => {
      if (!dateOfBirth) return null;
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

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

    // Get medical records count
    const medicalRecordsResult = await query(
      `SELECT COUNT(*) as total_records
       FROM patient_medical_records
       WHERE patient_id = $1`,
      [patientId]
    );

    const stats = statsResult.rows[0];
    const nextAppointment = nextAppointmentResult.rows[0] || null;
    const medicalRecordsCount = medicalRecordsResult.rows[0].total_records;

    // Parse allergies and medications
    const allergies = patient.allergies ? patient.allergies.split(',').filter(a => a.trim()).length : 0;
    const medications = patient.current_medications ? patient.current_medications.split(',').filter(m => m.trim()).length : 0;

    res.json({
      stats: {
        patientInfo: {
          name: `${patient.first_name} ${patient.last_name}`,
          age: calculateAge(patient.date_of_birth),
          bloodGroup: patient.blood_group,
          bmi: patient.bmi,
          bloodPressure: patient.blood_pressure,
          lastCheckup: nextAppointment?.appointment_date || null
        },
        appointments: {
          total: parseInt(stats.total_appointments),
          completed: parseInt(stats.completed_appointments),
          cancelled: parseInt(stats.cancelled_appointments),
          upcoming: parseInt(stats.upcoming_appointments),
          missed: parseInt(stats.missed_appointments)
        },
        medical: {
          records: parseInt(medicalRecordsCount),
          allergies: allergies,
          medications: medications
        },
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

/**
 * @route   GET /api/patients/me/medical-records
 * @desc    Get patient's detailed medical records
 * @access  Private (Patient only)
 */
router.get('/me/medical-records', requireRole(['patient']), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

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

    // Get medical records with pagination
    const medicalRecordsResult = await query(
      `SELECT pmr.*,
              u.first_name as doctor_first_name, u.last_name as doctor_last_name,
              d.specialization,
              a.appointment_date, a.appointment_time
       FROM patient_medical_records pmr
       LEFT JOIN users u ON pmr.doctor_id = u.id
       LEFT JOIN doctors d ON pmr.doctor_id = d.id
       LEFT JOIN appointments a ON pmr.appointment_id = a.id
       WHERE pmr.patient_id = $1
       ORDER BY pmr.visit_date DESC, pmr.created_at DESC
       LIMIT $2 OFFSET $3`,
      [patientId, parseInt(limit), parseInt(offset)]
    );

    // Get total count for pagination
    const totalResult = await query(
      'SELECT COUNT(*) as total FROM patient_medical_records WHERE patient_id = $1',
      [patientId]
    );

    const totalRecords = parseInt(totalResult.rows[0].total);

    res.json({
      medicalRecords: medicalRecordsResult.rows.map(record => ({
        id: record.id,
        visitDate: record.visit_date,
        diagnosis: record.diagnosis,
        symptoms: record.symptoms,
        clinicalNotes: record.clinical_notes,
        prescription: record.prescription,
        vitalSigns: record.vital_signs,
        physicalExamination: record.physical_examination,
        labResults: record.lab_results,
        imagingResults: record.imaging_results,
        treatmentPlan: record.treatment_plan,
        followUpInstructions: record.follow_up_instructions,
        followUpDate: record.follow_up_date,
        recordType: record.record_type,
        doctor: record.doctor_first_name ? {
          name: `Dr. ${record.doctor_first_name} ${record.doctor_last_name}`,
          specialization: record.specialization
        } : null,
        appointment: record.appointment_date ? {
          date: record.appointment_date,
          time: record.appointment_time
        } : null,
        createdAt: record.created_at,
        updatedAt: record.updated_at
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalItems: totalRecords,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    next(error);
  }
});

// KEEP ALL YOUR EXISTING ROUTES BELOW - THEY REMAIN UNCHANGED
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
      `SELECT p.id, p.medical_history, p.allergies, p.current_medications, p.date_of_birth, p.gender,
              p.blood_group, p.height_cm, p.weight_kg, p.bmi, p.blood_pressure,
              p.past_medical_history, p.family_medical_history,
              p.smoking, p.alcohol, p.exercise, p.diet,
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
          gender: patient.gender,
          bloodGroup: patient.blood_group,
          height: patient.height_cm,
          weight: patient.weight_kg,
          bmi: patient.bmi,
          bloodPressure: patient.blood_pressure
        },
        lifestyle: {
          smoking: patient.smoking,
          alcohol: patient.alcohol,
          exercise: patient.exercise,
          diet: patient.diet
        },
        medicalHistory: patient.medical_history,
        pastMedicalHistory: patient.past_medical_history,
        familyMedicalHistory: patient.family_medical_history,
        allergies: patient.allergies,
        currentMedications: patient.current_medications,
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


module.exports = router;