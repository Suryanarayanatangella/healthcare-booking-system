/**
 * Change Password Page Component
 * 
 * Allows authenticated users to change their password
 * with proper validation and security checks.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ButtonLoader } from '../../components/common/LoadingSpinner';

// Password validation schema
const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your new password'),
});

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 15;
    if (/[@$!%*?&]/.test(password)) strength += 15;
    
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength) => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const handlePasswordChange = (e, setFieldValue) => {
    const password = e.target.value;
    setFieldValue('newPassword', password);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // TODO: Implement API call to change password
      // await dispatch(changePassword(values));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Password changed successfully!');
      resetForm();
      
      // Redirect after successful password change
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost flex items-center space-x-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary">
                Change Password
              </h1>
              <p className="text-text-secondary mt-1">
                Update your password to keep your account secure
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card p-6 dark:bg-gray-900">
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={changePasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, touched, errors, setFieldValue, values }) => (
                  <Form className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label htmlFor="currentPassword" className="form-label">
                        Current Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          className={`form-input pl-10 pr-10 ${
                            touched.currentPassword && errors.currentPassword ? 'form-input-error' : ''
                          }`}
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="currentPassword" component="div" className="form-error" />
                    </div>

                    {/* New Password */}
                    <div>
                      <label htmlFor="newPassword" className="form-label">
                        New Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          className={`form-input pl-10 pr-10 ${
                            touched.newPassword && errors.newPassword ? 'form-input-error' : ''
                          }`}
                          placeholder="Enter your new password"
                          onChange={(e) => handlePasswordChange(e, setFieldValue)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="newPassword" component="div" className="form-error" />
                      
                      {/* Password Strength Indicator */}
                      {values.newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-text-secondary">Password Strength:</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength < 40 ? 'text-red-600' :
                              passwordStrength < 70 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {getStrengthText(passwordStrength)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={`form-input pl-10 pr-10 ${
                            touched.confirmPassword && errors.confirmPassword ? 'form-input-error' : ''
                          }`}
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                      
                      {/* Match Indicator */}
                      {values.confirmPassword && values.newPassword && (
                        <div className="mt-2 flex items-center space-x-2">
                          {values.confirmPassword === values.newPassword ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-green-600">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-xs text-red-600">Passwords don't match</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center space-x-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary flex items-center space-x-2"
                      >
                        {isSubmitting && <ButtonLoader />}
                        <Lock className="h-4 w-4" />
                        <span>Change Password</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Sidebar - Password Requirements */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="card p-6 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Account
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-text-secondary">Email</p>
                  <p className="font-medium text-text-primary">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Account Type</p>
                  <p className="font-medium text-text-primary capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="card p-6 dark:bg-gray-900">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Password Requirements
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>At least 8 characters long</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Contains uppercase letter (A-Z)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Contains lowercase letter (a-z)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Contains number (0-9)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Contains special character (@$!%*?&)</span>
                </li>
              </ul>
            </div>

            {/* Security Tips */}
            <div className="card p-6 dark:bg-gray-900 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">
                    Security Tips
                  </h3>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• Use a unique password</li>
                    <li>• Don't reuse old passwords</li>
                    <li>• Avoid common words</li>
                    <li>• Use a password manager</li>
                    <li>• Enable two-factor authentication</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
