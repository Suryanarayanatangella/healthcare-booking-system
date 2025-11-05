/**
 * Doctors Page Component
 * 
 * A page that displays a list of available doctors with search,
 * filtering, and pagination functionality.
 */

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign,
  Users,
  ChevronRight
} from 'lucide-react'

import { fetchDoctors, fetchSpecializations } from '../../store/slices/doctorSlice'
import LoadingSpinner, { CardLoader } from '../../components/common/LoadingSpinner'

const DoctorsPage = () => {
  const dispatch = useDispatch()
  const { 
    doctors, 
    specializations, 
    isLoading, 
    pagination 
  } = useSelector((state) => state.doctors)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    // Fetch doctors and specializations on component mount
    dispatch(fetchDoctors())
    dispatch(fetchSpecializations())
  }, [dispatch])

  // Refresh doctors list
  const handleRefresh = () => {
    dispatch(fetchDoctors())
    dispatch(fetchSpecializations())
  }

  // Handle search and filter changes
  useEffect(() => {
    const params = {}
    
    if (searchQuery.trim()) {
      params.search = searchQuery.trim()
    }
    
    if (selectedSpecialization) {
      params.specialization = selectedSpecialization
    }
    
    dispatch(fetchDoctors(params))
  }, [dispatch, searchQuery, selectedSpecialization])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSpecialization('')
    setSortBy('name')
  }

  const formatConsultationFee = (fee) => {
    return fee ? `$${fee}` : 'Contact for pricing'
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Find Healthcare Providers
          </h1>
          <p className="text-text-secondary">
            Browse our network of qualified doctors and specialists
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="form-input pl-10 w-full"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="lg:w-64">
              <select
                value={selectedSpecialization}
                onChange={handleSpecializationChange}
                className="form-input w-full"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec.name} value={spec.name}>
                    {spec.name} ({spec.doctorCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center space-x-2 lg:w-auto"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            <button
              onClick={handleRefresh}
              className="btn-ghost flex items-center space-x-2 lg:w-auto"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-input"
                  >
                    <option value="name">Name</option>
                    <option value="experience">Experience</option>
                    <option value="rating">Rating</option>
                    <option value="fee">Consultation Fee</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Experience</label>
                  <select className="form-input">
                    <option value="">Any Experience</option>
                    <option value="0-5">0-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="btn-ghost w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-text-secondary">
            {isLoading ? 'Loading...' : `${pagination.total || doctors.length} doctors found`}
          </p>
          
          {(searchQuery || selectedSpecialization) && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-text-secondary">Filters:</span>
              {searchQuery && (
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  "{searchQuery}"
                </span>
              )}
              {selectedSpecialization && (
                <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                  {selectedSpecialization}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardLoader key={index} />
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
                {/* Doctor Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-text-primary truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-primary-600 font-medium">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-text-secondary ml-1">
                        4.8 (124 reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-text-secondary">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{doctor.yearsOfExperience || 0} years experience</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-text-secondary">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{formatConsultationFee(doctor.consultationFee)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-text-secondary">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Available for appointments</span>
                  </div>
                </div>

                {/* Bio Preview */}
                {doctor.bio && (
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {doctor.bio}
                  </p>
                )}

                {/* Availability Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    doctor.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  
                  <span className="text-xs text-text-muted">
                    Next available: Today
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="flex-1 btn-outline text-center flex items-center justify-center space-x-1"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  
                  {doctor.isAvailable && (
                    <Link
                      to={`/book-appointment?doctor=${doctor.id}`}
                      className="flex-1 btn-primary text-center"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No doctors found
            </h3>
            <p className="text-text-secondary mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More / Pagination */}
        {doctors.length > 0 && pagination.total > doctors.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                // Implement load more functionality
                const nextOffset = pagination.offset + pagination.limit
                dispatch(fetchDoctors({ 
                  offset: nextOffset,
                  search: searchQuery,
                  specialization: selectedSpecialization 
                }))
              }}
              className="btn-outline"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="small" /> : 'Load More Doctors'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorsPage