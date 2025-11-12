/**
 * Sidebar Component
 * 
 * A collapsible sidebar navigation component for authenticated users
 * with role-based navigation links and quick actions.
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  Calendar, 
  Users, 
  User, 
  Clock, 
  BarChart3,
  Settings,
  Plus,
  Home,
  MessageSquare,
  FileText
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'My Appointments', href: '/appointments', icon: Calendar },
      { name: 'Profile', href: '/profile', icon: User },
    ]

    const patientItems = [
      { name: 'Book Appointment', href: '/book-appointment', icon: Plus },
      { name: 'Find Doctors', href: '/doctors', icon: Users },
      { name: 'My Messages', href: '/my-messages', icon: MessageSquare },
      { name: 'Medical Records', href: '/medical-records', icon: FileText },
    ]

    const doctorItems = [
      { name: 'My Schedule', href: '/schedule', icon: Clock },
      { name: 'Patient Management', href: '/patients', icon: Users },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ]

    let items = [...commonItems]

    if (user?.role === 'patient') {
      items.splice(1, 0, ...patientItems)
    } else if (user?.role === 'doctor') {
      items.splice(1, 0, ...doctorItems)
    }

    return items
  }

  const navigationItems = getNavigationItems()

  // Check if current path is active
  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <div className="fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg border-r border-gray-100 pt-16">
      <div className="flex flex-col h-full">
        {/* User Info Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                <b className='text-primary-500'>{user?.firstName}</b> {user?.lastName}
              </p>
              <p className="text-xs text-text-secondary capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = isActivePath(item.href)
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                }`}
              >
                <Icon 
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive 
                      ? 'text-primary-600' 
                      : 'text-text-muted group-hover:text-text-secondary'
                  }`} 
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Quick Actions for Patients */}
        {/* {user?.role === 'patient' && (
          <div className="p-4 border-t border-gray-100">
            <Link
              to="/book-appointment"
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Book Appointment</span>
            </Link>
          </div>
        )} */}

        {/* Settings Link */}
        <div className="p-4 border-t border-gray-100">
          <Link
            to="/settings"
            className="group flex items-center px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <Settings className="mr-3 h-5 w-5 text-text-muted group-hover:text-text-secondary transition-colors" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar