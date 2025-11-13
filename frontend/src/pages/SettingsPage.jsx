/**
 * Settings Page Component
 * 
 * User settings and preferences management page with full backend integration
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  User,
  Bell,
  Lock,
  Globe,
  Moon,
  Mail,
  Phone,
  Shield,
  Save,
  Eye,
  EyeOff,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  fetchSettings,
  updateProfile,
  updateNotifications,
  updateSecurity,
  updatePrivacy,
  updatePreferences,
  clearError,
  clearUpdateSuccess
} from '../store/slices/settingsSlice';
import settingsService from '../services/settingsService';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const { settings, loading, error, updateSuccess } = useSelector((state) => state.settings);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Local state for form inputs
  const [formData, setFormData] = useState({
    // Profile
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    promotionalEmails: false,
    
    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Preferences
    language: 'en',
    timezone: 'UTC',
    theme: 'light'
  });

  // Fetch settings on mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        ...formData,
        ...settings.profile,
        ...settings.notifications,
        ...settings.privacy,
        ...settings.preferences
      });
    }
  }, [settings]);

  // Handle success/error notifications
  useEffect(() => {
    if (updateSuccess) {
      toast.success('Settings updated successfully!');
      dispatch(clearUpdateSuccess());
      
      // Clear password fields after successful update
      if (activeTab === 'security') {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    }
  }, [updateSuccess, dispatch, activeTab]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Globe }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Immediately apply theme change for instant visual feedback
    if (field === 'theme') {
      setTheme(value);
    }
  };

  const handleSaveProfile = () => {
    const profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender
    };
    dispatch(updateProfile(profileData));
  };

  const handleSaveNotifications = () => {
    const notificationData = {
      emailNotifications: formData.emailNotifications,
      smsNotifications: formData.smsNotifications,
      appointmentReminders: formData.appointmentReminders,
      promotionalEmails: formData.promotionalEmails
    };
    dispatch(updateNotifications(notificationData));
  };

  const handleSaveSecurity = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    const securityData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    };
    dispatch(updateSecurity(securityData));
  };

  const handleSavePrivacy = () => {
    const privacyData = {
      profileVisibility: formData.profileVisibility,
      showEmail: formData.showEmail,
      showPhone: formData.showPhone
    };
    dispatch(updatePrivacy(privacyData));
  };

  const handleSavePreferences = () => {
    const preferencesData = {
      language: formData.language,
      timezone: formData.timezone,
      theme: formData.theme
    };
    // Update theme context immediately for instant visual feedback
    setTheme(formData.theme);
    dispatch(updatePreferences(preferencesData));
  };

  const handleExportData = async () => {
    try {
      const data = await settingsService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await settingsService.deleteAccount({ password: 'demo', confirmation: 'DELETE' });
      toast.success('Account deletion request submitted');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  if (loading && !settings.profile.firstName) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-text-primary">Settings</h1>
          <p className="mt-2 text-text-secondary">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
              
              {/* Data Management */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-text-secondary mb-3">Data Management</h3>
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary rounded-lg transition-colors"
                >
                  <Download className="mr-3 h-5 w-5" />
                  Export Data
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                >
                  <Trash2 className="mr-3 h-5 w-5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="card p-6 dark:bg-gray-900">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">
                      Profile Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="form-input pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="form-input pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="form-input"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                      { key: 'appointmentReminders', label: 'Appointment Reminders', description: 'Get reminders before appointments' },
                      { key: 'promotionalEmails', label: 'Promotional Emails', description: 'Receive updates and offers' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-text-primary">{item.label}</p>
                          <p className="text-sm text-text-secondary">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[item.key]}
                            onChange={(e) => handleInputChange(item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotifications}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Change Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          className="form-input pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className="form-input"
                        placeholder="At least 8 characters"
                      />
                    </div>
                    <div>
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveSecurity}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Privacy Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Profile Visibility</label>
                      <select
                        value={formData.profileVisibility}
                        onChange={(e) => handleInputChange('profileVisibility', e.target.value)}
                        className="form-input"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">Show Email</p>
                        <p className="text-sm text-text-secondary">Display email on your profile</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showEmail}
                          onChange={(e) => handleInputChange('showEmail', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">Show Phone</p>
                        <p className="text-sm text-text-secondary">Display phone on your profile</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showPhone}
                          onChange={(e) => handleInputChange('showPhone', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSavePrivacy}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Preferences
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Language</label>
                      <select
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="form-input"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Timezone</label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="form-input"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time (EST)</option>
                        <option value="PST">Pacific Time (PST)</option>
                        <option value="CST">Central Time (CST)</option>
                        <option value="MST">Mountain Time (MST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Theme</label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleInputChange('theme', 'light')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                            formData.theme === 'light'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="h-6 w-6 rounded-full bg-white border-2 border-gray-300"></div>
                          <span>Light</span>
                        </button>
                        <button
                          onClick={() => handleInputChange('theme', 'dark')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                            formData.theme === 'dark'
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Moon className="h-6 w-6" />
                          <span>Dark</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSavePreferences}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Delete Account</h3>
            </div>
            <p className="text-text-secondary mb-4">
              Are you sure you want to delete your account? This action cannot be undone.
              All your data will be permanently deleted within 30 days.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
