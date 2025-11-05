/**
 * Authentication Service
 * 
 * This service handles all authentication-related API calls
 * including login, registration, and user profile management.
 */

import { get, post, put } from './api'

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} API response
   */
  register: async (userData) => {
    const response = await post('/auth/register', userData)
    return response.data
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Promise} API response
   */
  login: async (credentials) => {
    const response = await post('/auth/login', credentials)
    return response.data
  },

  /**
   * Logout user
   * @returns {Promise} API response
   */
  logout: async () => {
    const response = await post('/auth/logout')
    return response.data
  },

  /**
   * Get current user profile
   * @returns {Promise} API response
   */
  getCurrentUser: async () => {
    const response = await get('/auth/me')
    return response.data
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise} API response
   */
  updateProfile: async (profileData) => {
    const response = await put('/auth/me', profileData)
    return response.data
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  },

  /**
   * Get stored auth token
   * @returns {string|null} Auth token
   */
  getToken: () => {
    return localStorage.getItem('token')
  },

  /**
   * Set auth token in localStorage
   * @param {string} token - JWT token
   */
  setToken: (token) => {
    localStorage.setItem('token', token)
  },

  /**
   * Remove auth token from localStorage
   */
  removeToken: () => {
    localStorage.removeItem('token')
  },
}

export default authService