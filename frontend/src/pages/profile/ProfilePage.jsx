/**
 * Profile Page Component
 * 
 * Allows users to view and edit their profile information
 * with role-specific fields for patients and doctors.
 */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  FileText,
  Save,
  Edit,
  Shield
} from 'lucide-react'

import { updateProfile } from '../../store/slices/authSlice'
import { fetchPatientProfile, updatePatientProfile } from '../../store/slices/patientSlice'
import LoadingSpinner, { ButtonLoader } from '../../components/common/LoadingSpinner'

// Validation schemas
const baseProfileSchema = {
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
}

const patientProfileSchema = Yup.object().shape({
  ...baseProfileSchema,
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
  medicalHistory: Yup.string().max(2000, 'Medical history must be less than 2000 characters').optional(),
  allergies: Yup.string().max(1000, 'Allergies must be less than 1000 characters').optional(),
})

const doctorProfileSchema = Yup.object().shape({
  ...baseProfileSchema,
  specialization: Yup.string()
    .min(2, 'Specialization must be at least 2 characters')
    .required('Specialization is required'),
  yearsOfExperience: Yup.number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience seems too high')
    .optional(),
  consultationFee: Yup.number()
    .min(0, 'Consultation fee cannot be negative')
    .optional(),
  bio: Yup.string().max(2000, 'Bio must be less than 2000 characters').optional(),
})

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { user, isLoading: authLoading } = useSelector((state) => state.auth)
  const { profile: patientProfile, isLoading: patientLoading } = useSelector((state) => state.patients)
  
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user?.role === 'patient') {
      dispatch(fetchPatientProfile())
    }
  }, [dispatch, user?.role])

  const getInitialValues = () => {
    if (user?.role === 'patient' && patientProfile) {
      return {
        firstName: patientProfile.firstName || '',
        lastName: patientProfile.lastName || '',
        phone: patientProfile.phone || '',
        dateOfBirth: patientProfile.dateOfBirth || '',
        gender: patientProfile.gender || '',
        address: patientProfile.address || '',
        emergencyContactName: patientProfile.emergencyContactName || '',
        emergencyContactPhone: patientProfile.emergencyContactPhone || '',
        medicalHistory: patientProfile.medicalHistory || '',
        allergies: patientProfile.allergies || '',
      }
    } else if (user?.role === 'doctor') {
      return {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
        yearsOfExperience: user.yearsOfExperience || '',
        consultationFee: user.consultationFee || '',
        bio: user.bio || '',
      }
    }
    
    return {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (user?.role === 'patient') {
        await dispatch(updatePatientProfile(values))
      } else {
        await dispatch(updateProfile(values))
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getValidationSchema = () => {
    return user?.role === 'patient' ? patientProfileSchema : doctorProfileSchema
  }

  if (authLoading || (user?.role === 'patient' && patientLoading)) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light p-4 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              My Profile
            </h1>
            <p className="text-text-secondary">
              Manage your account information and preferences
            </p>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <Formik
                key={isEditing} // Re-initialize form when editing mode changes
                initialValues={getInitialValues()}
                validationSchema={getValidationSchema()}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary mb-4">
                        Basic Information
                      </h2>
                      
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
                              disabled={!isEditing}
                              className={`form-input pl-10 ${
                                !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                              } ${touched.firstName && errors.firstName ? 'form-input-error' : ''}`}
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
                              disabled={!isEditing}
                              className={`form-input pl-10 ${
                                !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                              } ${touched.lastName && errors.lastName ? 'form-input-error' : ''}`}
                            />
                          </div>
                          <ErrorMessage name="lastName" component="div" className="form-error" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label htmlFor="email" className="form-label">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              value={user?.email || ''}
                              disabled
                              className="form-input pl-10 bg-gray-50 cursor-not-allowed"
                            />
                          </div>
                          <p className="text-xs text-text-muted mt-1">
                            Email cannot be changed
                          </p>
                        </div>

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
                              disabled={!isEditing}
                              className={`form-input pl-10 ${
                                !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                              } ${touched.phone && errors.phone ? 'form-input-error' : ''}`}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <ErrorMessage name="phone" component="div" className="form-error" />
                        </div>
                      </div>
                    </div>

                    {/* Role-specific fields */}
                    {user?.role === 'patient' ? (
                      <>
                        {/* Patient Information */}
                        <div className="border-t border-gray-200 pt-6">
                          <h2 className="text-xl font-semibold text-text-primary mb-4">
                            Personal Information
                          </h2>
                          
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
                                  disabled={!isEditing}
                                  className={`form-input pl-10 ${
                                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                  } ${touched.dateOfBirth && errors.dateOfBirth ? 'form-input-error' : ''}`}
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
                                disabled={!isEditing}
                                className={`form-input ${
                                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                } ${touched.gender && errors.gender ? 'form-input-error' : ''}`}
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </Field>
                              <ErrorMessage name="gender" component="div" className="form-error" />
                            </div>
                          </div>

                          <div className="mt-4">
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
                                disabled={!isEditing}
                                className={`form-input pl-10 ${
                                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                } ${touched.address && errors.address ? 'form-input-error' : ''}`}
                                placeholder="123 Main St, City, State 12345"
                              />
                            </div>
                            <ErrorMessage name="address" component="div" className="form-error" />
                          </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="border-t border-gray-200 pt-6">
                          <h2 className="text-xl font-semibold text-text-primary mb-4">
                            Emergency Contact
                          </h2>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="emergencyContactName" className="form-label">
                                Contact Name
                              </label>
                              <Field
                                id="emergencyContactName"
                                name="emergencyContactName"
                                type="text"
                                disabled={!isEditing}
                                className={`form-input ${
                                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                } ${touched.emergencyContactName && errors.emergencyContactName ? 'form-input-error' : ''}`}
                                placeholder="Jane Doe"
                              />
                              <ErrorMessage name="emergencyContactName" component="div" className="form-error" />
                            </div>

                            <div>
                              <label htmlFor="emergencyContactPhone" className="form-label">
                                Contact Phone
                              </label>
                              <Field
                                id="emergencyContactPhone"
                                name="emergencyContactPhone"
                                type="tel"
                                disabled={!isEditing}
                                className={`form-input ${
                                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                } ${touched.emergencyContactPhone && errors.emergencyContactPhone ? 'form-input-error' : ''}`}
                                placeholder="+1 (555) 987-6543"
                              />
                              <ErrorMessage name="emergencyContactPhone" component="div" className="form-error" />
                            </div>
                          </div>
                        </div>

                        {/* Medical Information */}
                        <div className="border-t border-gray-200 pt-6">
                          <h2 className="text-xl font-semibold text-text-primary mb-4">
                            Medical Information
                          </h2>
                          
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="medicalHistory" className="form-label">
                                Medical History
                              </label>
                              <Field
                                as="textarea"
                                id="medicalHistory"
                                name="medicalHistory"
                                rows="4"
                                disabled={!isEditing}
                                className={`form-input resize-none ${
                                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                } ${touched.medicalHistory && errors.medicalHistory ? 'form-input-error' : ''}`}
                                placeholder="Previous surgeries, chronic conditions, medications..."
                              />
                              <ErrorMessage name="medicalHistory" component="div" className="form-error" />
                            </div>

                            <div>
                              <label htmlFor="allergies" className="form-label">
                                Allergies
                              </label>
                              <Field
                                as="textarea"
                                id="allergies"
                                name="allergies"
                                rows="3"
                                disabled={!isEditing}
                                className={`form-input resize-none ${
                                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                } ${touched.allergies && errors.allergies ? 'form-input-error' : ''}`}
                                placeholder="Food allergies, drug allergies, environmental allergies..."
                              />
                              <ErrorMessage name="allergies" component="div" className="form-error" />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Doctor Information */
                      <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-xl font-semibold text-text-primary mb-4">
                          Professional Information
                        </h2>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="specialization" className="form-label">
                              Specialization *
                            </label>
                            <Field
                              id="specialization"
                              name="specialization"
                              type="text"
                              disabled={!isEditing}
                              className={`form-input ${
                                !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                              } ${touched.specialization && errors.specialization ? 'form-input-error' : ''}`}
                              placeholder="e.g., Cardiology, Dermatology, General Practice"
                            />
                            <ErrorMessage name="specialization" component="div" className="form-error" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                disabled={!isEditing}
                                className={`form-input ${
                                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                } ${touched.yearsOfExperience && errors.yearsOfExperience ? 'form-input-error' : ''}`}
                                placeholder="10"
                              />
                              <ErrorMessage name="yearsOfExperience" component="div" className="form-error" />
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
                                disabled={!isEditing}
                                className={`form-input ${
                                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                } ${touched.consultationFee && errors.consultationFee ? 'form-input-error' : ''}`}
                                placeholder="150.00"
                              />
                              <ErrorMessage name="consultationFee" component="div" className="form-error" />
                            </div>
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
                                disabled={!isEditing}
                                className={`form-input pl-10 resize-none ${
                                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                                } ${touched.bio && errors.bio ? 'form-input-error' : ''}`}
                                placeholder="Tell patients about your experience, approach to care, and what makes you unique..."
                              />
                            </div>
                            <ErrorMessage name="bio" component="div" className="form-error" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Save Button */}
                    {isEditing && (
                      <div className="border-t border-gray-200 pt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary flex items-center space-x-2"
                        >
                          {isSubmitting && <ButtonLoader />}
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Account Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Account Type:</span>
                  <span className="text-text-primary font-medium capitalize">
                    {user?.role}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Status:</span>
                  <span className="flex items-center space-x-1 text-green-600">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Active</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Member Since:</span>
                  <span className="text-text-primary font-medium">
                    {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Security
              </h3>
              
              <div className="space-y-3">
                <Link to="/change-password" className="w-full btn-outline text-left block">
                  Change Password
                </Link>
                
                <button className="w-full btn-outline text-left">
                  Two-Factor Authentication
                </button>
                
                <button className="w-full btn-outline text-left">
                  Login History
                </button>
              </div>
            </div>

            {/* Privacy */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Privacy & Data
              </h3>
              
              <div className="space-y-3">
                <button className="w-full btn-outline text-left">
                  Download My Data
                </button>
                
                <button className="w-full btn-outline text-left">
                  Privacy Settings
                </button>
                
                <button className="w-full btn-outline text-red-600 border-red-300 hover:bg-red-50 text-left">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage