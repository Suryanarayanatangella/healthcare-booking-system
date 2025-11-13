/**
 * Patient Details Page Component (Doctor View)
 * 
 * Allows doctors to view detailed patient information,
 * medical history, and appointment history.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  AlertCircle,
  Clock,
  MapPin,
  Activity,
  Heart,
  Pill,
  Stethoscope,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PatientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Mock patient data - replace with API call
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatient({
        id: id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1985-06-15',
        gender: 'Male',
        bloodType: 'O+',
        address: '123 Main St, New York, NY 10001',
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1 (555) 987-6543'
        },
        medicalHistory: [
          { condition: 'Hypertension', diagnosedDate: '2020-03-15', status: 'Ongoing' },
          { condition: 'Type 2 Diabetes', diagnosedDate: '2019-08-22', status: 'Managed' }
        ],
        allergies: [
          { allergen: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis' },
          { allergen: 'Peanuts', severity: 'Moderate', reaction: 'Hives' }
        ],
        medications: [
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribedDate: '2020-03-15' },
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribedDate: '2019-08-22' }
        ],
        appointments: [
          {
            id: 1,
            date: '2024-01-15',
            time: '10:00 AM',
            reason: 'Regular checkup',
            status: 'completed',
            notes: 'Blood pressure stable, continue current medication'
          },
          {
            id: 2,
            date: '2024-02-20',
            time: '2:30 PM',
            reason: 'Follow-up consultation',
            status: 'completed',
            notes: 'Glucose levels improved'
          },
          {
            id: 3,
            date: '2024-03-25',
            time: '11:00 AM',
            reason: 'Routine examination',
            status: 'scheduled'
          }
        ],
        vitals: {
          bloodPressure: '120/80',
          heartRate: '72 bpm',
          temperature: '98.6°F',
          weight: '180 lbs',
          height: '5\'10"',
          bmi: '25.8',
          lastUpdated: '2024-02-20'
        }
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'history', name: 'Medical History', icon: FileText },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'vitals', name: 'Vitals', icon: Activity }
  ];

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'severe':
        return 'text-red-600 bg-red-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'mild':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Patient Not Found</h2>
          <p className="text-text-secondary mb-6">
            The patient you're looking for doesn't exist or you don't have permission to view.
          </p>
          <button onClick={() => navigate('/patients')} className="btn-primary">
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/patients')}
            className="btn-ghost flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Patients</span>
          </button>
          
          <button
            onClick={() => toast.success('Feature coming soon!')}
            className="btn-primary"
          >
            Schedule Appointment
          </button>
        </div>

        {/* Patient Header Card */}
        <div className="card p-6 dark:bg-gray-900 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              
              <div>
                <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                  {patient.firstName} {patient.lastName}
                </h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-text-secondary">Age</p>
                    <p className="font-medium text-text-primary">
                      {calculateAge(patient.dateOfBirth)} years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Gender</p>
                    <p className="font-medium text-text-primary">{patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Blood Type</p>
                    <p className="font-medium text-text-primary">{patient.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Patient ID</p>
                    <p className="font-medium text-text-primary">#{patient.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="card p-6 dark:bg-gray-900">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-text-secondary">Email</p>
                        <p className="font-medium text-text-primary">{patient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-text-secondary">Phone</p>
                        <p className="font-medium text-text-primary">{patient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <MapPin className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-text-secondary">Address</p>
                        <p className="font-medium text-text-primary">{patient.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="card p-6 dark:bg-gray-900">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Emergency Contact
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-text-secondary">Name</p>
                      <p className="font-medium text-text-primary">
                        {patient.emergencyContact.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Relationship</p>
                      <p className="font-medium text-text-primary">
                        {patient.emergencyContact.relationship}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Phone</p>
                      <p className="font-medium text-text-primary">
                        {patient.emergencyContact.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Medications */}
                <div className="card p-6 dark:bg-gray-900">
                  <div className="flex items-center space-x-2 mb-4">
                    <Pill className="h-5 w-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-text-primary">
                      Current Medications
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {patient.medications.map((med, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-text-primary">{med.name}</p>
                            <p className="text-sm text-text-secondary">
                              {med.dosage} - {med.frequency}
                            </p>
                          </div>
                          <span className="text-xs text-text-secondary">
                            Since {new Date(med.prescribedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Medical History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                {/* Conditions */}
                <div className="card p-6 dark:bg-gray-900">
                  <div className="flex items-center space-x-2 mb-4">
                    <Stethoscope className="h-5 w-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-text-primary">
                      Medical Conditions
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {patient.medicalHistory.map((condition, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-text-primary">{condition.condition}</p>
                            <p className="text-sm text-text-secondary">
                              Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            condition.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {condition.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="card p-6 dark:bg-gray-900">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h2 className="text-xl font-semibold text-text-primary">Allergies</h2>
                  </div>
                  <div className="space-y-3">
                    {patient.allergies.map((allergy, index) => (
                      <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-text-primary">{allergy.allergen}</p>
                            <p className="text-sm text-text-secondary">
                              Reaction: {allergy.reaction}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(allergy.severity)}`}>
                            {allergy.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="card p-6 dark:bg-gray-900">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Appointment History
                </h2>
                <div className="space-y-4">
                  {patient.appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="font-medium text-text-primary">
                              {new Date(appointment.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-text-secondary">{appointment.time}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-text-secondary">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vitals Tab */}
            {activeTab === 'vitals' && (
              <div className="space-y-6">
                <div className="card p-6 dark:bg-gray-900">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      <h2 className="text-xl font-semibold text-text-primary">
                        Latest Vitals
                      </h2>
                    </div>
                    <span className="text-sm text-text-secondary">
                      Last updated: {new Date(patient.vitals.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">Blood Pressure</p>
                      <p className="text-2xl font-bold text-text-primary">{patient.vitals.bloodPressure}</p>
                      <p className="text-xs text-text-secondary mt-1">mmHg</p>
                    </div>

                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">Heart Rate</p>
                      <p className="text-2xl font-bold text-text-primary">{patient.vitals.heartRate}</p>
                    </div>

                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">Temperature</p>
                      <p className="text-2xl font-bold text-text-primary">{patient.vitals.temperature}</p>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">Weight</p>
                      <p className="text-2xl font-bold text-text-primary">{patient.vitals.weight}</p>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">Height</p>
                      <p className="text-2xl font-bold text-text-primary">{patient.vitals.height}</p>
                    </div>

                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <Activity className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">BMI</p>
                      <p className="text-2xl font-bold text-text-primary">{patient.vitals.bmi}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  Add Note
                </button>
                <button className="w-full btn-outline">
                  Update Vitals
                </button>
                <button className="w-full btn-outline">
                  Prescribe Medication
                </button>
                <Link to={`/appointments?patient=${id}`} className="w-full btn-outline block text-center">
                  View All Appointments
                </Link>
              </div>
            </div>

            {/* Alerts */}
            {patient.allergies.length > 0 && (
              <div className="card p-6 dark:bg-gray-900 bg-red-50 border-red-200">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">Allergy Alert</h3>
                </div>
                <ul className="space-y-2">
                  {patient.allergies.map((allergy, index) => (
                    <li key={index} className="text-sm text-red-800">
                      • {allergy.allergen} ({allergy.severity})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Summary */}
            <div className="card p-6 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Appointments:</span>
                  <span className="font-medium text-text-primary">{patient.appointments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Active Conditions:</span>
                  <span className="font-medium text-text-primary">
                    {patient.medicalHistory.filter(c => c.status === 'Ongoing').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Current Medications:</span>
                  <span className="font-medium text-text-primary">{patient.medications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Known Allergies:</span>
                  <span className="font-medium text-red-600">{patient.allergies.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
