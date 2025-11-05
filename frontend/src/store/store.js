/**
 * Redux Store Configuration
 * 
 * This file configures the Redux store with Redux Toolkit,
 * including all slices and middleware setup.
 */

import { configureStore } from '@reduxjs/toolkit'

// Import slices
import authSlice from './slices/authSlice'
import appointmentSlice from './slices/appointmentSlice'
import doctorSlice from './slices/doctorSlice'
import patientSlice from './slices/patientSlice'
import uiSlice from './slices/uiSlice'

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    appointments: appointmentSlice,
    doctors: doctorSlice,
    patients: patientSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Export types for TypeScript (if needed in the future)
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch