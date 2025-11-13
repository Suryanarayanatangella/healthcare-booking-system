/**
 * Appointment Redux Slice
 * 
 * This slice manages appointment-related state including booking,
 * viewing, updating, and cancelling appointments.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import appointmentService from '../../services/appointmentService'
import { toast } from 'react-hot-toast'

// Initial state
const initialState = {
  appointments: [],
  currentAppointment: null,
  availableSlots: [],
  isLoading: false,
  isBooking: false,
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
 * Book a new appointment
 */
export const bookAppointment = createAsyncThunk(
  'appointments/book',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentService.bookAppointment(appointmentData)
      toast.success('Appointment booked successfully!')
      return response.appointment
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to book appointment'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

/**
 * Get user's appointments
 */
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointments(params)
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch appointments'
      return rejectWithValue(message)
    }
  }
)

/**
 * Get specific appointment details
 */
export const fetchAppointmentById = createAsyncThunk(
  'appointments/fetchById',
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentById(appointmentId)
      return response.appointment
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch appointment details'
      return rejectWithValue(message)
    }
  }
)

/**
 * Cancel an appointment
 */
export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.cancelAppointment(id, reason)
      return response.appointment
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel appointment'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

/**
 * Reschedule an appointment
 */
export const rescheduleAppointment = createAsyncThunk(
  'appointments/reschedule',
  async ({ id, appointmentDate, appointmentTime }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.rescheduleAppointment(id, { appointmentDate, appointmentTime })
      return response.appointment
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reschedule appointment'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

/**
 * Update appointment (reschedule, add notes, etc.)
 */
export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async ({ appointmentId, updateData }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointment(appointmentId, updateData)
      toast.success('Appointment updated successfully!')
      return response.appointment
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update appointment'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

/**
 * Get available time slots for a doctor
 */
export const fetchAvailableSlots = createAsyncThunk(
  'appointments/fetchAvailableSlots',
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAvailableSlots(doctorId, date)
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch available slots'
      return rejectWithValue(message)
    }
  }
)

// Appointment slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null
    },
    
    // Clear current appointment
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null
    },
    
    // Clear available slots
    clearAvailableSlots: (state) => {
      state.availableSlots = []
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    
    // Update appointment in list
    updateAppointmentInList: (state, action) => {
      const updatedAppointment = action.payload
      const index = state.appointments.findIndex(apt => apt.id === updatedAppointment.id)
      if (index !== -1) {
        state.appointments[index] = updatedAppointment
      }
    },
    
    // Remove appointment from list
    removeAppointmentFromList: (state, action) => {
      const appointmentId = action.payload
      state.appointments = state.appointments.filter(apt => apt.id !== appointmentId)
    },
  },
  extraReducers: (builder) => {
    builder
      // Book appointment
      .addCase(bookAppointment.pending, (state) => {
        state.isBooking = true
        state.error = null
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isBooking = false
        state.appointments.unshift(action.payload)
        state.error = null
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isBooking = false
        state.error = action.payload
      })
      
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false
        state.appointments = action.payload.appointments
        state.pagination = action.payload.pagination
        state.error = null
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch appointment by ID
      .addCase(fetchAppointmentById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentAppointment = action.payload
        state.error = null
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentAppointment = action.payload
        
        // Update in appointments list if present
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        
        state.error = null
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Cancel appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentAppointment = action.payload
        
        // Update in appointments list if present
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        
        state.error = null
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Reschedule appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentAppointment = action.payload
        
        // Update in appointments list if present
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        
        state.error = null
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch available slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.isLoading = false
        state.availableSlots = action.payload.availableSlots
        state.error = null
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.availableSlots = []
      })
  },
})

// Export actions
export const {
  clearError,
  clearCurrentAppointment,
  clearAvailableSlots,
  setLoading,
  updateAppointmentInList,
  removeAppointmentFromList,
} = appointmentSlice.actions

// Selectors
export const selectAppointments = (state) => state.appointments.appointments
export const selectCurrentAppointment = (state) => state.appointments.currentAppointment
export const selectAvailableSlots = (state) => state.appointments.availableSlots
export const selectAppointmentLoading = (state) => state.appointments.isLoading
export const selectBookingLoading = (state) => state.appointments.isBooking
export const selectAppointmentError = (state) => state.appointments.error
export const selectAppointmentPagination = (state) => state.appointments.pagination

// Export reducer
export default appointmentSlice.reducer