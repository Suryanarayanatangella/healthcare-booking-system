/**
 * Email Service Module
 * 
 * This module handles all email-related functionality including
 * appointment confirmations, cancellations, and reminders.
 */

const nodemailer = require('nodemailer');
const { query } = require('../config/database');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send appointment confirmation email
 * @param {Object} appointmentData - Appointment details
 */
const sendAppointmentConfirmation = async (appointmentData) => {
  try {
    const transporter = createTransporter();
    
    const {
      patientEmail,
      patientName,
      doctorEmail,
      doctorName,
      appointmentDate,
      appointmentTime,
      appointmentId,
      reasonForVisit
    } = appointmentData;

    // Format date and time for display
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTime = new Date(`2000-01-01T${appointmentTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Email to patient
    const patientEmailContent = {
      from: process.env.SMTP_USER,
      to: patientEmail,
      subject: 'Appointment Confirmation - Healthcare Booking System',
      html: `
        <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F7FA;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #007C91; font-family: 'DM Sans', Arial, sans-serif; margin-bottom: 20px;">Appointment Confirmed</h1>
            
            <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
              Dear ${patientName},
            </p>
            
            <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
              Your appointment has been successfully booked. Here are the details:
            </p>
            
            <div style="background-color: #F5F7FA; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007C91; margin-top: 0;">Appointment Details</h3>
              <p style="margin: 10px 0; color: #2E3A59;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
              <p style="margin: 10px 0; color: #2E3A59;"><strong>Date:</strong> ${formattedDate}</p>
              <p style="margin: 10px 0; color: #2E3A59;"><strong>Time:</strong> ${formattedTime}</p>
              <p style="margin: 10px 0; color: #2E3A59;"><strong>Appointment ID:</strong> ${appointmentId}</p>
              ${reasonForVisit ? `<p style="margin: 10px 0; color: #2E3A59;"><strong>Reason:</strong> ${reasonForVisit}</p>` : ''}
            </div>
            
            <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
              Please arrive 15 minutes early for your appointment. If you need to cancel or reschedule, please contact us at least 24 hours in advance.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #007C91; font-size: 14px;">Healthcare Booking System</p>
            </div>
          </div>
        </div>
      `
    };

    // Email to doctor
    const doctorEmailContent = {
      from: process.env.SMTP_USER,
      to: doctorEmail,
      subject: 'New Appointment Scheduled - Healthcare Booking System',
      html: `
        <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F7FA;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #007C91; font-family: 'DM Sans', Arial, sans-serif; margin-bottom: 20px;">New Appointment Scheduled</h1>
            
            <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
              Dear Dr. ${doctorName},
            </p>
            
            <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
              A new appointment has been scheduled with you:
            </p>
            
            <div style="background-color: #F5F7FA; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007C91; margin-top: 0;">Appointment Details</h3>
              <p style="margin: 10px 0; color: #2E3A59;"><strong>Patient:</strong> ${patientName}</p>
              <p style="margin: 10px 0; color: #2E3A59;"><strong>Date:</strong> ${formattedDate}</p>
              <p style="margin: 10px 0; color: #2E3A59;"><strong>Time:</strong> ${formattedTime}</p>
              <p style="margin: 10px 0; color: #2E3A59;"><strong>Appointment ID:</strong> ${appointmentId}</p>
              ${reasonForVisit ? `<p style="margin: 10px 0; color: #2E3A59;"><strong>Reason:</strong> ${reasonForVisit}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #007C91; font-size: 14px;">Healthcare Booking System</p>
            </div>
          </div>
        </div>
      `
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(patientEmailContent),
      transporter.sendMail(doctorEmailContent)
    ]);

    // Log email notifications
    await Promise.all([
      logEmailNotification(appointmentId, patientEmail, 'booking_confirmation', patientEmailContent.subject, patientEmailContent.html),
      logEmailNotification(appointmentId, doctorEmail, 'booking_confirmation', doctorEmailContent.subject, doctorEmailContent.html)
    ]);

    console.log('✅ Appointment confirmation emails sent successfully');

  } catch (error) {
    console.error('❌ Error sending appointment confirmation emails:', error);
    throw error;
  }
};

/**
 * Send appointment cancellation email
 * @param {Object} appointmentData - Appointment details
 */
