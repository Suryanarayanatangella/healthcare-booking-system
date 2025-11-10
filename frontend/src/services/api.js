/**
 * API Configuration and Axios Instance
 * 
 * This module sets up the main Axios instance with interceptors
 * for handling authentication, errors, and request/response logging.
 */

import axios from 'axios'
import { toast } from 'react-hot-toast'

// Get API URL from environment variable or default to relative path
const API_URL = import.meta.env.VITE_API_URL || '/api'

// Log API URL in development and production (for debugging)
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_URL)
} else {
  // Also log in production to help diagnose issues
  console.log('🔗 API Base URL:', API_URL || 'Not set - using relative /api')
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
    
    return response
  },
  (error) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      })
    }
    
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            toast.error('Session expired. Please login again.')
            window.location.href = '/login'
          }
          break
          
        case 403:
          // Forbidden
          toast.error('Access denied. You do not have permission to perform this action.')
          break
          
        case 404:
          // Not found
          if (!data?.message?.includes('not found')) {
            toast.error('The requested resource was not found.')
          }
          break
          
        case 409:
          // Conflict (e.g., duplicate booking)
          // Don't show toast here as it's handled by individual services
          break
          
        case 422:
          // Validation error
          // Don't show toast here as it's handled by individual services
          break
          
        case 429:
          // Rate limit exceeded
          toast.error('Too many requests. Please try again later.')
          break
          
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          toast.error('Server error. Please try again later.')
          break
          
        default:
          // Other errors
          if (data?.message) {
            // Don't show toast for expected errors handled by components
            if (!data.message.includes('not found') && !data.message.includes('already exists')) {
              toast.error(data.message)
            }
          } else {
            toast.error('An unexpected error occurred.')
          }
      }
    } else if (error.request) {
      // Network error - likely backend not connected
      console.error('❌ Network Error - Backend may not be connected:', {
        url: error.config?.url,
        baseURL: API_URL,
        message: 'Check if VITE_API_URL is set correctly in Netlify environment variables'
      })
      toast.error('Unable to connect to server. Please check your connection or contact support.')
    } else {
      // Other error
      console.error('❌ Unexpected Error:', error)
      toast.error('An unexpected error occurred.')
    }
    
    return Promise.reject(error)
  }
)

// Helper functions for common API patterns

/**
 * GET request helper
 */
export const get = (url, config = {}) => {
  return api.get(url, config)
}

/**
 * POST request helper
 */
export const post = (url, data = {}, config = {}) => {
  return api.post(url, data, config)
}

/**
 * PUT request helper
 */
export const put = (url, data = {}, config = {}) => {
  return api.put(url, data, config)
}

/**
 * PATCH request helper
 */
export const patch = (url, data = {}, config = {}) => {
  return api.patch(url, data, config)
}

/**
 * DELETE request helper
 */
export const del = (url, config = {}) => {
  return api.delete(url, config)
}

/**
 * Upload file helper
 */
export const upload = (url, formData, config = {}) => {
  return api.post(url, formData, {
    ...config,
    headers: {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * Download file helper
 */
export const download = (url, config = {}) => {
  return api.get(url, {
    ...config,
    responseType: 'blob',
  })
}

export default api