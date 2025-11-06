/**
 * Main App Component
 * 
 * This component handles routing, authentication state management,
 * and provides the main layout structure for the application.
 */

import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// Import components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import LoadingSpinner from './components/common/LoadingSpinner'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Import pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import DashboardPage from './pages/DashboardPage'
import BookAppointmentPage from './pages/appointments/BookAppointmentPage'
import AppointmentsPage from './pages/appointments/AppointmentsPage'
import AppointmentDetailsPage from './pages/appointments/AppointmentDetailsPage'
import DoctorsPage from './pages/doctors/DoctorsPage'
import DoctorDetailsPage from './pages/doctors/DoctorDetailsPage'
import ProfilePage from './pages/profile/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// Import doctor-specific pages
import SchedulePage from './pages/doctor/SchedulePage'
import PatientManagementPage from './pages/doctor/PatientManagementPage'
import AnalyticsPage from './pages/doctor/AnalyticsPage'

// Import Redux actions
import { checkAuthStatus } from './store/slices/authSlice'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth)

  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Navigation */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar - only show when authenticated */}
        {isAuthenticated && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        
        {/* Main content */}
        <main className={`flex-1 ${isAuthenticated ? 'lg:ml-64' : ''}`}>
          <div className="min-h-screen">
            <Routes>
              {/* Public routes */}
              <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />} 
              />
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
              />
              <Route 
                path="/register" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
              />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/doctors/:id" element={<DoctorDetailsPage />} />

              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book-appointment"
                element={
                  <ProtectedRoute roles={['patient']}>
                    <BookAppointmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <AppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/:id"
                element={
                  <ProtectedRoute>
                    <AppointmentDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Doctor-specific routes */}
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute roles={['doctor']}>
                    <SchedulePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute roles={['doctor']}>
                    <PatientManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute roles={['doctor']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App