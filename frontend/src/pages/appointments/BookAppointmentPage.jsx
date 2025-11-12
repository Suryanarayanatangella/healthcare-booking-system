/**
 * Book Appointment Page
 * 
 * A simple, intuitive appointment booking interface that even
 * a 7-8 year old can use. Features step-by-step booking process
 * with clear visual feedback and validation.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Stethoscope,
  MapPin,
  DollarSign
} from 'lucide-react';

// Import services and actions
import { fetchDoctors, fetchDoctorAvailability } from '../../store/slices/doctorSlice';
import { bookAppointment } from '../../store/slices/appointmentSlice';

// Validation schema
const appointmentSchema = Yup.object().shape({
  doctorId: Yup.number()
    .required('Please select a doctor'),
  appointmentDate: Yup.date()
    .min(new Date(), 'Please select a future date')
    .required('Please select a date'),
  appointmentTime: Yup.string()
    .required('Please select a time'),
  reasonForVisit: Yup.string()
    .min(10, 'Please provide more details (at least 10 characters)')
    .max(500, 'Please keep it under 500 characters')
    .required('Please tell us why you need this appointment')
});

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { doctors, isLoading: doctorsLoading } = useSelector(state => state.doctors);
  const { availableSlots, isLoading: slotsLoading, availabilityLoading } = useSelector(state => state.doctors);
  const { isLoading: bookingLoading } = useSelector(state => state.appointments);
  
  // Local state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Fetch doctors on component mount
  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  // Fetch availability when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      console.log('Fetching availability for:', { doctorId: selectedDoctor.id, date: selectedDate });
      dispatch(fetchDoctorAvailability({ 
        doctorId: selectedDoctor.id, 
        date: selectedDate 
      }));
    }
  }, [selectedDoctor, selectedDate, dispatch]);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const appointmentData = {
        doctorId: values.doctorId,
        appointmentDate: values.appointmentDate,
        appointmentTime: values.appointmentTime,
        reasonForVisit: values.reasonForVisit
      };

      const result = await dispatch(bookAppointment(appointmentData));
      
      if (result.type === 'appointments/book/fulfilled') {
        // Success - redirect to appointments page
        navigate('/appointments', { 
          state: { 
            message: 'Appointment booked successfully! You will receive a confirmation email shortly.' 
          }
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Step navigation
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Animation variants
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            Book Your Appointment
          </h1>
          <p className="text-text-secondary">
            Simple and easy - just follow the steps below
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {currentStep > step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div className={`
                    w-12 h-1 mx-2
                    ${currentStep > step ? 'bg-primary' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-4 gap-8 text-center text-sm">
            <div className={currentStep >= 1 ? 'text-primary font-medium' : 'text-gray-500'}>
              Choose Doctor
            </div>
            <div className={currentStep >= 2 ? 'text-primary font-medium' : 'text-gray-500'}>
              Select Date
            </div>
            <div className={currentStep >= 3 ? 'text-primary font-medium' : 'text-gray-500'}>
              Pick Time
            </div>
            <div className={currentStep >= 4 ? 'text-primary font-medium' : 'text-gray-500'}>
              Confirm Details
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="card p-8">
          <Formik
            initialValues={{
              doctorId: '',
              appointmentDate: '',
              appointmentTime: '',
              reasonForVisit: ''
            }}
            validationSchema={appointmentSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting, errors, touched }) => (
              <Form>
                <AnimatePresence mode="wait">
                  {/* Step 1: Choose Doctor */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center tracking-tight">
                        <Stethoscope className="h-5 w-5 mr-2 text-primary" />
                        Choose Your Doctor
                      </h2>

                      {doctorsLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="mt-2 text-text-secondary">Loading doctors...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {doctors?.map((doctor) => (
                            <div
                              key={doctor.id}
                              onClick={() => {
                                setFieldValue('doctorId', parseInt(doctor.id));
                                setSelectedDoctor(doctor);
                              }}
                              className={`
                                p-4 border-2 rounded-lg cursor-pointer transition-all relative
                                ${values.doctorId === doctor.id
                                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                  : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                                }
                              `}
                            >
                              {values.doctorId === doctor.id && (
                                <div className="absolute top-2 right-2">
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                </div>
                              )}
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                  <User className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 tracking-wide">
                                    {doctor.name || `${doctor.firstName} ${doctor.lastName}`}
                                  </h3>
                                  <p className="text-sm font-medium text-gray-700">
                                    {doctor.specialization}
                                  </p>
                                  <p className="text-sm text-gray-600 font-medium">
                                    {doctor.experience} years experience
                                  </p>
                                  {doctor.consultationFee && (
                                    <p className="text-sm text-primary font-medium mt-1">
                                      ${doctor.consultationFee}
                                    </p>
                                  )}
                                  {doctor.bio && (
                                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                                      {doctor.bio}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <ErrorMessage name="doctorId" component="div" className="text-red-500 text-sm" />
                    </motion.div>
                  )}

                  {/* Step 2: Select Date */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        Select Date
                      </h2>

                      <div className="max-w-md mx-auto">
                        <Field
                          name="appointmentDate"
                          type="date"
                          min={getMinDate()}
                          max={getMaxDate()}
                          onChange={(e) => {
                            setFieldValue('appointmentDate', e.target.value);
                            setSelectedDate(e.target.value);
                            setFieldValue('appointmentTime', ''); // Reset time when date changes
                            setSelectedTime('');
                          }}
                          className="form-input w-full text-center text-lg py-3"
                        />
                        <ErrorMessage name="appointmentDate" component="div" className="text-red-500 text-sm mt-2" />
                        
                        <p className="text-sm text-text-secondary mt-2 text-center">
                          You can book up to 30 days in advance
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Pick Time */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-primary" />
                        Pick Your Time
                      </h2>

                      {slotsLoading || availabilityLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="mt-2 text-text-secondary">Loading available times...</p>
                        </div>
                      ) : availableSlots && availableSlots.length > 0 ? (
                        <>
                          <p className="text-sm text-gray-600 mb-3">
                            {availableSlots.length} time slots available
                          </p>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setFieldValue('appointmentTime', slot);
                                setSelectedTime(slot);
                              }}
                              className={`
                                p-3 rounded-lg border-2 transition-all text-sm font-medium
                                ${values.appointmentTime === slot
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-gray-200 hover:border-primary/50 text-text-primary'
                                }
                              `}
                            >
                              {slot}
                            </button>
                          ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-text-secondary">
                            No available slots for this date. Please choose another date.
                          </p>
                        </div>
                      )}

                      <ErrorMessage name="appointmentTime" component="div" className="text-red-500 text-sm" />
                    </motion.div>
                  )}

                  {/* Step 4: Confirm Details */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                        Confirm Your Appointment
                      </h2>

                      {/* Appointment Summary */}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium text-text-primary mb-4">Appointment Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Doctor:</span>
                            <span className="font-medium">{selectedDoctor?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Specialization:</span>
                            <span>{selectedDoctor?.specialization}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Date:</span>
                            <span className="font-medium">
                              {new Date(values.appointmentDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">Time:</span>
                            <span className="font-medium">{values.appointmentTime}</span>
                          </div>
                          {selectedDoctor?.consultationFee && (
                            <div className="flex justify-between border-t pt-3">
                              <span className="text-text-secondary">Consultation Fee:</span>
                              <span className="font-medium text-primary">${selectedDoctor.consultationFee}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reason for Visit */}
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Tell us why you need this appointment *
                        </label>
                        <Field
                          as="textarea"
                          name="reasonForVisit"
                          rows={4}
                          placeholder="Please describe your symptoms or reason for visit..."
                          className="form-textarea w-full"
                        />
                        <ErrorMessage name="reasonForVisit" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`
                      flex items-center space-x-2 px-6 py-2 rounded-lg transition-all
                      ${currentStep === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-text-primary hover:bg-gray-100'
                      }
                    `}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && (!values.doctorId || !selectedDoctor)) ||
                        (currentStep === 2 && (!values.appointmentDate || !selectedDate)) ||
                        (currentStep === 3 && (!values.appointmentTime || !selectedTime))
                      }
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || bookingLoading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {(isSubmitting || bookingLoading) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Booking...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Book Appointment</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;