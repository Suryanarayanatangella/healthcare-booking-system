/**
 * UI Redux Slice
 * 
 * This slice manages global UI state including modals, notifications,
 * loading states, and other user interface elements.
 */

import { createSlice } from '@reduxjs/toolkit'

// Initial state
const initialState = {
  // Modal states
  modals: {
    appointmentDetails: { isOpen: false, data: null },
    confirmCancel: { isOpen: false, data: null },
    reschedule: { isOpen: false, data: null },
    profile: { isOpen: false, data: null },
  },
  
  // Sidebar state
  sidebar: {
    isOpen: false,
    isPinned: true,
  },
  
  // Global loading states
  loading: {
    global: false,
    page: false,
  },
  
  // Notification state
  notifications: [],
  
  // Theme and preferences
  theme: 'light',
  preferences: {
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
  
  // Search and filters
  search: {
    query: '',
    filters: {},
    results: [],
  },
}

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    openModal: (state, action) => {
      const { modalName, data = null } = action.payload
      if (state.modals[modalName]) {
        state.modals[modalName].isOpen = true
        state.modals[modalName].data = data
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload
      if (state.modals[modalName]) {
        state.modals[modalName].isOpen = false
        state.modals[modalName].data = null
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modalName => {
        state.modals[modalName].isOpen = false
        state.modals[modalName].data = null
      })
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebar.isOpen = action.payload
    },
    
    toggleSidebarPin: (state) => {
      state.sidebar.isPinned = !state.sidebar.isPinned
    },
    
    // Loading actions
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload
    },
    
    setPageLoading: (state, action) => {
      state.loading.page = action.payload
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      }
      state.notifications.unshift(notification)
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    removeNotification: (state, action) => {
      const notificationId = action.payload
      state.notifications = state.notifications.filter(
        notification => notification.id !== notificationId
      )
    },
    
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload
      const notification = state.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    },
    
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    
    // Preferences actions
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    
    updateNotificationPreferences: (state, action) => {
      state.preferences.notifications = {
        ...state.preferences.notifications,
        ...action.payload,
      }
    },
    
    // Search actions
    setSearchQuery: (state, action) => {
      state.search.query = action.payload
    },
    
    setSearchFilters: (state, action) => {
      state.search.filters = { ...state.search.filters, ...action.payload }
    },
    
    clearSearchFilters: (state) => {
      state.search.filters = {}
    },
    
    setSearchResults: (state, action) => {
      state.search.results = action.payload
    },
    
    clearSearch: (state) => {
      state.search.query = ''
      state.search.filters = {}
      state.search.results = []
    },
  },
})

// Export actions
export const {
  // Modal actions
  openModal,
  closeModal,
  closeAllModals,
  
  // Sidebar actions
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarPin,
  
  // Loading actions
  setGlobalLoading,
  setPageLoading,
  
  // Notification actions
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  
  // Theme actions
  setTheme,
  toggleTheme,
  
  // Preferences actions
  updatePreferences,
  updateNotificationPreferences,
  
  // Search actions
  setSearchQuery,
  setSearchFilters,
  clearSearchFilters,
  setSearchResults,
  clearSearch,
} = uiSlice.actions

// Selectors
export const selectModals = (state) => state.ui.modals
export const selectModal = (modalName) => (state) => state.ui.modals[modalName]
export const selectSidebar = (state) => state.ui.sidebar
export const selectLoading = (state) => state.ui.loading
export const selectNotifications = (state) => state.ui.notifications
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(n => !n.read)
export const selectTheme = (state) => state.ui.theme
export const selectPreferences = (state) => state.ui.preferences
export const selectSearch = (state) => state.ui.search

// Export reducer
export default uiSlice.reducer