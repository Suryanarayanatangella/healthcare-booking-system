/**
 * Navigation Bar Component
 * 
 * The main navigation component that displays the healthcare booking
 * system branding, navigation links, and user authentication controls.
 */

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Menu, 
  X, 
  User, 
  Calendar, 
  Users, 
  LogOut, 
  Settings,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react'

import { logoutUser } from '../../store/slices/authSlice'
import { useTheme } from '../../contexts/ThemeContext'
import Logo from '../common/Logo'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { theme, toggleTheme } = useTheme()
  
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser())
    setIsUserMenuOpen(false)
    navigate('/')
  }

  // Navigation links for authenticated users
  const getNavLinks = () => {
    if (!user) return [];
    
    // Patient navigation
    if (user.role === 'patient') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: Calendar },
        { name: 'Book Appointment', href: '/book-appointment', icon: Calendar },
        { name: 'My Appointments', href: '/appointments', icon: Calendar },
      ];
    }
    
    // Doctor navigation  
    if (user.role === 'doctor') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: Calendar },
        { name: 'My Appointments', href: '/appointments', icon: Calendar },
        { name: 'My Schedule', href: '/schedule', icon: Calendar },
      ];
    }
    
    return [];
  }
  
  const navLinks = getNavLinks()

  // Use the nav links directly (already filtered by role)
  const filteredNavLinks = navLinks

  // Check if current path is active
  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-4 lg:px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Logo 
              size="default" 
              showText={true}
              className="hidden sm:flex"
            />
            {/* Mobile logo - icon only */}
            <Logo 
              size="default" 
              showText={false}
              className="sm:hidden"
            />
          </div>

          {/* Desktop Navigation */}
          {/* <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                <>
                  {filteredNavLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center space-x-1 tracking-wide ${
                          isActivePath(link.href)
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.name}</span>
                      </Link>
                    )
                  })}
                </>
              ) : (
                // No navigation links for unauthenticated users on homepage
                <></>
              )}
            </div>
          </div> */}

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="text-gray-900 font-semibold tracking-wide">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-text-secondary" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-100 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize tracking-wider">
                        {user?.role}
                      </p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-text-primary dark:hover:text-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-text-secondary hover:text-text-primary font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 tracking-wide">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs font-medium text-gray-600 capitalize tracking-wider">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                {filteredNavLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActivePath(link.href)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.name}</span>
                    </Link>
                  )
                })}

                {/* Profile and Logout */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Profile Settings</span>
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  )
}

export default Navbar