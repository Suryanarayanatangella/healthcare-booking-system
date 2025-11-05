/**
 * Registration Page Component
 * 
 * User registration page with role selection and comprehensive form
 * using Formik for form handling and Yup for validation.
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone,
  Calendar,
  MapPin,
  FileText,
  Stethoscope,
  Users
} from 'lucide-react'

import { registerUser, clearError } from '../../store/slices/authSlice'
import { ButtonLoader } from '../../components/common/LoadingSpinner'
import Logo from '../../components/common/Logo'

// Validation schemas
const baseSchema = {
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional(),
  role: Yup.string()
    .oneOf(['patient', 'doctor'], 'Please select a valid role')
    .required('Please select your role'),
}

const patientSchema = Yup.object().shape({
  ...baseSchema,
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .optional(),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender')
    .optional(),
  address: Yup.string().max(500, 'Address must be less than 500 characters').optional(),
  emergencyContactName: Yup.string().max(100, 'Name must be less than 100 characters').optional(),
  emergencyContactPhone: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional(),
})

const doctorSchema = Yup.object().shape({
  ...baseSchema,
  specialization: Yup.string()
    .min(2, 'Specialization must be at least 2 characters')
    .required('Specialization is required'),
  licenseNumber: Yup.string()
    .min(3, 'License number must be at least 3 characters')
    .required('License number is required'),
  yearsOfExperience: Yup.number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience seems too high')
    .optional(),
  consultationFee: Yup.number()
    .min(0, 'Consultation fee cannot be negative')
    .optional(),
  bio: Yup.string().max(2000, 'Bio must be less than 2000 characters').optional(),
})

const RegisterPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { isLoading, error } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('patient')

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Get validation schema based on selected role
  const getValidationSchema = (role) => {
    return role === 'doctor' ? doctorSchema : patientSchema
  }

  // Get initial values based on selected role
  const getInitialValues = (role) => {
    const baseValues = {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: role,
    }

    if (role === 'patient') {
      return {
        ...baseValues,
        dateOfBirth: '',
        gender: '',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
      }
    } else {
      return {
        ...baseValues,
        specialization: '',
        licenseNumber: '',
        yearsOfExperience: '',
        consultationFee: '',
        bio: '',
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Remove confirmPassword from submission
      const { confirmPassword, ...submitData } = values
      
      const result = await dispatch(registerUser(submitData))
      if (registerUser.fulfilled.match(result)) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo 
              size="default" 
              showText={true}
              variant="default"
              linkTo="/"
            />
          </div>
          <h2 className="mt-6 text-3xl font-heading font-bold text-text-primary">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Join our healthcare booking platform
          </p>
        </div>

        {/* Role Selection */}
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            I am a...
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'patient'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className={`h-6 w-6 ${
                  selectedRole === 'patient' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className={`font-medium ${
                    selectedRole === 'patient' ? 'text-primary-700' : 'text-text-primary'
                  }`}>
                    Patient
                  </p>
                  <p className="text-sm text-text-secondary">
                    Book appointments with doctors
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('doctor')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'doctor'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Stethoscope className={`h-6 w-6 ${
                  selectedRole === 'doctor' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className={`font-medium ${
                    selectedRole === 'doctor' ? 'text-primary-700' : 'text-text-primary'
                  }`}>
                    Doctor
                  </p>
                  <p className="text-sm text-text-secondary">
                    Manage appointments and patients
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <div className="card p-8">
          <Formik
            key={selectedRole} // Re-initialize form when role changes
            initialValues={getInitialValues(selectedRole)}
            validationSchema={getValidationSchema(selectedRole)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Hidden role field */}
                <Field name="role" type="hidden" value={selectedRole} />

                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">
                      First Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="firstName"
                        name="firstName"
                        type="text"
                        className={`form-input pl-10 ${
                          touched.firstName && errors.firstName ? 'form-input-error' : ''
                        }`}
                        placeholder="John"
                      />
                    </div>
                    <ErrorMessage name="firstName" component="div" className="form-error" />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="form-label">
                      Last Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="lastName"
                        name="lastName"
                        type="text"
                        className={`form-input pl-10 ${
                          touched.lastName && errors.lastName ? 'form-input-error' : ''
                        }`}
                        placeholder="Doe"
                      />
                    </div>
                    <ErrorMessage name="lastName" component="div" className="form-error" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address *
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
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="form-error" />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="phone"
                      name="phone"
                      type="tel"
                      className={`form-input pl-10 ${
                        touched.phone && errors.phone ? 'form-input-error' : ''
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <ErrorMessage name="phone" component="div" className="form-error" />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="form-label">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`form-input pl-10 pr-10 ${
                          touched.password && errors.password ? 'form-input-error' : ''
                        }`}
                        placeholder="••••••••"
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

                  <div>
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-input pl-10 pr-10 ${
                          touched.confirmPassword && errors.confirmPassword ? 'form-input-error' : ''
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                  </div>
                </div>

                {/* Role-specific fields */}
                {selectedRole === 'patient' ? (
                  <>
                    {/* Patient-specific fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dateOfBirth" className="form-label">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <Field
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            className={`form-input pl-10 ${
                              touched.dateOfBirth && errors.dateOfBirth ? 'form-input-error' : ''
                            }`}
                          />
                        </div>
                        <ErrorMessage name="dateOfBirth" component="div" className="form-error" />
                      </div>

                      <div>
                        <label htmlFor="gender" className="form-label">
                          Gender
                        </label>
                        <Field
                          as="select"
                          id="gender"
                          name="gender"
                          className={`form-input ${
                            touched.gender && errors.gender ? 'form-input-error' : ''
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Field>
                        <ErrorMessage name="gender" component="div" className="form-error" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="address"
                          name="address"
                          type="text"
                          className={`form-input pl-10 ${
                            touched.address && errors.address ? 'form-input-error' : ''
                          }`}
                          placeholder="123 Main St, City, State 12345"
                        />
                      </div>
                      <ErrorMessage name="address" component="div" className="form-error" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emergencyContactName" className="form-label">
                          Emergency Contact Name
                        </label>
                        <Field
                          id="emergencyContactName"
                          name="emergencyContactName"
                          type="text"
                          className={`form-input ${
                            touched.emergencyContactName && errors.emergencyContactName ? 'form-input-error' : ''
                          }`}
                          placeholder="Jane Doe"
                        />
                        <ErrorMessage name="emergencyContactName" component="div" className="form-error" />
                      </div>

                      <div>
                        <label htmlFor="emergencyContactPhone" className="form-label">
                          Emergency Contact Phone
                        </label>
                        <Field
                          id="emergencyContactPhone"
                          name="emergencyContactPhone"
                          type="tel"
                          className={`form-input ${
                            touched.emergencyContactPhone && errors.emergencyContactPhone ? 'form-input-error' : ''
                          }`}
                          placeholder="+1 (555) 987-6543"
                        />
                        <ErrorMessage name="emergencyContactPhone" component="div" className="form-error" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Doctor-specific fields */}
                    <div>
                      <label htmlFor="specialization" className="form-label">
                        Specialization *
                      </label>
                      <Field
                        id="specialization"
                        name="specialization"
                        type="text"
                        className={`form-input ${
                          touched.specialization && errors.specialization ? 'form-input-error' : ''
                        }`}
                        placeholder="e.g., Cardiology, Dermatology, General Practice"
                      />
                      <ErrorMessage name="specialization" component="div" className="form-error" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="licenseNumber" className="form-label">
                          License Number *
                        </label>
                        <Field
                          id="licenseNumber"
                          name="licenseNumber"
                          type="text"
                          className={`form-input ${
                            touched.licenseNumber && errors.licenseNumber ? 'form-input-error' : ''
                          }`}
                          placeholder="MD123456"
                        />
                        <ErrorMessage name="licenseNumber" component="div" className="form-error" />
                      </div>

                      <div>
                        <label htmlFor="yearsOfExperience" className="form-label">
                          Years of Experience
                        </label>
                        <Field
                          id="yearsOfExperience"
                          name="yearsOfExperience"
                          type="number"
                          min="0"
                          max="50"
                          className={`form-input ${
                            touched.yearsOfExperience && errors.yearsOfExperience ? 'form-input-error' : ''
                          }`}
                          placeholder="10"
                        />
                        <ErrorMessage name="yearsOfExperience" component="div" className="form-error" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="consultationFee" className="form-label">
                        Consultation Fee (USD)
                      </label>
                      <Field
                        id="consultationFee"
                        name="consultationFee"
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form-input ${
                          touched.consultationFee && errors.consultationFee ? 'form-input-error' : ''
                        }`}
                        placeholder="150.00"
                      />
                      <ErrorMessage name="consultationFee" component="div" className="form-error" />
                    </div>

                    <div>
                      <label htmlFor="bio" className="form-label">
                        Professional Bio
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          as="textarea"
                          id="bio"
                          name="bio"
                          rows="4"
                          className={`form-input pl-10 resize-none ${
                            touched.bio && errors.bio ? 'form-input-error' : ''
                          }`}
                          placeholder="Tell patients about your experience, approach to care, and what makes you unique..."
                        />
                      </div>
                      <ErrorMessage name="bio" component="div" className="form-error" />
                    </div>
                  </>
                )}

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
                  Create Account
                </button>

                {/* Terms and Privacy */}
                <p className="text-xs text-text-secondary text-center">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage