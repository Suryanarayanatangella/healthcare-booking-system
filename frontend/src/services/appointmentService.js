/**
 * Appointment Service
 * 
 * This service handles all appointment-related API calls
 * including booking, viewing, updating, and cancelling appointments.
 */

import { get, post, put, del } from './api'

const appointmentService = {
  /**
   * Book a new appointment
   * @param {Object} appointmentData - Appointment booking data
   * @returns {Promise} API response
   */
  bookAppointment: async (appointmentData) => {
    const response = await post('/appointments', appointmentData)
    return response.data
  },

  /**
   * Get user's appointments
   * @param {Object} params - Query parameters (status, date, limit, offset)
   * @returns {Promise} API response
   */
  getAppointments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/appointments?${queryString}` : '/appointments'
    const response = await get(url)
    return response.data
  },

  /**
   * Get specific appointment by ID
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  getAppointmentById: async (appointmentId) => {
    const response = await get(`/appointments/${appointmentId}`)
    return response.data
  },

  /**
   * Update appointment
   * @param {string} appointmentId - Appointment ID
   * @param {Object} updateData - Update data
   * @returns {Promise} API response
   */
  updateAppointment: async (appointmentId, updateData) => {
    const response = await put(`/appointments/${appointmentId}`, updateData)
    return response.data
  },

  /**
   * Cancel appointment
   * @param {string} appointmentId - Appointment ID
   * @param {string} cancellationReason - Reason for cancellation
   * @returns {Promise} API response
   */
  cancelAppointment: async (appointmentId, cancellationReason) => {
    const response = await put(`/appointments/${appointmentId}`, {
      status: 'cancelled',
      cancellationReason,
    })
    return response.data
  },

  /**
   * Delete appointment (hard delete)
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  deleteAppointment: async (appointmentId) => {
    const response = await del(`/appointments/${appointmentId}`)
    return response.data
  },

  /**
   * Get available time slots for a doctor
   * @param {string} doctorId - Doctor ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} API response
   */
  getAvailableSlots: async (doctorId, date) => {
    const response = await get(`/appointments/doctor/${doctorId}/availability?date=${date}`)
    return response.data
  },

  /**
   * Reschedule appointment
   * @param {string} appointmentId - Appointment ID
   * @param {string} newDate - New appointment date
   * @param {string} newTime - New appointment time
   * @returns {Promise} API response
   */
  rescheduleAppointment: async (appointmentId, newDate, newTime) => {
    const response = await put(`/appointments/${appointmentId}`, {
      appointmentDate: newDate,
      appointmentTime: newTime,
    })
    return response.data
  },

  /**
   * Add notes to appointment (for doctors)
   * @param {string} appointmentId - Appointment ID
   * @param {string} notes - Appointment notes
   * @returns {Promise} API response
   */
  addAppointmentNotes: async (appointmentId, notes) => {
    const response = await put(`/appointments/${appointmentId}`, {
      notes,
    })
    return response.data
  },

  /**
   * Mark appointment as completed (for doctors)
   * @param {string} appointmentId - Appointment ID
   * @param {string} notes - Optional completion notes
   * @returns {Promise} API response
   */
  completeAppointment: async (appointmentId, notes = '') => {
    const response = await put(`/appointments/${appointmentId}`, {
      status: 'completed',
      ...(notes && { notes }),
    })
    return response.data
  },

  /**
   * Mark appointment as no-show (for doctors)
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  markNoShow: async (appointmentId) => {
    const response = await put(`/appointments/${appointmentId}`, {
      status: 'no_show',
    })
    return response.data
  },

  /**
   * Confirm appointment (for doctors)
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  confirmAppointment: async (appointmentId) => {
    const response = await put(`/appointments/${appointmentId}`, {
      status: 'confirmed',
    })
    return response.data
  },
}

export default appointmentService