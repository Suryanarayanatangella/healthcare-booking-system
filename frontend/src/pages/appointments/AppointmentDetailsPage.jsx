/**
 * Appointment Details Page Component
 * 
 * Displays detailed information about a specific appointment
 * with options to cancel, reschedule, or manage the appointment.
 */

import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail,
  MapPin,
  FileText,
  ArrowLeft,
  Edit,
  X
} from 'lucide-react'

import { fetchAppointmentById } from '../../store/slices/appointmentSlice'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const AppointmentDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { user } = useSelector((state) => state.auth)
  const { currentAppointment, isLoading } = useSelector((state) => state.appointments)

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentById(id))
    }
  }, [dispatch, id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100'
      case 'completed':
        return 'text-gray-600 bg-gray-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      case 'scheduled':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading appointment details..." />
      </div>
    )
  }

  if (!currentAppointment) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Appointment Not Found
          </h2>
          <p className="text-text-secondary mb-6">
            The appointment you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            onClick={() => navigate('/appointments')}
            className="btn-primary"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light p-4 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/appointments')}
            className="btn-ghost flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Appointments</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Overview */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-heading font-bold text-text-primary">
                  Appointment Details
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentAppointment.status)}`}>
                  {currentAppointment.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Date</p>
                      <p className="font-medium text-text-primary">
                        {formatDate(currentAppointment.appointment_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Time</p>
                      <p className="font-medium text-text-primary">
                        {formatTime(currentAppointment.appointment_time)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">
                        {user?.role === 'patient' ? 'Doctor' : 'Patient'}
                      </p>
                      <p className="font-medium text-text-primary">
                        {user?.role === 'patient' 
                          ? `Dr. ${currentAppointment.doctor_first_name} ${currentAppointment.doctor_last_name}`
                          : `${currentAppointment.patient_first_name} ${currentAppointment.patient_last_name}`
                        }
                      </p>
                    </div>
                  </div>

                  {currentAppointment.specialization && (
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-text-secondary">Specialization</p>
                        <p className="font-medium text-text-primary">
                          {currentAppointment.specialization}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {currentAppointment.reason_for_visit && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Reason for Visit
                  </h3>
                  <p className="text-text-secondary">
                    {currentAppointment.reason_for_visit}
                  </p>
                </div>
              )}

              {currentAppointment.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                    Notes
                  </h3>
                  <p className="text-text-secondary">
                    {currentAppointment.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            {user?.role === 'doctor' && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Patient Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentAppointment.patient_phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-text-secondary">Phone</p>
                        <p className="font-medium text-text-primary">
                          {currentAppointment.patient_phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentAppointment.patient_email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-text-secondary">Email</p>
                        <p className="font-medium text-text-primary">
                          {currentAppointment.patient_email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {currentAppointment.medical_history && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-text-primary mb-3">
                      Medical History
                    </h3>
                    <p className="text-text-secondary">
                      {currentAppointment.medical_history}
                    </p>
                  </div>
                )}

                {currentAppointment.allergies && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-text-primary mb-3">
                      Allergies
                    </h3>
                    <p className="text-text-secondary">
                      {currentAppointment.allergies}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Actions
              </h3>
              
              <div className="space-y-3">
                {currentAppointment.status === 'scheduled' && (
                  <>
                    <button className="w-full btn-outline flex items-center justify-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>Reschedule</span>
                    </button>
                    
                    <button className="w-full btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center space-x-2">
                      <X className="h-4 w-4" />
                      <span>Cancel Appointment</span>
                    </button>
                  </>
                )}

                {user?.role === 'doctor' && currentAppointment.status === 'scheduled' && (
                  <button className="w-full btn-primary">
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>

            {/* Appointment Timeline */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Timeline
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Appointment Booked
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(currentAppointment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {currentAppointment.updated_at !== currentAppointment.created_at && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Last Updated
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(currentAppointment.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentDetailsPage