/**
 * Appointment Details Page Component
 * 
 * Displays detailed information about a specific appointment
 * with options to cancel, reschedule, or manage the appointment.
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail,
  FileText,
  ArrowLeft,
  Edit,
  X,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import { fetchAppointmentById, cancelAppointment, rescheduleAppointment } from '../../store/slices/appointmentSlice'
import { fetchDoctorAvailability } from '../../store/slices/doctorSlice'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const AppointmentDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { user } = useSelector((state) => state.auth)
  const { currentAppointment, isLoading } = useSelector((state) => state.appointments)
  const { availableSlots, availabilityLoading } = useSelector((state) => state.doctors)
  
  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentById(id))
    }
  }, [dispatch, id])
  
  // Fetch availability when date is selected for rescheduling
  useEffect(() => {
    if (newDate && currentAppointment?.doctorId) {
      dispatch(fetchDoctorAvailability({ 
        doctorId: currentAppointment.doctorId, 
        date: newDate 
      }))
    }
  }, [newDate, currentAppointment, dispatch])

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
  
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }
  
  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }
    
    setIsSubmitting(true)
    try {
      const result = await dispatch(cancelAppointment({ 
        id, 
        reason: cancelReason 
      }))
      
      if (result.type === 'appointments/cancel/fulfilled') {
        toast.success('Appointment cancelled successfully')
        setShowCancelModal(false)
        // Refresh appointment details
        dispatch(fetchAppointmentById(id))
      } else {
        toast.error('Failed to cancel appointment')
      }
    } catch (error) {
      console.error('Cancel error:', error)
      toast.error('Failed to cancel appointment')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleRescheduleAppointment = async () => {
    if (!newDate || !newTime) {
      toast.error('Please select both date and time')
      return
    }
    
    setIsSubmitting(true)
    try {
      const result = await dispatch(rescheduleAppointment({ 
        id,
        appointmentDate: newDate,
        appointmentTime: newTime
      }))
      
      if (result.type === 'appointments/reschedule/fulfilled') {
        toast.success('Appointment rescheduled successfully')
        setShowRescheduleModal(false)
        setNewDate('')
        setNewTime('')
        // Refresh appointment details
        dispatch(fetchAppointmentById(id))
      } else {
        toast.error('Failed to reschedule appointment')
      }
    } catch (error) {
      console.error('Reschedule error:', error)
      toast.error('Failed to reschedule appointment')
    } finally {
      setIsSubmitting(false)
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
            <div className="card p-6 dark:bg-gray-900">
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
                        {formatDate(currentAppointment.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Time</p>
                      <p className="font-medium text-text-primary">
                        {currentAppointment.appointmentTime}
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
                          ? `${currentAppointment.doctorName}`
                          : `${currentAppointment.patientName}`
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
                          {currentAppointment.doctorSpecialization}
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
                    {currentAppointment.reasonForVisit}
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
              <div className="card p-6 dark:bg-gray-900">
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
            {currentAppointment.status === 'scheduled' && (
              <>
            <div className="card p-6 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                    <button 
                      onClick={() => setShowRescheduleModal(true)}
                      className="w-full btn-outline flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Reschedule</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="w-full btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel Appointment</span>
                    </button>

                {user?.role === 'doctor' && currentAppointment.status === 'scheduled' && (
                  <button className="w-full btn-primary">
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
            </>
            )}

            {/* Appointment Timeline */}
            <div className="card p-6 dark:bg-gray-900">
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
                      {new Date(currentAppointment.createdAt).toLocaleDateString()}
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
        
        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    Cancel Appointment
                  </h3>
                  <p className="text-sm text-text-secondary">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this appointment..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelReason('')
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={handleCancelAppointment}
                  disabled={isSubmitting || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text-primary">
                  Reschedule Appointment
                </h3>
                <button
                  onClick={() => {
                    setShowRescheduleModal(false)
                    setNewDate('')
                    setNewTime('')
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Current Appointment Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-text-secondary mb-2">Current Appointment:</p>
                  <p className="font-medium text-text-primary">
                    {formatDate(currentAppointment.appointmentDate)} at {currentAppointment.appointmentTime}
                  </p>
                </div>
                
                {/* New Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Select New Date *
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => {
                      setNewDate(e.target.value)
                      setNewTime('') // Reset time when date changes
                    }}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                {/* New Time Selection */}
                {newDate && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Select New Time *
                    </label>
                    
                    {availabilityLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-text-secondary">Loading available times...</p>
                      </div>
                    ) : availableSlots && availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setNewTime(slot)}
                            className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                              newTime === slot
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-gray-200 hover:border-primary-300 text-text-primary'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-lg">
                        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-text-secondary">No available slots for this date</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowRescheduleModal(false)
                    setNewDate('')
                    setNewTime('')
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleAppointment}
                  disabled={isSubmitting || !newDate || !newTime}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentDetailsPage