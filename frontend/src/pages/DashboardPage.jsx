/**
 * Dashboard Page Component
 * 
 * The main dashboard page that displays different content based on user role.
 * Shows upcoming appointments, quick actions, and relevant statistics.
 */

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react'

import { fetchAppointments } from '../store/slices/appointmentSlice'
import { fetchPatientStats } from '../store/slices/patientSlice'
import LoadingSpinner, { CardLoader } from '../components/common/LoadingSpinner'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { appointments, isLoading: appointmentsLoading } = useSelector((state) => state.appointments)
  const { stats, isLoading: statsLoading } = useSelector((state) => state.patients)

  useEffect(() => {
    // Fetch recent appointments
    dispatch(fetchAppointments({ limit: 5 }))
    
    // Fetch patient stats if user is a patient
    if (user?.role === 'patient') {
      dispatch(fetchPatientStats())
    }
  }, [dispatch, user?.role])

  // Get upcoming appointments
  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDateTime = new Date(`${apt.appointmentDate}T${apt.appointmentTime}`)
    return appointmentDateTime > new Date() && apt.status !== 'cancelled'
  }).slice(0, 3)

  // Quick stats for patients
  const quickStats = [
    {
      name: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Completed',
      value: stats?.completedAppointments || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Upcoming',
      value: stats?.upcomingAppointments || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      name: 'Cancelled',
      value: stats?.cancelledAppointments || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  // Quick actions based on user role
  const quickActions = user?.role === 'patient' 
    ? [
        {
          name: 'Book Appointment',
          description: 'Schedule a new appointment with a doctor',
          href: '/book-appointment',
          icon: Plus,
          color: 'bg-primary-500 hover:bg-primary-600',
        },
        {
          name: 'Find Doctors',
          description: 'Browse available healthcare providers',
          href: '/doctors',
          icon: Users,
          color: 'bg-secondary-500 hover:bg-secondary-600',
        },
        {
          name: 'View All Appointments',
          description: 'See your complete appointment history',
          href: '/appointments',
          icon: Calendar,
          color: 'bg-gray-500 hover:bg-gray-600',
        },
      ]
    : [
        {
          name: 'My Schedule',
          description: 'View and manage your appointment schedule',
          href: '/schedule',
          icon: Calendar,
          color: 'bg-primary-500 hover:bg-primary-600',
        },
        {
          name: 'Patient Management',
          description: 'Manage your patients and their records',
          href: '/patients',
          icon: Users,
          color: 'bg-secondary-500 hover:bg-secondary-600',
        },
        {
          name: 'Analytics',
          description: 'View practice analytics and insights',
          href: '/analytics',
          icon: TrendingUp,
          color: 'bg-gray-500 hover:bg-gray-600',
        },
      ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  return (
    <div className="min-h-screen bg-background-light p-4 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-text-secondary">
            {user?.role === 'patient' 
              ? "Here's an overview of your healthcare appointments and activities."
              : "Here's an overview of your practice and upcoming appointments."
            }
          </p>
        </div>

        {/* Quick Stats - Only for patients */}
        {user?.role === 'patient' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <CardLoader key={index} />
              ))
            ) : (
              quickStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.name} className="card p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-text-secondary">
                          {stat.name}
                        </p>
                        <p className="text-2xl font-bold text-text-primary">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-text-primary">
                  Upcoming Appointments
                </h2>
                <Link
                  to="/appointments"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                >
                  View All
                </Link>
              </div>

              {appointmentsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {user?.role === 'patient' 
                            ? `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`
                            : `${appointment.patient?.firstName} ${appointment.patient?.lastName}`
                          }
                        </p>
                        <p className="text-sm text-text-secondary">
                          {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
                        </p>
                        {appointment.reasonForVisit && (
                          <p className="text-xs text-text-muted truncate">
                            {appointment.reasonForVisit}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`badge-${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-text-secondary">No upcoming appointments</p>
                  {user?.role === 'patient' && (
                    <Link
                      to="/book-appointment"
                      className="btn-primary mt-4 inline-flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Book Appointment</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Next Appointment Highlight - Only for patients */}
            {user?.role === 'patient' && stats?.nextAppointment && (
              <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <Activity className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      Next Appointment
                    </h3>
                    <p className="text-text-primary font-medium">
                      Dr. {stats.nextAppointment.doctor.name}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {formatDate(stats.nextAppointment.appointmentDate)} at{' '}
                      {formatTime(stats.nextAppointment.appointmentTime)}
                    </p>
                    <p className="text-sm text-primary-600 mt-1">
                      {stats.nextAppointment.doctor.specialization}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      to={`/appointments/${stats.nextAppointment.id}`}
                      className="btn-outline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.name}
                      to={action.href}
                      className={`block p-4 rounded-lg text-white transition-colors ${action.color}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <div>
                          <p className="font-medium text-white">{action.name}</p>
                          <p className="text-sm opacity-90 text-white">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Health Tips or Practice Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                {user?.role === 'patient' ? 'Health Tips' : 'Practice Tips'}
              </h3>
              <div className="space-y-4">
                {user?.role === 'patient' ? (
                  <>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💧 Remember to stay hydrated throughout the day
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        🚶‍♀️ Take a 10-minute walk after meals for better digestion
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        😴 Aim for 7-9 hours of quality sleep each night
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        📋 Review patient files 15 minutes before appointments
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        ⏰ Send appointment reminders 24 hours in advance
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        📊 Track patient satisfaction to improve care quality
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage