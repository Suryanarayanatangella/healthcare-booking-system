/**
 * Patient Service
 * 
 * This service handles all patient-related API calls including
 * profile management, medical history, and patient statistics.
 */

import { get, put } from './api'

const patientService = {
  /**
   * Get current patient's profile
   * @returns {Promise} API response
   */
  getProfile: async () => {
    const response = await get('/patients/me')
    return response.data
  },

  /**
   * Update patient profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise} API response
   */
  updateProfile: async (profileData) => {
    const response = await put('/patients/me', profileData)
    return response.data
  },

  /**
   * Get patient's appointments
   * @param {Object} params - Query parameters (status, upcoming, limit, offset)
   * @returns {Promise} API response
   */
  getAppointments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/patients/me/appointments?${queryString}` : '/patients/me/appointments'
    const response = await get(url)
    return response.data
  },

  /**
   * Get patient's medical history
   * @returns {Promise} API response
   */
  getMedicalHistory: async () => {
    const response = await get('/patients/me/medical-history')
    return response.data
  },

  /**
   * Get patient's appointment statistics
   * @returns {Promise} API response
   */
  getStats: async () => {
    const response = await get('/patients/me/stats')
    return response.data
  },

  /**
   * Get upcoming appointments
   * @param {number} limit - Number of appointments to fetch
   * @returns {Promise} API response
   */
  getUpcomingAppointments: async (limit = 5) => {
    const params = { upcoming: 'true', limit }
    return patientService.getAppointments(params)
  },

  /**
   * Get past appointments
   * @param {number} limit - Number of appointments to fetch
   * @returns {Promise} API response
   */
  getPastAppointments: async (limit = 10) => {
    const params = { status: 'completed', limit }
    return patientService.getAppointments(params)
  },

  /**
   * Update medical information
   * @param {Object} medicalData - Medical information update
   * @returns {Promise} API response
   */
  updateMedicalInfo: async (medicalData) => {
    const response = await put('/patients/me', medicalData)
    return response.data
  },

  /**
   * Update emergency contact information
   * @param {Object} emergencyContact - Emergency contact data
   * @returns {Promise} API response
   */
  updateEmergencyContact: async (emergencyContact) => {
    const response = await put('/patients/me', emergencyContact)
    return response.data
  },
}

export default patientService