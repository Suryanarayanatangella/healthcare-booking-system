/**
 * Book Appointment Page Component
 * 
 * Allows patients to book new appointments with doctors
 * including date/time selection and reason for visit.
 */

import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { 
  Calendar, 
  Clock, 
  User, 
  FileText,
  ArrowLeft,
  Check
} from 'lucide-react'

import { fetchDoctors } from '../../store/slices/doctorSlice'
import { bookAppointment, fetchAvailableSlots } from '../../store/slices/appointmentSlice'
import LoadingSpinner, { ButtonLoader } from '../../components/common/LoadingSpinner'

// Validation schema
const bookingSchema = Yup.object().shape({
  doctorId: Yup.string().required('Please select a doctor'),
  appointmentDate: Yup.date()
    .min(new Date(), 'Appointment date cannot be in the past')
    .required('Please select an appointment date'),
  appointmentTime: Yup.string().required('Please select an appointment time'),
  reasonForVisit: Yup.string()
    .max(500, 'Reason must be less than 500 characters')
    .optional(),
})

const BookAppointmentPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  
  const { doctors, isLoading: doctorsLoading } = useSelector((state) => state.doctors)
  const { availableSlots, isBooking } = useSelector((state) => state.appointments)
  
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')

  // Get pre-selected doctor from URL params
  const preSelectedDoctorId = searchParams.get('doctor')

  useEffect(() => {
    dispatch(fetchDoctors())
  }, [dispatch])

  useEffect(() => {
    if (preSelectedDoctorId && doctors.length > 0) {
      const doctor = doctors.find(d => d.id === preSelectedDoctorId)
      if (doctor) {
        setSelectedDoctor(doctor)
      }
    }
  }, [preSelectedDoctorId, doctors])

  // Fetch available slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      dispatch(fetchAvailableSlots({
        doctorId: selectedDoctor.id,
        date: selectedDate
      }))
    }
  }, [dispatch, selectedDoctor, selectedDate])

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(bookAppointment(values))
      if (bookAppointment.fulfilled.match(result)) {
        navigate('/appointments')
      }
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-background-light p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/doctors')}
            className="btn-ghost flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Doctors</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Book an Appointment
          </h1>
          <p className="text-text-secondary">
            Schedule your appointment with a healthcare professional
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <Formik
                initialValues={{
                  doctorId: preSelectedDoctorId || '',
                  appointmentDate: getTomorrowDate(),
                  appointmentTime: '',
                  reasonForVisit: '',
                }}
                validationSchema={bookingSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, touched, errors, isSubmitting }) => (
                  <Form className="space-y-6">
                    {/* Doctor Selection */}
                    <div>
                      <label htmlFor="doctorId" className="form-label">
                        Select Doctor *
                      </label>
                      <Field
                        as="select"
                        id="doctorId"
                        name="doctorId"
                        className={`form-input ${
                          touched.doctorId && errors.doctorId ? 'form-input-error' : ''
                        }`}
                        onChange={(e) => {
                          const doctorId = e.target.value
                          setFieldValue('doctorId', doctorId)
                          const doctor = doctors.find(d => d.id === doctorId)
                          setSelectedDoctor(doctor)
                          setFieldValue('appointmentTime', '') // Reset time when doctor changes
                        }}
                      >
                        <option value="">Choose a doctor</option>
                        {doctorsLoading ? (
                          <option disabled>Loading doctors...</option>
                        ) : (
                          doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </option>
                          ))
                        )}
                      </Field>
                      <ErrorMessage name="doctorId" component="div" className="form-error" />
                    </div>

                    {/* Selected Doctor Info */}
                    {selectedDoctor && (
                      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-text-primary">
                              {selectedDoctor.name}
                            </h3>
                            <p className="text-primary-600 font-medium">
                              {selectedDoctor.specialization}
                            </p>
                            <p className="text-sm text-text-secondary mt-1">
                              {selectedDoctor.yearsOfExperience} years experience
                            </p>
                            {selectedDoctor.consultationFee && (
                              <p className="text-sm text-text-secondary">
                                Consultation Fee: ${selectedDoctor.consultationFee}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Date Selection */}
                    <div>
                      <label htmlFor="appointmentDate" className="form-label">
                        Appointment Date *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="appointmentDate"
                          name="appointmentDate"
                          type="date"
                          min={getTomorrowDate()}
                          className={`form-input pl-10 ${
                            touched.appointmentDate && errors.appointmentDate ? 'form-input-error' : ''
                          }`}
                          onChange={(e) => {
                            setFieldValue('appointmentDate', e.target.value)
                            setSelectedDate(e.target.value)
                            setFieldValue('appointmentTime', '') // Reset time when date changes
                          }}
                        />
                      </div>
                      <ErrorMessage name="appointmentDate" component="div" className="form-error" />
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label htmlFor="appointmentTime" className="form-label">
                        Appointment Time *
                      </label>
                      
                      {selectedDoctor && selectedDate ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                          {availableSlots.length > 0 ? (
                            availableSlots.map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => setFieldValue('appointmentTime', slot.time)}
                                className={`p-3 text-sm rounded-lg border transition-colors ${
                                  values.appointmentTime === slot.time
                                    ? 'bg-primary-500 text-white border-primary-500'
                                    : 'bg-white text-text-primary border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                                }`}
                              >
                                <div className="flex items-center justify-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{slot.time}</span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="col-span-full text-center py-8 text-text-secondary">
                              No available slots for this date
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-text-secondary">
                          Please select a doctor and date to see available times
                        </div>
                      )}
                      
                      <ErrorMessage name="appointmentTime" component="div" className="form-error" />
                    </div>

                    {/* Reason for Visit */}
                    <div>
                      <label htmlFor="reasonForVisit" className="form-label">
                        Reason for Visit
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          as="textarea"
                          id="reasonForVisit"
                          name="reasonForVisit"
                          rows="4"
                          className={`form-input pl-10 resize-none ${
                            touched.reasonForVisit && errors.reasonForVisit ? 'form-input-error' : ''
                          }`}
                          placeholder="Please describe your symptoms or reason for the visit..."
                        />
                      </div>
                      <ErrorMessage name="reasonForVisit" component="div" className="form-error" />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting || isBooking || !values.doctorId || !values.appointmentDate || !values.appointmentTime}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                      >
                        {(isSubmitting || isBooking) && <ButtonLoader />}
                        <Check className="h-4 w-4" />
                        <span>Book Appointment</span>
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Booking Tips
              </h3>
              
              <div className="space-y-3 text-sm text-text-secondary">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Book at least 24 hours in advance for better availability</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Arrive 15 minutes early for your appointment</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Bring your insurance card and ID</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>You'll receive email confirmation after booking</p>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Need Help?
              </h3>
              
              <p className="text-sm text-text-secondary mb-4">
                Having trouble booking your appointment? Our support team is here to help.
              </p>
              
              <div className="space-y-2 text-sm">
                <p className="text-text-primary">
                  <strong>Phone:</strong> (555) 123-4567
                </p>
                <p className="text-text-primary">
                  <strong>Email:</strong> support@healthcare.com
                </p>
                <p className="text-text-primary">
                  <strong>Hours:</strong> Mon-Fri 8AM-6PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookAppointmentPage