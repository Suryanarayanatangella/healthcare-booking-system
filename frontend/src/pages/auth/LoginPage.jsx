/**
 * Login Page Component
 * 
 * User authentication page with email/password login form
 * using Formik for form handling and Yup for validation.
 */

import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

import { loginUser, clearError } from '../../store/slices/authSlice'
import LoadingSpinner, { ButtonLoader } from '../../components/common/LoadingSpinner'
import Logo from '../../components/common/Logo'

// Validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  
  const { isLoading, error } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = React.useState(false)

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(loginUser(values))
      if (loginUser.fulfilled.match(result)) {
        navigate(from, { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo 
              size="default" 
              showText={true}
              variant="default"
              linkTo="/"
            />
          </div>
          <h2 className="mt-6 text-3xl font-heading font-bold text-text-primary">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to your healthcare booking account
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`form-input pl-10 ${
                        touched.email && errors.email ? 'form-input-error' : ''
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="form-error" />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`form-input pl-10 pr-10 ${
                        touched.password && errors.password ? 'form-input-error' : ''
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="form-error" />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  {(isSubmitting || isLoading) && <ButtonLoader />}
                  Sign In
                </button>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="card p-6 dark:bg-gray-900 bg-blue-50 border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Demo Accounts</h3>
          <div className="space-y-2 text-xs text-blue-800">
            <div>
              <strong>Patient:</strong> patient@demo.com / password123
            </div>
            <div>
              <strong>Doctor:</strong> doctor@demo.com / password123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage