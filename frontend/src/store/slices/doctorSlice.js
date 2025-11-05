/**
 * Doctor Redux Slice
 * 
 * This slice manages doctor-related state including doctor listings,
 * profiles, schedules, and availability management.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import doctorService from '../../services/doctorService'

// Initial state
const initialState = {
  doctors: [],
  currentDoctor: null,
  specializations: [],
  schedule: [],
  isLoading: false,
  error: null,
  pagination: {
    limit: 20,
    offset: 0,
    total: 0,
    pages: 0,
  },
}

// Async thunks

/**
 * Fetch all doctors with optional filters
 */
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctors(params)
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch doctors'
      return rejectWithValue(message)
    }
  }
)

/**
 * Fetch doctor by ID
 */
export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchById',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorById(doctorId)
      return response.doctor
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch doctor details'
      return rejectWithValue(message)
    }
  }
)

/**
 * Fetch specializations
 */
export const fetchSpecializations = createAsyncThunk(
  'doctors/fetchSpecializations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorService.getSpecializations()
      return response.specializations
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch specializations'
      return rejectWithValue(message)
    }
  }
)

/**
 * Fetch doctor's schedule (for doctors)
 */
export const fetchDoctorSchedule = createAsyncThunk(
  'doctors/fetchSchedule',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorService.getMySchedule()
      return response.schedule
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch schedule'
      return rejectWithValue(message)
    }
  }
)

/**
 * Update doctor's schedule
 */
export const updateDoctorSchedule = createAsyncThunk(
  'doctors/updateSchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await doctorService.updateSchedule(scheduleData)
      return response.schedule
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update schedule'
      return rejectWithValue(message)
    }
  }
)

/**
 * Update doctor availability
 */
export const updateDoctorAvailability = createAsyncThunk(
  'doctors/updateAvailability',
  async (isAvailable, { rejectWithValue }) => {
    try {
      const response = await doctorService.updateAvailability(isAvailable)
      return response.isAvailable
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update availability'
      return rejectWithValue(message)
    }
  }
)

// Doctor slice
const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null
    },
    
    // Clear current doctor
    clearCurrentDoctor: (state) => {
      state.currentDoctor = null
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    
    // Update doctor in list
    updateDoctorInList: (state, action) => {
      const updatedDoctor = action.payload
      const index = state.doctors.findIndex(doc => doc.id === updatedDoctor.id)
      if (index !== -1) {
        state.doctors[index] = { ...state.doctors[index], ...updatedDoctor }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false
        state.doctors = action.payload.doctors
        state.pagination = action.payload.pagination
        state.error = null
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentDoctor = action.payload
        state.error = null
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch specializations
      .addCase(fetchSpecializations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSpecializations.fulfilled, (state, action) => {
        state.isLoading = false
        state.specializations = action.payload
        state.error = null
      })
      .addCase(fetchSpecializations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch doctor schedule
      .addCase(fetchDoctorSchedule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDoctorSchedule.fulfilled, (state, action) => {
        state.isLoading = false
        state.schedule = action.payload
        state.error = null
      })
      .addCase(fetchDoctorSchedule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update doctor schedule
      .addCase(updateDoctorSchedule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateDoctorSchedule.fulfilled, (state, action) => {
        state.isLoading = false
        state.schedule = action.payload
        state.error = null
      })
      .addCase(updateDoctorSchedule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update doctor availability
      .addCase(updateDoctorAvailability.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateDoctorAvailability.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.currentDoctor) {
          state.currentDoctor.isAvailable = action.payload
        }
        state.error = null
      })
      .addCase(updateDoctorAvailability.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

// Export actions
export const {
  clearError,
  clearCurrentDoctor,
  setLoading,
  updateDoctorInList,
} = doctorSlice.actions

// Selectors
export const selectDoctors = (state) => state.doctors.doctors
export const selectCurrentDoctor = (state) => state.doctors.currentDoctor
export const selectSpecializations = (state) => state.doctors.specializations
export const selectDoctorSchedule = (state) => state.doctors.schedule
export const selectDoctorLoading = (state) => state.doctors.isLoading
export const selectDoctorError = (state) => state.doctors.error
export const selectDoctorPagination = (state) => state.doctors.pagination

// Export reducer
export default doctorSlice.reducer