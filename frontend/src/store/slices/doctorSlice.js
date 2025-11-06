/**
 * Doctor Redux Slice
 * 
 * Manages doctor-related state including doctor lists,
 * availability, and appointment scheduling data.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async thunks

/**
 * Fetch all available doctors
 */
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch doctors'
      );
    }
  }
);

/**
 * Fetch doctor availability for a specific date
 */
export const fetchDoctorAvailability = createAsyncThunk(
  'doctors/fetchAvailability',
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/availability`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch availability'
      );
    }
  }
);

/**
 * Get doctor details by ID
 */
export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchById',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch doctor details'
      );
    }
  }
);

/**
 * Fetch all specializations
 */
export const fetchSpecializations = createAsyncThunk(
  'doctors/fetchSpecializations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/doctors/specializations');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch specializations'
      );
    }
  }
);

/**
 * Fetch doctor's schedule
 */
export const fetchDoctorSchedule = createAsyncThunk(
  'doctors/fetchSchedule',
  async ({ doctorId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/schedule`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch doctor schedule'
      );
    }
  }
);

/**
 * Update doctor's schedule
 */
export const updateDoctorSchedule = createAsyncThunk(
  'doctors/updateSchedule',
  async ({ doctorId, scheduleData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/doctors/${doctorId}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update doctor schedule'
      );
    }
  }
);

// Initial state
const initialState = {
  // Doctor list
  doctors: [],
  selectedDoctor: null,
  
  // Availability
  availableSlots: [],
  bookedSlots: [],
  selectedDate: null,
  
  // Schedule
  schedule: [],
  scheduleLoading: false,
  scheduleError: null,
  
  // Loading states
  isLoading: false,
  availabilityLoading: false,
  
  // Error handling
  error: null,
  availabilityError: null,
  
  // Filters and search
  searchTerm: '',
  selectedSpecialization: '',
  specializations: []
};

// Doctor slice
const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.availabilityError = null;
    },
    
    // Set selected doctor
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    
    // Set search filters
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    
    setSelectedSpecialization: (state, action) => {
      state.selectedSpecialization = action.payload;
    },
    
    // Clear availability data
    clearAvailability: (state) => {
      state.availableSlots = [];
      state.bookedSlots = [];
      state.selectedDate = null;
      state.availabilityError = null;
    },
    
    // Clear schedule data
    clearSchedule: (state) => {
      state.schedule = [];
      state.scheduleError = null;
    },
    
    // Reset doctor state
    resetDoctorState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // Fetch doctors
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload.doctors || [];
        
        // Extract unique specializations for filtering
        const specializations = [...new Set(
          state.doctors.map(doctor => doctor.specialization)
        )].filter(Boolean);
        state.specializations = specializations;
        
        state.error = null;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.doctors = [];
      });

    // Fetch doctor availability
    builder
      .addCase(fetchDoctorAvailability.pending, (state) => {
        state.availabilityLoading = true;
        state.availabilityError = null;
      })
      .addCase(fetchDoctorAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.availableSlots = action.payload.availableSlots || [];
        state.bookedSlots = action.payload.bookedSlots || [];
        state.selectedDate = action.payload.date;
        state.availabilityError = null;
      })
      .addCase(fetchDoctorAvailability.rejected, (state, action) => {
        state.availabilityLoading = false;
        state.availabilityError = action.payload;
        state.availableSlots = [];
        state.bookedSlots = [];
      });

    // Fetch doctor by ID
    builder
      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDoctor = action.payload.doctor;
        state.error = null;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.selectedDoctor = null;
      });

    // Fetch specializations
    builder
      .addCase(fetchSpecializations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpecializations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.specializations = action.payload.specializations || [];
        state.error = null;
      })
      .addCase(fetchSpecializations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch doctor schedule
    builder
      .addCase(fetchDoctorSchedule.pending, (state) => {
        state.scheduleLoading = true;
        state.scheduleError = null;
      })
      .addCase(fetchDoctorSchedule.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.schedule = action.payload.schedule || [];
        state.scheduleError = null;
      })
      .addCase(fetchDoctorSchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleError = action.payload;
      });

    // Update doctor schedule
    builder
      .addCase(updateDoctorSchedule.pending, (state) => {
        state.scheduleLoading = true;
        state.scheduleError = null;
      })
      .addCase(updateDoctorSchedule.fulfilled, (state, action) => {
        state.scheduleLoading = false;
        state.schedule = action.payload.schedule || state.schedule;
        state.scheduleError = null;
      })
      .addCase(updateDoctorSchedule.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.scheduleError = action.payload;
      });
  }
});

// Export actions
export const {
  clearError,
  setSelectedDoctor,
  setSearchTerm,
  setSelectedSpecialization,
  clearAvailability,
  clearSchedule,
  resetDoctorState
} = doctorSlice.actions;

// Selectors
export const selectDoctors = (state) => state.doctors.doctors;
export const selectFilteredDoctors = (state) => {
  const { doctors, searchTerm, selectedSpecialization } = state.doctors;
  
  return doctors.filter(doctor => {
    const matchesSearch = !searchTerm || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = !selectedSpecialization || 
      doctor.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });
};

export const selectAvailableSlots = (state) => state.doctors.availableSlots;
export const selectSelectedDoctor = (state) => state.doctors.selectedDoctor;
export const selectDoctorLoading = (state) => state.doctors.isLoading;
export const selectAvailabilityLoading = (state) => state.doctors.availabilityLoading;

// Export reducer
export default doctorSlice.reducer;