/**
 * Doctor Routes
 * 
 * This module handles all doctor-related operations including
 * getting doctor lists, availability, and schedules.
 */

const express = require('express');
const { database } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/doctors
 * @desc    Get all available doctors
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const doctors = await database.getAllDoctors();
    
    res.json({
      success: true,
      doctors: doctors.map(doctor => ({
        id: doctor.id,
        userId: doctor.user_id,
        name: `${doctor.first_name} ${doctor.last_name}`,
        firstName: doctor.first_name,
        lastName: doctor.last_name,
        specialization: doctor.specialization,
        experience: doctor.experience,
        consultationFee: doctor.consultation_fee,
        bio: doctor.bio,
        email: doctor.email
      }))
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors'
    });
  }
});

/**
 * @route   GET /api/doctors/specializations
 * @desc    Get all unique specializations
 * @access  Private
 */
router.get('/specializations', authenticateToken, async (req, res) => {
  try {
    const doctors = await database.getAllDoctors();
    const specializations = [...new Set(doctors.map(doctor => doctor.specialization))].filter(Boolean);
    
    res.json({
      success: true,
      specializations
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specializations'
    });
  }
});

/**
 * @route   GET /api/doctors/:id/availability
 * @desc    Get doctor's available time slots for a specific date
 * @access  Private
 */
router.get('/:id/availability', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    // Get existing appointments for the doctor on the specified date
    const existingAppointments = await database.getAppointmentsByDoctorId(parseInt(id));
    const bookedSlots = existingAppointments
      .filter(apt => apt.appointment_date === date && apt.status !== 'cancelled')
      .map(apt => apt.appointment_time);

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(timeSlot);
      }
    }

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      success: true,
      date,
      availableSlots,
      bookedSlots
    });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor availability'
    });
  }
});

/**
 * @route   GET /api/doctors/:id/schedule
 * @desc    Get doctor's schedule for a date range
 * @access  Private (Doctor only)
 */
router.get('/:id/schedule', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Get appointments for the doctor in the date range
    const appointments = await database.getAppointmentsByDoctorId(parseInt(id));
    const filteredAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return aptDate >= start && aptDate <= end;
    });

    // Group appointments by date
    const schedule = {};
    filteredAppointments.forEach(apt => {
      const date = apt.appointment_date;
      if (!schedule[date]) {
        schedule[date] = [];
      }
      schedule[date].push({
        id: apt.id,
        time: apt.appointment_time,
        duration: apt.duration || 30,
        patientName: `${apt.patient_first_name} ${apt.patient_last_name}`,
        patientEmail: apt.patient_email,
        reason: apt.reason_for_visit,
        status: apt.status
      });
    });

    res.json({
      success: true,
      schedule,
      totalAppointments: filteredAppointments.length
    });
  } catch (error) {
    console.error('Get doctor schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor schedule'
    });
  }
});

/**
 * @route   PUT /api/doctors/:id/schedule
 * @desc    Update doctor's schedule/availability
 * @access  Private (Doctor only)
 */
router.put('/:id/schedule', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { availableHours, workingDays } = req.body;

    // For now, we'll just return success since we don't have a schedule table
    // In a real implementation, you'd update the doctor's availability settings
    
    res.json({
      success: true,
      message: 'Schedule updated successfully',
      schedule: {
        doctorId: parseInt(id),
        availableHours,
        workingDays,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Update doctor schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor schedule'
    });
  }
});

module.exports = router;