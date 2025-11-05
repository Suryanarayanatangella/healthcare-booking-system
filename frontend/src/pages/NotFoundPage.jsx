/**
 * 404 Not Found Page Component
 * 
 * A user-friendly 404 error page with navigation options
 * and helpful links for users who encounter missing pages.
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Home, ArrowLeft, Search, Calendar } from 'lucide-react'

const NotFoundPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(isAuthenticated ? '/dashboard' : '/')
    }
  }

  const quickLinks = isAuthenticated
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'My Appointments', href: '/appointments', icon: Calendar },
        { name: 'Find Doctors', href: '/doctors', icon: Search },
      ]
    : [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Find Doctors', href: '/doctors', icon: Search },
        { name: 'Sign In', href: '/login', icon: ArrowLeft },
      ]

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="mx-auto h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center mb-6">
            <svg
              className="h-16 w-16 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className="text-6xl font-heading font-bold text-text-primary mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-heading font-semibold text-text-primary mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="btn-outline flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>{isAuthenticated ? 'Dashboard' : 'Home'}</span>
            </Link>
            
            <Link
              to="/doctors"
              className="btn-ghost flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Find Doctors</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            Quick Links
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-sm"
                >
                  <Icon className="h-4 w-4 text-primary-600" />
                  <span className="text-text-primary">{link.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-secondary">
            Still having trouble? {' '}
            <a
              href="mailto:support@healthcarebooking.com"
              className="text-primary-600 hover:text-primary-500 transition-colors"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage