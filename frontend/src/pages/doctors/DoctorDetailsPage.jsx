/**
 * Doctor Details Page Component
 * 
 * Displays detailed information about a specific doctor
 * including profile, schedule, and booking options.
 */

import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  Star, 
  MapPin,
  Phone,
  Mail,
  Award,
  Users,
  CheckCircle
} from 'lucide-react'

import { fetchDoctorById } from '../../store/slices/doctorSlice'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const DoctorDetailsPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  
  const { currentDoctor, isLoading } = useSelector((state) => state.doctors)
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorById(id))
    }
  }, [dispatch, id])

  const formatConsultationFee = (fee) => {
    return fee ? `$${fee}` : 'Contact for pricing'
  }

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNumber]
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading doctor details..." />
      </div>
    )
  }

  if (!currentDoctor) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Doctor Not Found
          </h2>
          <p className="text-text-secondary mb-6">
            The doctor you're looking for doesn't exist or is not available.
          </p>
          <Link to="/doctors" className="btn-primary">
            Back to Doctors
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/doctors"
            className="btn-ghost flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Doctors</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Doctor Profile */}
            <div className="card p-8">
              <div className="flex items-start space-x-6 mb-6">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-12 w-12 text-primary-600" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                    {currentDoctor.name}
                  </h1>
                  
                  <p className="text-xl text-primary-600 font-semibold mb-3">
                    {currentDoctor.specialization}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-text-secondary mb-4">
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{currentDoctor.yearsOfExperience || 0} years experience</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>4.8 (124 reviews)</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <CheckCircle className={`h-4 w-4 ${currentDoctor.isAvailable ? 'text-green-500' : 'text-red-500'}`} />
                      <span>{currentDoctor.isAvailable ? 'Available' : 'Unavailable'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-text-secondary">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatConsultationFee(currentDoctor.consultationFee)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-text-secondary">
                      <MapPin className="h-4 w-4" />
                      <span>Available for appointments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {currentDoctor.bio && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    About Dr. {currentDoctor.lastName}
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    {currentDoctor.bio}
                  </p>
                </div>
              )}

              {/* Contact Information */}
              {isAuthenticated && (currentDoctor.email || currentDoctor.phone) && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentDoctor.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="text-sm text-text-secondary">Email</p>
                          <p className="font-medium text-text-primary">
                            {currentDoctor.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {currentDoctor.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-primary-600" />
                        <div>
                          <p className="text-sm text-text-secondary">Phone</p>
                          <p className="font-medium text-text-primary">
                            {currentDoctor.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Schedule */}
            {currentDoctor.schedule && currentDoctor.schedule.length > 0 && (
              <div className="card p-8">
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Weekly Schedule
                </h2>
                
                <div className="space-y-4">
                  {currentDoctor.schedule.map((schedule) => (
                    <div
                      key={schedule.dayOfWeek}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-primary-600" />
                        <span className="font-medium text-text-primary">
                          {schedule.dayName}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-text-secondary">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </span>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {schedule.slotDuration}min slots
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="card p-8">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Patient Reviews
              </h2>
              
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-text-primary">4.8</div>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-sm text-text-secondary mt-1">124 reviews</div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm text-text-secondary w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-text-secondary w-8">
                          {rating === 5 ? 87 : rating === 4 ? 25 : rating === 3 ? 8 : rating === 2 ? 3 : 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[
                    {
                      name: 'Sarah M.',
                      rating: 5,
                      date: '2 weeks ago',
                      comment: 'Excellent doctor! Very thorough and took time to explain everything. Highly recommend.'
                    },
                    {
                      name: 'John D.',
                      rating: 5,
                      date: '1 month ago',
                      comment: 'Professional and caring. The appointment was on time and the staff was friendly.'
                    },
                    {
                      name: 'Emily R.',
                      rating: 4,
                      date: '2 months ago',
                      comment: 'Good experience overall. Wait time was a bit long but the consultation was worth it.'
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-text-primary">{review.name}</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-text-secondary">{review.date}</span>
                      </div>
                      <p className="text-text-secondary text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="card p-6 dark:bg-gray-900 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-text-primary mb-2">
                  {formatConsultationFee(currentDoctor.consultationFee)}
                </div>
                <p className="text-text-secondary">Consultation Fee</p>
              </div>

              {currentDoctor.isAvailable ? (
                <div className="space-y-4">
                  {isAuthenticated && user?.role === 'patient' ? (
                    <Link
                      to={`/book-appointment?doctor=${currentDoctor.id}`}
                      className="w-full btn-primary text-center block"
                    >
                      Book Appointment
                    </Link>
                  ) : !isAuthenticated ? (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        className="w-full btn-primary text-center block"
                      >
                        Login to Book
                      </Link>
                      <Link
                        to="/register"
                        className="w-full btn-outline text-center block"
                      >
                        Create Account
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center text-text-secondary">
                      Only patients can book appointments
                    </div>
                  )}
                  
                  <div className="text-center">
                    <p className="text-sm text-text-secondary">
                      Next available: Today
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-red-600 font-medium mb-2">Currently Unavailable</p>
                  <p className="text-sm text-text-secondary">
                    This doctor is not accepting new appointments at the moment.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="card p-6 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Quick Information
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Specialization:</span>
                  <span className="text-text-primary font-medium">
                    {currentDoctor.specialization}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-text-secondary">Experience:</span>
                  <span className="text-text-primary font-medium">
                    {currentDoctor.yearsOfExperience || 0} years
                  </span>
                </div>
                
                {currentDoctor.licenseNumber && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">License:</span>
                    <span className="text-text-primary font-medium">
                      {currentDoctor.licenseNumber}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-text-secondary">Rating:</span>
                  <span className="text-text-primary font-medium">4.8/5</span>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="card p-6 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Office Hours
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Monday - Friday:</span>
                  <span className="text-text-primary">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Saturday:</span>
                  <span className="text-text-primary">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Sunday:</span>
                  <span className="text-text-primary">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetailsPage