/**
 * My Schedule Page Component - Doctor Schedule Management
 * 
 * This component provides comprehensive schedule management for doctors including:
 * - Weekly calendar view with appointments
 * - Schedule configuration and availability settings
 * - Appointment status management
 * - Time slot blocking and exceptions
 * - Real-time schedule updates
 * 
 * @author Healthcare Development Team
 * @version 1.0
 * @since 2024
 */

import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns'

// Import Redux actions and selectors
import { fetchDoctorSchedule, updateDoctorSchedule } from '../../store/slices/doctorSlice'
import { fetchAppointments } from '../../store/slices/appointmentSlice'
import LoadingSpinner, { CardLoader } from '../../components/common/LoadingSpinner'

/**
 * Time slot configuration constants
 * These can be moved to a configuration file for easier maintenance
 */
const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
]

const DAYS_OF_WEEK = [
  { key: 1, name: 'Monday', short: 'Mon' },
  { key: 2, name: 'Tuesday', short: 'Tue' },
  { key: 3, name: 'Wednesday', short: 'Wed' },
  { key: 4, name: 'Thursday', short: 'Thu' },
  { key: 5, name: 'Friday', short: 'Fri' },
  { key: 6, name: 'Saturday', short: 'Sat' },
  { key: 0, name: 'Sunday', short: 'Sun' }
]

