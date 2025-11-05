/**
 * Patient Redux Slice
 * 
 * This slice manages patient-related state including profile management,
 * medical history, and patient-specific data.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import patientService from '../../services/patientService'
import { toast } from 'react-hot-toast'

// Initial state
const initialState = {
  profile: null,
  medicalHistory: null,
  stats: null,
  isLoading: false,
  error: null,
}

// Async thunks

/**
 * Fetch patient profile
 */
export const fetchPatientProfile = createAsyncThunk(
  'patients/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientService.getProfile()
      return response.patient
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch profile'
      return rejectWithValue(message)
    }
  }
)

/**
 * Update patient profile
 */
export const updatePatientProfile = createAsyncThunk(
  'patients/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await patientService.updateProfile(profileData)
      toast.success('Profile updated successfully')
      return response.patient
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

/**
 * Fetch patient medical history
 */
export const fetchMedicalHistory = createAsyncThunk(
  'patients/fetchMedicalHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientService.getMedicalHistory()
      return response.medicalHistory
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch medical history'
      return rejectWithValue(message)
    }
  }
)

/**
 * Fetch patient statistics
 */
export const fetchPatientStats = createAsyncThunk(
  'patients/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientService.getStats()
      return response.stats
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch statistics'
      return rejectWithValue(message)
    }
  }
)

// Patient slice
const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null
    },
    
    // Clear profile
    clearProfile: (state) => {
      state.profile = null
    },
    
    // Clear medical history
    clearMedicalHistory: (state) => {
      state.medicalHistory = null
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    
    // Update profile field
    updateProfileField: (state, action) => {
      const { field, value } = action.payload
      if (state.profile) {
        state.profile[field] = value
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch patient profile
      .addCase(fetchPatientProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPatientProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
        state.error = null
      })
      .addCase(fetchPatientProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update patient profile
      .addCase(updatePatientProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
        state.error = null
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch medical history
      .addCase(fetchMedicalHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMedicalHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.medicalHistory = action.payload
        state.error = null
      })
      .addCase(fetchMedicalHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch patient stats
      .addCase(fetchPatientStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPatientStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
        state.error = null
      })
      .addCase(fetchPatientStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

// Export actions
export const {
  clearError,
  clearProfile,
  clearMedicalHistory,
  setLoading,
  updateProfileField,
} = patientSlice.actions

// Selectors
export const selectPatientProfile = (state) => state.patients.profile
export const selectMedicalHistory = (state) => state.patients.medicalHistory
export const selectPatientStats = (state) => state.patients.stats
export const selectPatientLoading = (state) => state.patients.isLoading
export const selectPatientError = (state) => state.patients.error

// Export reducer
export default patientSlice.reducer