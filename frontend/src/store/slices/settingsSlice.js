/**
 * Settings Redux Slice
 * 
 * Manages user settings state including profile, notifications,
 * security, privacy, and preferences
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import settingsService from '../../services/settingsService'

// Initial state
const initialState = {
  settings: {
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: {}
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      promotionalEmails: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      theme: 'light'
    }
  },
  loading: false,
  error: null,
  updateSuccess: false
}

// Async thunks
export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const data = await settingsService.getSettings()
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch settings')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'settings/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await settingsService.updateProfile(profileData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile')
    }
  }
)

export const updateNotifications = createAsyncThunk(
  'settings/updateNotifications',
  async (notificationData, { rejectWithValue }) => {
    try {
      const data = await settingsService.updateNotifications(notificationData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update notifications')
    }
  }
)

export const updateSecurity = createAsyncThunk(
  'settings/updateSecurity',
  async (securityData, { rejectWithValue }) => {
    try {
      const data = await settingsService.updateSecurity(securityData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update security settings')
    }
  }
)

export const updatePrivacy = createAsyncThunk(
  'settings/updatePrivacy',
  async (privacyData, { rejectWithValue }) => {
    try {
      const data = await settingsService.updatePrivacy(privacyData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update privacy settings')
    }
  }
)

export const updatePreferences = createAsyncThunk(
  'settings/updatePreferences',
  async (preferencesData, { rejectWithValue }) => {
    try {
      const data = await settingsService.updatePreferences(preferencesData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update preferences')
    }
  }
)

// Settings slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false
    },
    updateLocalSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false
        state.settings = action.payload.settings
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
        state.updateSuccess = false
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.settings.profile = action.payload.profile
        state.updateSuccess = true
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.updateSuccess = false
      })
      
      // Update notifications
      .addCase(updateNotifications.pending, (state) => {
        state.loading = true
        state.error = null
        state.updateSuccess = false
      })
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.settings.notifications = action.payload.notifications
        state.updateSuccess = true
      })
      .addCase(updateNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.updateSuccess = false
      })
      
      // Update security
      .addCase(updateSecurity.pending, (state) => {
        state.loading = true
        state.error = null
        state.updateSuccess = false
      })
      .addCase(updateSecurity.fulfilled, (state) => {
        state.loading = false
        state.updateSuccess = true
      })
      .addCase(updateSecurity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.updateSuccess = false
      })
      
      // Update privacy
      .addCase(updatePrivacy.pending, (state) => {
        state.loading = true
        state.error = null
        state.updateSuccess = false
      })
      .addCase(updatePrivacy.fulfilled, (state, action) => {
        state.loading = false
        state.settings.privacy = action.payload.privacy
        state.updateSuccess = true
      })
      .addCase(updatePrivacy.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.updateSuccess = false
      })
      
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true
        state.error = null
        state.updateSuccess = false
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false
        state.settings.preferences = action.payload.preferences
        state.updateSuccess = true
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.updateSuccess = false
      })
  }
})

export const { clearError, clearUpdateSuccess, updateLocalSettings } = settingsSlice.actions
export default settingsSlice.reducer