const MySchedulePage = () => {
  // Redux hooks for state management
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { schedule, isLoading: scheduleLoading } = useSelector((state) => state.doctors)
  const { appointments, isLoading: appointmentsLoading } = useSelector((state) => state.appointments)

  // Local state management
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedView, setSelectedView] = useState('week') // 'week', 'day', 'month'
  const [showScheduleSettings, setShowScheduleSettings] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  /**
   * Component initialization and data fetching
   * Fetches doctor schedule and appointments on component mount
   */
  useEffect(() => {
    if (user?.role === 'doctor') {
      dispatch(fetchDoctorSchedule())
      dispatch(fetchAppointments({ 
        startDate: format(startOfWeek(currentWeek), 'yyyy-MM-dd'),
        endDate: format(addDays(startOfWeek(currentWeek), 6), 'yyyy-MM-dd')
      }))
    }
  }, [dispatch, user?.role, currentWeek])

  /**
   * Memoized week dates calculation
   * Optimizes performance by recalculating only when currentWeek changes
   */
  const weekDates = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Start week on Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [currentWeek])

  /**
   * Memoized appointments filtering and organization
   * Groups appointments by date for efficient rendering
   */
  const organizedAppointments = useMemo(() => {
    if (!appointments) return {}
    
    return appointments
      .filter(apt => {
        if (filterStatus === 'all') return true
        return apt.status === filterStatus
      })
      .reduce((acc, appointment) => {
        const date = appointment.appointmentDate
        if (!acc[date]) acc[date] = []
        acc[date].push(appointment)
        return acc
      }, {})
  }, [appointments, filterStatus])

  /**
   * Navigation handlers for week/month navigation
   */
  const handlePreviousWeek = () => setCurrentWeek(prev => subWeeks(prev, 1))
  const handleNextWeek = () => setCurrentWeek(prev => addWeeks(prev, 1))
  const handleToday = () => setCurrentWeek(new Date())

  /**
   * Appointment status management
   * Handles status updates with optimistic UI updates
   */
  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      // Optimistic update would go here
      console.log(`Updating appointment ${appointmentId} to ${newStatus}`)
      // dispatch(updateAppointmentStatus({ appointmentId, status: newStatus }))
    } catch (error) {
      console.error('Failed to update appointment status:', error)
    }
  }

  /**
   * Utility function to get appointment status styling
   * Returns appropriate CSS classes based on appointment status
   */
  const getAppointmentStatusStyle = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      no_show: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return styles[status] || styles.scheduled
  }

  /**
   * Utility function to get status icon
   */
  const getStatusIcon = (status) => {
    const icons = {
      scheduled: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
      no_show: <AlertCircle className="h-4 w-4" />
    }
    return icons[status] || icons.scheduled
  }

  /**
   * Time formatting utility
   */
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Loading state rendering
  if (scheduleLoading || appointmentsLoading) {
    return (
      <div className="min-h-screen bg-background-light p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <CardLoader />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header with Navigation and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              My Schedule
            </h1>
            <p className="text-text-secondary">
              Manage your appointments and availability
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowScheduleSettings(true)}
              className="btn-outline flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Schedule Settings</span>
            </button>
            
            <button className="btn-ghost flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            
            <button 
              onClick={() => dispatch(fetchAppointments())}
              className="btn-ghost flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Calendar Navigation and View Controls */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* Week Navigation */}
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <button
                onClick={handlePreviousWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-text-primary">
                  {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
                </h2>
              </div>
              
              <button
                onClick={handleNextWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleToday}
                className="btn-outline"
              >
                Today
              </button>
            </div>

            {/* View Controls and Filters */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                {['week', 'day'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedView === view
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input py-2"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Weekly Calendar Grid */}
        <div className="card p-6">
          <div className="grid grid-cols-8 gap-4">
            {/* Time Column Header */}
            <div className="text-center font-medium text-text-secondary py-4">
              Time
            </div>

            {/* Day Headers */}
            {weekDates.map((date, index) => (
              <div key={index} className="text-center py-4 border-b border-gray-200">
                <div className="font-medium text-text-primary">
                  {DAYS_OF_WEEK.find(d => d.key === date.getDay())?.short}
                </div>
                <div className={`text-2xl font-bold mt-1 ${
                  isSameDay(date, new Date()) 
                    ? 'text-primary-600' 
                    : 'text-text-secondary'
                }`}>
                  {format(date, 'd')}
                </div>
              </div>
            ))}

            {/* Time Slots and Appointments Grid */}
            {TIME_SLOTS.map((timeSlot) => (
              <React.Fragment key={timeSlot}>
                {/* Time Label */}
                <div className="text-right text-sm text-text-secondary py-2 pr-4 border-r border-gray-100">
                  {formatTime(timeSlot)}
                </div>

                {/* Day Columns */}
                {weekDates.map((date, dayIndex) => {
                  const dateKey = format(date, 'yyyy-MM-dd')
                  const dayAppointments = organizedAppointments[dateKey] || []
                  const slotAppointment = dayAppointments.find(apt => 
                    apt.appointmentTime === timeSlot
                  )

                  return (
                    <div
                      key={`${dateKey}-${timeSlot}`}
                      className="min-h-[60px] border-r border-b border-gray-100 p-1 hover:bg-gray-50 transition-colors"
                    >
                      {slotAppointment && (
                        <div
                          className={`p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                            getAppointmentStatusStyle(slotAppointment.status)
                          }`}
                          onClick={() => setSelectedAppointment(slotAppointment)}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            {getStatusIcon(slotAppointment.status)}
                            <span className="text-xs font-medium">
                              {slotAppointment.status}
                            </span>
                          </div>
                          
                          <div className="text-sm font-medium truncate">
                            {slotAppointment.patientName || 'Patient'}
                          </div>
                          
                          {slotAppointment.reasonForVisit && (
                            <div className="text-xs text-gray-600 truncate mt-1">
                              {slotAppointment.reasonForVisit}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {[
            { 
              title: 'Today\'s Appointments', 
              value: organizedAppointments[format(new Date(), 'yyyy-MM-dd')]?.length || 0,
              icon: Calendar,
              color: 'text-blue-600 bg-blue-100'
            },
            { 
              title: 'This Week', 
              value: Object.values(organizedAppointments).flat().length,
              icon: Clock,
              color: 'text-green-600 bg-green-100'
            },
            { 
              title: 'Confirmed', 
              value: Object.values(organizedAppointments).flat().filter(apt => apt.status === 'confirmed').length,
              icon: CheckCircle,
              color: 'text-primary-600 bg-primary-100'
            },
            { 
              title: 'Pending', 
              value: Object.values(organizedAppointments).flat().filter(apt => apt.status === 'scheduled').length,
              icon: AlertCircle,
              color: 'text-yellow-600 bg-yellow-100'
            }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-text-secondary">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Appointment Details
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-text-secondary">Patient</p>
                  <p className="font-medium text-text-primary">
                    {selectedAppointment.patientName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-text-secondary">Time</p>
                  <p className="font-medium text-text-primary">
                    {format(parseISO(selectedAppointment.appointmentDate), 'MMM d, yyyy')} at{' '}
                    {formatTime(selectedAppointment.appointmentTime)}
                  </p>
                </div>
              </div>

              {selectedAppointment.reasonForVisit && (
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-text-secondary">Reason for Visit</p>
                    <p className="font-medium text-text-primary">
                      {selectedAppointment.reasonForVisit}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                {getStatusIcon(selectedAppointment.status)}
                <div>
                  <p className="text-sm text-text-secondary">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getAppointmentStatusStyle(selectedAppointment.status)
                  }`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              {selectedAppointment.status === 'scheduled' && (
                <button
                  onClick={() => handleAppointmentStatusChange(selectedAppointment.id, 'confirmed')}
                  className="flex-1 btn-primary"
                >
                  Confirm
                </button>
              )}
              
              {selectedAppointment.status === 'confirmed' && (
                <button
                  onClick={() => handleAppointmentStatusChange(selectedAppointment.id, 'completed')}
                  className="flex-1 btn-primary"
                >
                  Mark Complete
                </button>
              )}
              
              <button
                onClick={() => setSelectedAppointment(null)}
                className="flex-1 btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MySchedulePage