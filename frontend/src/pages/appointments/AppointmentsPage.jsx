/**
 * Appointments Page Component
 * 
 * Displays a list of user's appointments with filtering and management options.
 */

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  Filter, 
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

import { fetchAppointments } from '../../store/slices/appointmentSlice'
import LoadingSpinner, { CardLoader } from '../../components/common/LoadingSpinner'

const AppointmentsPage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { appointments, isLoading } = useSelector((state) => state.appointments)
  
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    dispatch(fetchAppointments())
  }, [dispatch])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'scheduled':
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

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

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
    const matchesSearch = !searchQuery || 
      (user?.role === 'patient' 
        ? appointment.doctorName?.toLowerCase().includes(searchQuery.toLowerCase())
        : appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background-light p-4 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              My Appointments
            </h1>
            <p className="text-text-secondary">
              Manage your healthcare appointments
            </p>
          </div>
          
          {/* {user?.role === 'patient' && (
            <Link
              to="/book-appointment"
              className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
            >
              <Plus className="h-4 w-4" />
              <span>Book New Appointment</span>
            </Link>
          )} */}
        </div>

        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search by ${user?.role === 'patient' ? 'doctor' : 'patient'} name...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input w-full"
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

        {/* Appointments List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardLoader key={index} />
            ))}
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(appointment.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {user?.role === 'patient' 
                          ? appointment.doctorName || 'Dr. Unknown'
                          : appointment.patientName || 'Patient'
                        }
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm text-text-secondary mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                      </div>
                      
                      {appointment.reasonForVisit && (
                        <p className="text-sm text-text-muted mt-2">
                          {appointment.reasonForVisit}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`badge-${appointment.status}`}>
                      {appointment.status}
                    </span>
                    
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="btn-outline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No appointments found
            </h3>
            <p className="text-text-secondary mb-6">
              {statusFilter === 'all' 
                ? "You don't have any appointments yet."
                : `No ${statusFilter} appointments found.`
              }
            </p>
            
            {user?.role === 'patient' && (
              <Link
                to="/book-appointment"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Book Your First Appointment</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentsPage