/**
 * Email Routes
 * 
 * Routes for testing and managing email functionality
 */

const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

/**
 * @route   GET /api/email/status
 * @desc    Get email service status
 * @access  Private (Admin/Doctor)
 */
router.get('/status', authenticateToken, requireRole(['admin', 'doctor']), (req, res) => {
  try {
    const status = {
      configured: emailService.isConfigured,
      host: process.env.SMTP_HOST || 'Not configured',
      port: process.env.SMTP_PORT || 'Not configured',
      user: process.env.SMTP_USER || 'Not configured',
      fromName: process.env.SMTP_FROM_NAME || 'Healthcare Booking System',
      features: {
        patientConfirmations: process.env.SEND_PATIENT_CONFIRMATIONS !== 'false',
        doctorNotifications: process.env.SEND_DOCTOR_NOTIFICATIONS !== 'false',
        reminders: process.env.SEND_REMINDERS !== 'false'
      }
    };

    res.json({
      success: true,
      status,
      message: emailService.isConfigured ? 'Email service is configured and ready' : 'Email service not configured - running in demo mode'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get email status',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/email/test
 * @desc    Send test email
 * @access  Private (Admin/Doctor)
 */
router.post('/test', authenticateToken, requireRole(['admin', 'doctor']), async (req, res) => {
  try {
    const { type = 'confirmation', email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Sample appointment data for testing
    const testData = {
      appointmentId: 'TEST-123',
      patientName: 'Test Patient',
      patientEmail: email,
      doctorName: 'Dr. Test Doctor',
      doctorEmail: 'doctor@test.com',
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      appointmentTime: '10:00',
      reasonForVisit: 'Test appointment for email functionality',
      cancellationReason: 'Testing cancellation email'
    };

    let result;
    let emailType;

    switch (type) {
      case 'confirmation':
        result = await emailService.sendAppointmentConfirmation(testData);
        emailType = 'Appointment Confirmation';
        break;
      
      case 'doctor-notification':
        result = await emailService.sendDoctorNotification(testData);
        emailType = 'Doctor Notification';
        break;
      
      case 'cancellation':
        result = await emailService.sendCancellationEmail(testData);
        emailType = 'Appointment Cancellation';
        break;
      
      case 'reminder':
        result = await emailService.sendAppointmentReminder(testData);
        emailType = 'Appointment Reminder';
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid email type. Use: confirmation, doctor-notification, cancellation, or reminder'
        });
    }

    res.json({
      success: result.success,
      message: result.success 
        ? `${emailType} email sent successfully${result.demo ? ' (Demo Mode)' : ''}`
        : `Failed to send ${emailType} email`,
      emailType,
      recipient: email,
      messageId: result.messageId,
      demo: result.demo || false,
      error: result.error
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/email/send-reminders
 * @desc    Send appointment reminders for tomorrow
 * @access  Private (Admin only)
 */
router.post('/send-reminders', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // This would typically be run as a cron job
    // For now, it's a manual trigger for testing
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    // Get appointments for tomorrow (this would use your database)
    // For demo purposes, we'll just return a success message
    
    res.json({
      success: true,
      message: 'Reminder emails would be sent for appointments on ' + tomorrowDate,
      note: 'This is a demo endpoint. In production, this would be automated via cron job.'
    });

  } catch (error) {
    console.error('Send reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reminder emails',
      error: error.message
    });
  }
});

module.exports = router;