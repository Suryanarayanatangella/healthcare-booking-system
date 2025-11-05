/**
 * Doctor Service
 * 
 * This service handles all doctor-related API calls including
 * doctor listings, profiles, schedules, and availability management.
 */

import { get, put } from './api'

const doctorService = {
  /**
   * Get list of doctors with optional filters
   * @param {Object} params - Query parameters (specialization, search, limit, offset)
   * @returns {Promise} API response
   */
  getDoctors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/doctors?${queryString}` : '/doctors'
    const response = await get(url)
    return response.data
  },

  /**
   * Get doctor by ID
   * @param {string} doctorId - Doctor ID
   * @returns {Promise} API response
   */
  getDoctorById: async (doctorId) => {
    const response = await get(`/doctors/${doctorId}`)
    return response.data
  },

  /**
   * Get list of specializations
   * @returns {Promise} API response
   */
  getSpecializations: async () => {
    const response = await get('/doctors/meta/specializations')
    return response.data
  },

  /**
   * Get current doctor's schedule (for authenticated doctors)
   * @returns {Promise} API response
   */
  getMySchedule: async () => {
    const response = await get('/doctors/me/schedule')
    return response.data
  },

  /**
   * Update doctor's schedule
   * @param {Object} scheduleData - Schedule data
   * @returns {Promise} API response
   */
  updateSchedule: async (scheduleData) => {
    const response = await put('/doctors/me/schedule', scheduleData)
    return response.data
  },

  /**
   * Get doctor's appointments (for authenticated doctors)
   * @param {Object} params - Query parameters (startDate, endDate, status)
   * @returns {Promise} API response
   */
  getMyAppointments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `/doctors/me/appointments?${queryString}` : '/doctors/me/appointments'
    const response = await get(url)
    return response.data
  },

  /**
   * Update doctor's availability status
   * @param {boolean} isAvailable - Availability status
   * @returns {Promise} API response
   */
  updateAvailability: async (isAvailable) => {
    const response = await put('/doctors/me/availability', { isAvailable })
    return response.data
  },

  /**
   * Search doctors by name or specialization
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} API response
   */
  searchDoctors: async (query, filters = {}) => {
    const params = { search: query, ...filters }
    return doctorService.getDoctors(params)
  },

  /**
   * Get doctors by specialization
   * @param {string} specialization - Specialization name
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  getDoctorsBySpecialization: async (specialization, params = {}) => {
    const searchParams = { specialization, ...params }
    return doctorService.getDoctors(searchParams)
  },

  /**
   * Get available doctors (only those accepting appointments)
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAvailableDoctors: async (params = {}) => {
    const searchParams = { available: true, ...params }
    return doctorService.getDoctors(searchParams)
  },
}

export default doctorService