const sendAppointmentCancellation = async (appointmentData) => {
  try {
    const transporter = createTransporter();
    
    const {
      patientEmail,
      patientName,
      doctorEmail,
      doctorName,
      appointmentDate,
      appointmentTime,
      appointmentId,
      cancellationReason
    } = appointmentData;

    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTime = new Date(`2000-01-01T${appointmentTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Email content for both patient and doctor
    const emailContent = {
      patient: {
        from: process.env.SMTP_USER,
        to: patientEmail,
        subject: 'Appointment Cancelled - Healthcare Booking System',
        html: `
          <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F7FA;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #007C91; font-family: 'DM Sans', Arial, sans-serif; margin-bottom: 20px;">Appointment Cancelled</h1>
              
              <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
                Dear ${patientName},
              </p>
              
              <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
                Your appointment has been cancelled:
              </p>
              
              <div style="background-color: #F5F7FA; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #007C91; margin-top: 0;">Cancelled Appointment</h3>
                <p style="margin: 10px 0; color: #2E3A59;"><strong>Doctor:</strong> Dr. ${doctorName}</p>
                <p style="margin: 10px 0; color: #2E3A59;"><strong>Date:</strong> ${formattedDate}</p>
                <p style="margin: 10px 0; color: #2E3A59;"><strong>Time:</strong> ${formattedTime}</p>
                <p style="margin: 10px 0; color: #2E3A59;"><strong>Appointment ID:</strong> ${appointmentId}</p>
                ${cancellationReason ? `<p style="margin: 10px 0; color: #2E3A59;"><strong>Reason:</strong> ${cancellationReason}</p>` : ''}
              </div>
              
              <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
                You can book a new appointment anytime through our booking system.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #007C91; font-size: 14px;">Healthcare Booking System</p>
              </div>
            </div>
          </div>
        `
      },
      doctor: {
        from: process.env.SMTP_USER,
        to: doctorEmail,
        subject: 'Appointment Cancelled - Healthcare Booking System',
        html: `
          <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F7FA;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #007C91; font-family: 'DM Sans', Arial, sans-serif; margin-bottom: 20px;">Appointment Cancelled</h1>
              
              <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
                Dear Dr. ${doctorName},
              </p>
              
              <p style="color: #2E3A59; font-size: 16px; margin-bottom: 20px;">
                An appointment has been cancelled:
              </p>
              
              <div style="background-color: #F5F7FA; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #007C91; margin-top: 0;">Cancelled Appointment</h3>
                <p style="margin: 10px 0; color: #2E3A59;"><strong>Patient:</strong> ${patientName}</p>
                <p style="margin: 10px 0; color: #2E3A59;"><strong>Date:</strong> ${formattedDate}</p>
                <p style="margin: 10px 0; color: #2E3A59;"><strong>Time:</strong> ${formattedTime}</p>
                <p style="margin: 10px 0; color: #2E3A59;"><strong>Appointment ID:</strong> ${appointmentId}</p>
                ${cancellationReason ? `<p style="margin: 10px 0; color: #2E3A59;"><strong>Reason:</strong> ${cancellationReason}</p>` : ''}
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #007C91; font-size: 14px;">Healthcare Booking System</p>
              </div>
            </div>
          </div>
        `
      }
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(emailContent.patient),
      transporter.sendMail(emailContent.doctor)
    ]);

    // Log email notifications
    await Promise.all([
      logEmailNotification(appointmentId, patientEmail, 'cancellation', emailContent.patient.subject, emailContent.patient.html),
      logEmailNotification(appointmentId, doctorEmail, 'cancellation', emailContent.doctor.subject, emailContent.doctor.html)
    ]);

    console.log('✅ Appointment cancellation emails sent successfully');

  } catch (error) {
    console.error('❌ Error sending appointment cancellation emails:', error);
    throw error;
  }
};

/**
 * Log email notification to database
 * @param {string} appointmentId - Appointment ID
 * @param {string} recipientEmail - Recipient email address
 * @param {string} emailType - Type of email
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 */
const logEmailNotification = async (appointmentId, recipientEmail, emailType, subject, body) => {
  try {
    await query(
      `INSERT INTO email_notifications (appointment_id, recipient_email, email_type, subject, body, sent_at, status)
       VALUES ($1, $2, $3, $4, $5, NOW(), 'sent')`,
      [appointmentId, recipientEmail, emailType, subject, body]
    );
  } catch (error) {
    console.error('❌ Error logging email notification:', error);
  }
};

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentCancellation
};