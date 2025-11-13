/**
 * Patient Management Page Component - Comprehensive Patient Overview
 * 
 * This component provides doctors with comprehensive patient management including:
 * - Patient list with search and filtering capabilities
 * - Patient profiles with medical history
 * - Appointment history and upcoming appointments
 * - Medical records and notes management
 * - Communication tracking and patient engagement metrics
 * 
 * @author Healthcare Development Team
 * @version 1.0
 * @since 2024
 */

import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  Phone, 
  Mail,
  Calendar,
  FileText,
  Heart,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  Eye,
  Edit,
  MessageCircle,
  Activity,
  Users,
  ChevronRight,
  Star,
  MapPin,
  X
} from 'lucide-react'

// Import Redux actions and components
import LoadingSpinner, { CardLoader } from '../../components/common/LoadingSpinner'

/**
 * Patient status and priority configurations
 * These constants help maintain consistency across the application
 */
const PATIENT_PRIORITIES = {
  high: { label: 'High Priority', color: 'text-red-600 bg-red-100', icon: AlertTriangle },
  medium: { label: 'Medium Priority', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  low: { label: 'Low Priority', color: 'text-green-600 bg-green-100', icon: User },
}

const APPOINTMENT_STATUS_COLORS = {
  scheduled: 'text-blue-600 bg-blue-100',
  confirmed: 'text-green-600 bg-green-100',
  completed: 'text-gray-600 bg-gray-100',
  cancelled: 'text-red-600 bg-red-100',
  no_show: 'text-yellow-600 bg-yellow-100'
}

const PatientManagementPage = () => {
  // Redux state management
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { appointments, isLoading: appointmentsLoading } = useSelector((state) => state.appointments)

  // Local state for UI management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  // Mock patient data - In production, this would come from Redux store
  const [patients] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0101',
      age: 34,
      gender: 'Female',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-01',
      totalAppointments: 12,
      priority: 'high',
      conditions: ['Hypertension', 'Diabetes Type 2'],
      allergies: ['Penicillin', 'Shellfish'],
      lastNotes: 'Patient responding well to new medication regimen.',
      satisfaction: 4.8,
      address: '123 Main St, City, ST 12345'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1-555-0102',
      age: 28,
      gender: 'Male',
      lastVisit: '2024-01-20',
      nextAppointment: null,
      totalAppointments: 5,
      priority: 'medium',
      conditions: ['Asthma'],
      allergies: [],
      lastNotes: 'Routine checkup completed. All vitals normal.',
      satisfaction: 4.5,
      address: '456 Oak Ave, City, ST 12345'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1-555-0103',
      age: 45,
      gender: 'Female',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-30',
      totalAppointments: 18,
      priority: 'low',
      conditions: [],
      allergies: ['Latex'],
      lastNotes: 'Annual physical examination scheduled.',
      satisfaction: 5.0,
      address: '789 Pine St, City, ST 12345'
    }
  ])

  /**
   * Memoized filtered and sorted patients
   * Optimizes performance by recalculating only when dependencies change
   */
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           patient.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = selectedFilter === 'all' || 
                           (selectedFilter === 'high_priority' && patient.priority === 'high') ||
                           (selectedFilter === 'upcoming' && patient.nextAppointment) ||
                           (selectedFilter === 'chronic' && patient.conditions.length > 0)
      
      return matchesSearch && matchesFilter
    })

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'lastVisit':
          aValue = new Date(a.lastVisit)
          bValue = new Date(b.lastVisit)
          break
        case 'totalAppointments':
          aValue = a.totalAppointments
          bValue = b.totalAppointments
          break
        case 'satisfaction':
          aValue = a.satisfaction
          bValue = b.satisfaction
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [patients, searchQuery, selectedFilter, sortBy, sortOrder])

  /**
   * Patient statistics calculation
   * Provides overview metrics for the dashboard
   */
  const patientStats = useMemo(() => {
    const total = patients.length
    const highPriority = patients.filter(p => p.priority === 'high').length
    const withUpcoming = patients.filter(p => p.nextAppointment).length
    const avgSatisfaction = patients.reduce((sum, p) => sum + p.satisfaction, 0) / total

    return {
      total,
      highPriority,
      withUpcoming,
      avgSatisfaction: avgSatisfaction.toFixed(1)
    }
  }, [patients])

  /**
   * Utility function to format dates consistently
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  /**
   * Handle patient selection for detailed view
   */
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setShowPatientModal(true)
  }

  return (
    <div className="min-h-screen bg-background-light p-4 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              Patient Management
            </h1>
            <p className="text-text-secondary">
              Comprehensive overview of your patients and their care
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="btn-outline flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Patients',
              value: patientStats.total,
              icon: Users,
              color: 'text-blue-600 bg-blue-100',
              trend: '+12% from last month'
            },
            {
              title: 'High Priority',
              value: patientStats.highPriority,
              icon: AlertTriangle,
              color: 'text-red-600 bg-red-100',
              trend: '3 need attention'
            },
            {
              title: 'Upcoming Appointments',
              value: patientStats.withUpcoming,
              icon: Calendar,
              color: 'text-green-600 bg-green-100',
              trend: 'Next 7 days'
            },
            {
              title: 'Avg Satisfaction',
              value: `${patientStats.avgSatisfaction}/5`,
              icon: Star,
              color: 'text-yellow-600 bg-yellow-100',
              trend: '+0.2 from last month'
            }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card p-6 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-text-secondary mb-1">
                    {stat.title}
                  </p>
                  <p className="text-xs text-green-600">
                    {stat.trend}
                  </p>
                </div>
              </div>
            )
          })}
        </div>  
      {/* Search and Filter Controls */}
        <div className="card p-6 dark:bg-gray-900 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="lg:w-48">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="form-input w-full"
              >
                <option value="all">All Patients</option>
                <option value="high_priority">High Priority</option>
                <option value="upcoming">Upcoming Appointments</option>
                <option value="chronic">Chronic Conditions</option>
              </select>
            </div>

            {/* Sort Controls */}
            <div className="lg:w-48">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy(field)
                  setSortOrder(order)
                }}
                className="form-input w-full"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="lastVisit-desc">Recent Visit</option>
                <option value="totalAppointments-desc">Most Appointments</option>
                <option value="satisfaction-desc">Highest Satisfaction</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-text-primary">
              Patients ({filteredAndSortedPatients.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAndSortedPatients.map((patient) => {
              const PriorityIcon = PATIENT_PRIORITIES[patient.priority].icon
              
              return (
                <div
                  key={patient.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Patient Avatar */}
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-600" />
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-text-primary">
                            {patient.name}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            PATIENT_PRIORITIES[patient.priority].color
                          }`}>
                            <PriorityIcon className="h-3 w-3 mr-1" />
                            {PATIENT_PRIORITIES[patient.priority].label}
                          </span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-text-secondary">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{patient.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{patient.age}y, {patient.gender}</span>
                          </div>
                        </div>

                        {/* Medical Conditions */}
                        {patient.conditions.length > 0 && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <div className="flex flex-wrap gap-1">
                              {patient.conditions.map((condition, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800"
                                >
                                  {condition}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Patient Stats */}
                    <div className="text-right space-y-1">
                      <div className="text-sm text-text-secondary">
                        Last Visit: {formatDate(patient.lastVisit)}
                      </div>
                      <div className="text-sm text-text-secondary">
                        Next: {formatDate(patient.nextAppointment)}
                      </div>
                      <div className="text-sm font-medium text-text-primary">
                        {patient.totalAppointments} appointments
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{patient.satisfaction}</span>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                  </div>
                </div>
              )
            })}
          </div>

          {filteredAndSortedPatients.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No patients found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-text-secondary">
                      {selectedPatient.age} years old • {selectedPatient.gender}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-primary-600" />
                        <span>{selectedPatient.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-primary-600" />
                        <span>{selectedPatient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-primary-600" />
                        <span>{selectedPatient.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Medical Conditions */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Medical Conditions
                    </h3>
                    {selectedPatient.conditions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.conditions.map((condition, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-secondary">No known conditions</p>
                    )}
                  </div>

                  {/* Allergies */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Allergies
                    </h3>
                    {selectedPatient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-secondary">No known allergies</p>
                    )}
                  </div>
                </div>

                {/* Appointment History & Notes */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="font-medium">Last Visit</p>
                          <p className="text-sm text-text-secondary">
                            {formatDate(selectedPatient.lastVisit)}
                          </p>
                        </div>
                      </div>
                      
                      {selectedPatient.nextAppointment && (
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Next Appointment</p>
                            <p className="text-sm text-text-secondary">
                              {formatDate(selectedPatient.nextAppointment)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <Activity className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Total Appointments</p>
                          <p className="text-sm text-text-secondary">
                            {selectedPatient.totalAppointments} visits
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Latest Notes */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Latest Notes
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-text-secondary">
                        {selectedPatient.lastNotes}
                      </p>
                    </div>
                  </div>

                  {/* Patient Satisfaction */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Patient Satisfaction
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(selectedPatient.satisfaction)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">
                        {selectedPatient.satisfaction}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button className="btn-primary flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Appointment</span>
                </button>
                <button className="btn-outline flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
                <button className="btn-outline flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
                <button className="btn-ghost flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>View Records</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientManagementPage