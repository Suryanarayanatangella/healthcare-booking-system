/**
 * Doctor Schedule Management Page
 * 
 * Allows doctors to set their availability, working hours,
 * and manage their appointment schedule.
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const SchedulePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [schedule, setSchedule] = useState({
    monday: { enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    tuesday: { enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    wednesday: { enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    thursday: { enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    friday: { enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    saturday: { enabled: false, startTime: '09:00', endTime: '13:00', breakStart: '', breakEnd: '' },
    sunday: { enabled: false, startTime: '09:00', endTime: '13:00', breakStart: '', breakEnd: '' }
  });
  
  const [consultationDuration, setConsultationDuration] = useState(30); // minutes
  const [isAvailable, setIsAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  const handleDayToggle = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      // Here you would make an API call to save the schedule
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Schedule saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save schedule. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Schedule Management
          </h1>
          <p className="text-gray-600">
            Set your availability and working hours for patient appointments
          </p>
        </div>

        {/* Availability Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Availability Status
              </h2>
              <p className="text-gray-600">
                Control whether patients can book appointments with you
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAvailable ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Consultation Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Consultation Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Duration (minutes)
              </label>
              <select
                value={consultationDuration}
                onChange={(e) => setConsultationDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Weekly Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Schedule
          </h2>
          
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDayToggle(day.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        schedule[day.key].enabled ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          schedule[day.key].enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-900">
                      {day.label}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    schedule[day.key].enabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {schedule[day.key].enabled ? 'Working' : 'Off'}
                  </span>
                </div>

                {schedule[day.key].enabled && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <select
                        value={schedule[day.key].startTime}
                        onChange={(e) => handleTimeChange(day.key, 'startTime', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <select
                        value={schedule[day.key].endTime}
                        onChange={(e) => handleTimeChange(day.key, 'endTime', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Break Start
                      </label>
                      <select
                        value={schedule[day.key].breakStart}
                        onChange={(e) => handleTimeChange(day.key, 'breakStart', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="">No break</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Break End
                      </label>
                      <select
                        value={schedule[day.key].breakEnd}
                        onChange={(e) => handleTimeChange(day.key, 'breakEnd', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        disabled={!schedule[day.key].breakStart}
                      >
                        <option value="">No break</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            {saveMessage && (
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                saveMessage.includes('success') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {saveMessage.includes('success') ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{saveMessage}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleSaveSchedule}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Schedule'}</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SchedulePage;