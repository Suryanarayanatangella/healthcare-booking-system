/**
 * Settings Service
 * 
 * Handles all settings-related API calls including
 * profile, notifications, security, privacy, and preferences
 */

import { get, put, post } from './api'

const settingsService = {
  /**
   * Get all user settings
   * @returns {Promise} API response
   */
  getSettings: async () => {
    const response = await get('/settings')
    return response.data
  },

  /**
   * Update profile settings
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} API response
   */
  updateProfile: async (profileData) => {
    const response = await put('/settings/profile', profileData)
    return response.data
  },

  /**
   * Update notification settings
   * @param {Object} notificationData - Notification preferences
   * @returns {Promise} API response
   */
  updateNotifications: async (notificationData) => {
    const response = await put('/settings/notifications', notificationData)
    return response.data
  },

  /**
   * Update security settings (change password)
   * @param {Object} securityData - Current and new password
   * @returns {Promise} API response
   */
  updateSecurity: async (securityData) => {
    const response = await put('/settings/security', securityData)
    return response.data
  },

  /**
   * Update privacy settings
   * @param {Object} privacyData - Privacy preferences
   * @returns {Promise} API response
   */
  updatePrivacy: async (privacyData) => {
    const response = await put('/settings/privacy', privacyData)
    return response.data
  },

  /**
   * Update user preferences
   * @param {Object} preferencesData - User preferences (language, timezone, theme)
   * @returns {Promise} API response
   */
  updatePreferences: async (preferencesData) => {
    const response = await put('/settings/preferences', preferencesData)
    return response.data
  },

  /**
   * Delete user account
   * @param {Object} data - Confirmation data
   * @returns {Promise} API response
   */
  deleteAccount: async (data) => {
    const response = await post('/settings/delete-account', data)
    return response.data
  },

  /**
   * Export user data
   * @returns {Promise} API response
   */
  exportData: async () => {
    const response = await get('/settings/export-data')
    return response.data
  }
}

export default settingsService
