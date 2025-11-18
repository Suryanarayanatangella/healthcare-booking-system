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
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, MapPin, FileText, Stethoscope, Users } from 'lucide-react'
import { registerUser, clearError } from '../../store/slices/authSlice'
import { ButtonLoader } from '../../components/common/LoadingSpinner'
import Logo from '../../components/common/Logo'

// Define option arrays for Yup validation
const roles = ['patient', 'doctor']
const genders = ['male', 'female', 'other']
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

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
    .matches(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number')
    .optional(),
  role: Yup.string()
    .oneOf(roles, 'Please select a valid role')
    .required('Please select your role'),
}

const patientSchema = Yup.object().shape({
  ...baseSchema,
  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .optional(),
  gender: Yup.string()
    .oneOf(genders, 'Please select a valid gender')
    .optional(),
  bloodGroup: Yup.string()
    .oneOf(bloodGroups, 'Please select a valid blood group')
    .optional(),
  height: Yup.number()
    .min(50, 'Height must be at least 50 cm')
    .max(250, 'Height cannot exceed 250 cm')
    .optional(),
  weight: Yup.number()
    .min(2, 'Weight must be at least 2 kg')
    .max(300, 'Weight cannot exceed 300 kg')
    .optional(),
  address: Yup.string().max(500, 'Address must be less than 500 characters').optional(),
  emergencyContactName: Yup.string().max(100, 'Name must be less than 100 characters').optional(),
  emergencyContactPhone: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number')
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
        height: '',
        weight: '',
        bloodGroup: '',
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="default" showText={true} variant="default" linkTo="/" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our healthcare booking platform
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            I am a...
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedRole === 'patient' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className={`h-6 w-6 ${
                  selectedRole === 'patient' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className={`font-medium ${
                    selectedRole === 'patient' ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    Patient
                  </p>
                  <p className="text-sm text-gray-600">
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
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Stethoscope className={`h-6 w-6 ${
                  selectedRole === 'doctor' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div className="text-left">
                  <p className={`font-medium ${
                    selectedRole === 'doctor' ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    Doctor
                  </p>
                  <p className="text-sm text-gray-600">
                    Manage appointments and patients
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Formik
            key={selectedRole} // Re-initialize form when role changes
            initialValues={getInitialValues(selectedRole)}
            validationSchema={getValidationSchema(selectedRole)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, values }) => (
              <Form className="space-y-6">
                {/* Hidden role field */}
                <Field name="role" type="hidden" value={selectedRole} />

                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
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
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John"
                      />
                    </div>
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
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
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Doe"
                      />
                    </div>
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                        className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
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
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
                        className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
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
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Role-specific fields */}
                {selectedRole === 'patient' ? (
                  <>
                    {/* Patient-specific fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
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
                            className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <Field 
                          as="select" 
                          id="gender" 
                          name="gender"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched.gender && errors.gender ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Field>
                        <ErrorMessage name="gender" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                          Height (cm)
                        </label>
                        <Field 
                          id="height" 
                          name="height" 
                          type="number"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched.height && errors.height ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="170"
                        />
                        <ErrorMessage name="height" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                          Blood Group
                        </label>
                        <Field 
                          as="select"
                          id="bloodGroup" 
                          name="bloodGroup"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched.bloodGroup && errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Blood Group</option>
                          {bloodGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="bloodGroup" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        <Field 
                          id="weight" 
                          name="weight" 
                          type="number"
                          step="0.1"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched.weight && errors.weight ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="70"
                        />
                        <ErrorMessage name="weight" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched.address && errors.address ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="123 Main St, City, State 12345"
                        />
                      </div>
                      <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Name
                        </label>
                        <Field 
                          id="emergencyContactName" 
                          name="emergencyContactName" 
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched.emergencyContactName && errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Jane Doe"
                        />
                        <ErrorMessage name="emergencyContactName" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Phone
                        </label>
                        <Field 
                          id="emergencyContactPhone" 
                          name="emergencyContactPhone" 
                          type="tel"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched.emergencyContactPhone && errors.emergencyContactPhone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+1 (555) 987-6543"
                        />
                        <ErrorMessage name="emergencyContactPhone" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Doctor-specific fields */}
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization *
                      </label>
                      <Field 
                        id="specialization" 
                        name="specialization" 
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          touched.specialization && errors.specialization ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Cardiology, Dermatology, General Practice"
                      />
                      <ErrorMessage name="specialization" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          License Number *
                        </label>
                        <Field 
                          id="licenseNumber" 
                          name="licenseNumber" 
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched.licenseNumber && errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="MD123456"
                        />
                        <ErrorMessage name="licenseNumber" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                          Years of Experience
                        </label>
                        <Field 
                          id="yearsOfExperience" 
                          name="yearsOfExperience" 
                          type="number"
                          min="0"
                          max="50"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched.yearsOfExperience && errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="10"
                        />
                        <ErrorMessage name="yearsOfExperience" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
                        Consultation Fee (USD)
                      </label>
                      <Field 
                        id="consultationFee" 
                        name="consultationFee" 
                        type="number"
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          touched.consultationFee && errors.consultationFee ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="150.00"
                      />
                      <ErrorMessage name="consultationFee" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                            touched.bio && errors.bio ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Tell patients about your experience, approach to care, and what makes you unique..."
                        />
                      </div>
                      <ErrorMessage name="bio" component="div" className="text-red-500 text-sm mt-1" />
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
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {(isSubmitting || isLoading) && <ButtonLoader />}
                  Create Account
                </button>

                {/* Terms and Privacy */}
                <p className="text-xs text-gray-600 text-center">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
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