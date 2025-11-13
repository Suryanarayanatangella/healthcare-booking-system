/**
 * Patient Medical Records Page
 * 
 * Allows patients to view their own medical history, vitals, and records
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  FileText,
  Activity,
  Heart,
  Pill,
  AlertCircle,
  Calendar,
  Download,
  TrendingUp,
  Stethoscope,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const MedicalRecordsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock patient data
  const patientData = {
    personalInfo: {
      dateOfBirth: '1985-06-15',
      gender: 'Male',
      bloodType: 'O+',
      height: '5\'10"',
      weight: '180 lbs'
    },
    medicalHistory: [
      { condition: 'Hypertension', diagnosedDate: '2020-03-15', status: 'Ongoing', doctor: 'Dr. Sarah Johnson' },
      { condition: 'Type 2 Diabetes', diagnosedDate: '2019-08-22', status: 'Managed', doctor: 'Dr. Michael Chen' }
    ],
    allergies: [
      { allergen: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis' },
      { allergen: 'Peanuts', severity: 'Moderate', reaction: 'Hives' }
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribedDate: '2020-03-15', prescribedBy: 'Dr. Sarah Johnson' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribedDate: '2019-08-22', prescribedBy: 'Dr. Michael Chen' }
    ],
    vitals: [
      { date: '2024-01-15', bloodPressure: '120/80', heartRate: '72', temperature: '98.6', weight: '180' },
      { date: '2023-12-15', bloodPressure: '125/82', heartRate: '75', temperature: '98.4', weight: '182' },
      { date: '2023-11-15', bloodPressure: '122/80', heartRate: '73', temperature: '98.5', weight: '181' }
    ],
    labResults: [
      { test: 'Complete Blood Count', date: '2024-01-10', status: 'Normal', doctor: 'Dr. Sarah Johnson' },
      { test: 'Lipid Panel', date: '2023-12-05', status: 'Normal', doctor: 'Dr. Sarah Johnson' },
      { test: 'HbA1c', date: '2023-11-20', status: 'Elevated', doctor: 'Dr. Michael Chen' }
    ]
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'history', name: 'Medical History', icon: FileText },
    { id: 'vitals', name: 'Vitals', icon: Activity },
    { id: 'labs', name: 'Lab Results', icon: Stethoscope }
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
      case 'normal':
        return 'text-green-600 bg-green-100';
      case 'elevated':
      case 'abnormal':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
            My Medical Records
          </h1>
          <p className="text-text-secondary">
            View and manage your health information
          </p>
        </div>

        {/* Personal Info Card */}
        <div className="card p-6 dark:bg-gray-900 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              
              <div>
                <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
                  {user?.firstName} {user?.lastName}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-text-secondary">Age</p>
                    <p className="font-medium text-text-primary">
                      {calculateAge(patientData.personalInfo.dateOfBirth)} years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Gender</p>
                    <p className="font-medium text-text-primary">{patientData.personalInfo.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Blood Type</p>
                    <p className="font-medium text-text-primary">{patientData.personalInfo.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Height</p>
                    <p className="font-medium text-text-primary">{patientData.personalInfo.height}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Weight</p>
                    <p className="font-medium text-text-primary">{patientData.personalInfo.weight}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => toast.success('Download feature coming soon!')}
              className="btn-outline flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Records</span>
            </button>
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
                {/* Current Medications */}
                <div className="card p-6 dark:bg-gray-900">
                  <div className="flex items-center space-x-2 mb-4">
                    <Pill className="h-5 w-5 text-primary-600" />
                    <h2 className="text-xl font-semibold text-text-primary">
                      Current Medications
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {patientData.medications.map((med, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-text-primary">{med.name}</p>
                            <p className="text-sm text-text-secondary">
                              {med.dosage} - {med.frequency}
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              Prescribed by {med.prescribedBy}
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

                {/* Recent Vitals */}
                <div className="card p-6 dark:bg-gray-900">
                  <div className="flex items-center space-x-2 mb-4">
                    <Heart className="h-5 w-5 text-red-600" />
                    <h2 className="text-xl font-semibold text-text-primary">
                      Latest Vitals
                    </h2>
                  </div>
                  {patientData.vitals[0] && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Blood Pressure</p>
                        <p className="text-xl font-bold text-text-primary">{patientData.vitals[0].bloodPressure}</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Heart Rate</p>
                        <p className="text-xl font-bold text-text-primary">{patientData.vitals[0].heartRate} bpm</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Temperature</p>
                        <p className="text-xl font-bold text-text-primary">{patientData.vitals[0].temperature}°F</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Weight</p>
                        <p className="text-xl font-bold text-text-primary">{patientData.vitals[0].weight} lbs</p>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-text-secondary mt-4">
                    Last updated: {new Date(patientData.vitals[0].date).toLocaleDateString()}
                  </p>
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
                    {patientData.medicalHistory.map((condition, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-text-primary">{condition.condition}</p>
                            <p className="text-sm text-text-secondary">
                              Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              Doctor: {condition.doctor}
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
                    {patientData.allergies.map((allergy, index) => (
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

            {/* Vitals Tab */}
            {activeTab === 'vitals' && (
              <div className="card p-6 dark:bg-gray-900">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Vitals History
                </h2>
                <div className="space-y-4">
                  {patientData.vitals.map((vital, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-primary-600" />
                          <span className="font-medium text-text-primary">
                            {new Date(vital.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-text-secondary">Blood Pressure</p>
                          <p className="font-medium text-text-primary">{vital.bloodPressure} mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-secondary">Heart Rate</p>
                          <p className="font-medium text-text-primary">{vital.heartRate} bpm</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-secondary">Temperature</p>
                          <p className="font-medium text-text-primary">{vital.temperature}°F</p>
                        </div>
                        <div>
                          <p className="text-sm text-text-secondary">Weight</p>
                          <p className="font-medium text-text-primary">{vital.weight} lbs</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lab Results Tab */}
            {activeTab === 'labs' && (
              <div className="card p-6 dark:bg-gray-900">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Laboratory Results
                </h2>
                <div className="space-y-3">
                  {patientData.labResults.map((lab, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-text-primary">{lab.test}</p>
                          <p className="text-sm text-text-secondary">
                            {new Date(lab.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-text-secondary mt-1">
                            Ordered by: {lab.doctor}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lab.status)}`}>
                            {lab.status}
                          </span>
                          <button
                            onClick={() => toast.success('Download feature coming soon!')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Download className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Allergy Alert */}
            {patientData.allergies.length > 0 && (
              <div className="card p-6 dark:bg-gray-900 bg-red-50 border-red-200">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">Allergy Alert</h3>
                </div>
                <ul className="space-y-2">
                  {patientData.allergies.map((allergy, index) => (
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
                  <span className="text-text-secondary">Active Conditions:</span>
                  <span className="font-medium text-text-primary">
                    {patientData.medicalHistory.filter(c => c.status === 'Ongoing').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Current Medications:</span>
                  <span className="font-medium text-text-primary">{patientData.medications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Known Allergies:</span>
                  <span className="font-medium text-red-600">{patientData.allergies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Lab Tests:</span>
                  <span className="font-medium text-text-primary">{patientData.labResults.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-outline text-left">
                  Request Records
                </button>
                <button className="w-full btn-outline text-left">
                  Share with Doctor
                </button>
                <button className="w-full btn-outline text-left">
                  Print Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
