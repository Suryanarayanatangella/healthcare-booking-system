/**
 * Protected Route Component
 * 
 * A wrapper component that protects routes from unauthorized access
 * and optionally restricts access based on user roles.
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingSpinner from '../common/LoadingSpinner'

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation()
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth)

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access if roles are specified
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Access Denied
          </h3>
          <p className="text-text-secondary mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-outline"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Render protected content
  return children
}

export default ProtectedRoute