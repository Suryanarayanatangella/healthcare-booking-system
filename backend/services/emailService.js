/**
 * Email Service
 * 
 * Simple, reliable email notification system for healthcare appointments
 * Supports multiple email providers and templates
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initializeTransporter();
  }

  /**
   * Initialize email transporter based on environment
   */
  initializeTransporter() {
    try {
      // Check if email is configured
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('📧 Email service not configured - running in demo mode');
        return;
      }

      // Create transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false // For development
        }
      });

      this.isConfigured = true;
      console.log('✅ Email service configured successfully');

      // Test connection
      this.testConnection();

    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Test email connection
   */
  async testConnection() {
    if (!this.transporter) return;

    try {
      await this.transporter.verify();
      console.log('✅ Email server connection verified');
    } catch (error) {
      console.error('⚠️ Email server connection failed:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Send appointment confirmation email to patient
   */
  async sendAppointmentConfirmation(appointmentData) {
    const { patientEmail, patientName, doctorName, appointmentDate, appointmentTime, reasonForVisit } = appointmentData;

    const subject = '✅ Appointment Confirmation - Healthcare Booking';
    const htmlContent = this.generateConfirmationEmail(appointmentData);
    const textContent = this.generateConfirmationText(appointmentData);

    return await this.sendEmail({
      to: patientEmail,
      subject,
      html: htmlContent,
      text: textContent
    });
  }

  /**
   * Send appointment notification to doctor
   */
  async sendDoctorNotification(appointmentData) {
    const { doctorEmail, patientName, appointmentDate, appointmentTime, reasonForVisit } = appointmentData;

    const subject = '🏥 New Appointment Booked - Healthcare System';
    const htmlContent = this.generateDoctorNotificationEmail(appointmentData);
    const textContent = this.generateDoctorNotificationText(appointmentData);

    return await this.sendEmail({
      to: doctorEmail,
      subject,
      html: htmlContent,
      text: textContent
    });
  }

  /**
   * Send appointment cancellation email
   */
  async sendCancellationEmail(appointmentData) {
    const { patientEmail, patientName, doctorName, appointmentDate, appointmentTime, cancellationReason } = appointmentData;

    const subject = '❌ Appointment Cancelled - Healthcare Booking';
    const htmlContent = this.generateCancellationEmail(appointmentData);
    const textContent = this.generateCancellationText(appointmentData);

    return await this.sendEmail({
      to: patientEmail,
      subject,
      html: htmlContent,
      text: textContent
    });
  }

  /**
   * Send appointment reminder email
   */
  async sendAppointmentReminder(appointmentData) {
    const { patientEmail, patientName, doctorName, appointmentDate, appointmentTime } = appointmentData;

    const subject = '⏰ Appointment Reminder - Tomorrow';
    const htmlContent = this.generateReminderEmail(appointmentData);
    const textContent = this.generateReminderText(appointmentData);

    return await this.sendEmail({
      to: patientEmail,
      subject,
      html: htmlContent,
      text: textContent
    });
  }

  /**
   * Core email sending method
   */
  async sendEmail({ to, subject, html, text }) {
    try {
      // If email not configured, log instead of sending
      if (!this.isConfigured) {
        console.log('📧 Email Demo Mode - Would send:');
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Content: ${text.substring(0, 100)}...`);
        return { success: true, messageId: 'demo-mode', demo: true };
      }

      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Healthcare Booking'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      
      return { 
        success: true, 
        messageId: result.messageId,
        demo: false
      };

    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      return { 
        success: false, 
        error: error.message,
        demo: false
      };
    }
  }

  /**
   * Generate appointment confirmation email HTML
   */
  generateConfirmationEmail(data) {
    const { patientName, doctorName, appointmentDate, appointmentTime, reasonForVisit, appointmentId } = data;
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Appointment Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007C91; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #007C91; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .button { background: #007C91; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Appointment Confirmed</h1>
                <p>Your healthcare appointment has been successfully booked</p>
            </div>
            
            <div class="content">
                <h2>Hello ${patientName},</h2>
                <p>Your appointment has been confirmed! Here are the details:</p>
                
                <div class="appointment-details">
                    <h3>📅 Appointment Details</h3>
                    <div class="detail-row">
                        <span class="label">Doctor:</span>
                        <span>${doctorName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date:</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Time:</span>
                        <span>${appointmentTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Reason:</span>
                        <span>${reasonForVisit || 'General consultation'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Appointment ID:</span>
                        <span>#${appointmentId}</span>
                    </div>
                </div>
                
                <h3>📋 What to Bring:</h3>
                <ul>
                    <li>Valid ID or insurance card</li>
                    <li>List of current medications</li>
                    <li>Any relevant medical records</li>
                    <li>Payment method for consultation fee</li>
                </ul>
                
                <h3>⏰ Important Notes:</h3>
                <ul>
                    <li>Please arrive 15 minutes early</li>
                    <li>Bring a mask if required</li>
                    <li>Contact us if you need to reschedule</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing our healthcare services!</p>
                <p>If you have any questions, please contact us.</p>
                <p><small>This is an automated message. Please do not reply to this email.</small></p>
            </div>
        </div>
    </body>
    </html>`;
  }

  /**
   * Generate appointment confirmation text version
   */
  generateConfirmationText(data) {
    const { patientName, doctorName, appointmentDate, appointmentTime, reasonForVisit, appointmentId } = data;
    const formattedDate = new Date(appointmentDate).toLocaleDateString();

    return `
APPOINTMENT CONFIRMATION

Hello ${patientName},

Your appointment has been confirmed!

APPOINTMENT DETAILS:
- Doctor: ${doctorName}
- Date: ${formattedDate}
- Time: ${appointmentTime}
- Reason: ${reasonForVisit || 'General consultation'}
- Appointment ID: #${appointmentId}

WHAT TO BRING:
- Valid ID or insurance card
- List of current medications
- Any relevant medical records
- Payment method for consultation fee

IMPORTANT NOTES:
- Please arrive 15 minutes early
- Bring a mask if required
- Contact us if you need to reschedule

Thank you for choosing our healthcare services!

This is an automated message. Please do not reply to this email.`;
  }

  /**
   * Generate doctor notification email HTML
   */
  generateDoctorNotificationEmail(data) {
    const { patientName, patientEmail, patientPhone, appointmentDate, appointmentTime, reasonForVisit, appointmentId } = data;
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Appointment Booked</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007C91; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #007C91; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏥 New Appointment Booked</h1>
                <p>A patient has scheduled an appointment with you</p>
            </div>
            
            <div class="content">
                <h2>New Patient Appointment</h2>
                <p>You have a new appointment scheduled:</p>
                
                <div class="appointment-details">
                    <h3>👤 Patient Information</h3>
                    <div class="detail-row">
                        <span class="label">Patient Name:</span>
                        <span>${patientName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span>${patientEmail}</span>
                    </div>
                    ${patientPhone ? `
                    <div class="detail-row">
                        <span class="label">Phone:</span>
                        <span>${patientPhone}</span>
                    </div>` : ''}
                    
                    <h3>📅 Appointment Details</h3>
                    <div class="detail-row">
                        <span class="label">Date:</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Time:</span>
                        <span>${appointmentTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Reason:</span>
                        <span>${reasonForVisit || 'General consultation'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Appointment ID:</span>
                        <span>#${appointmentId}</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>Healthcare Booking System</p>
                <p><small>This is an automated notification.</small></p>
            </div>
        </div>
    </body>
    </html>`;
  }

  /**
   * Generate doctor notification text version
   */
  generateDoctorNotificationText(data) {
    const { patientName, patientEmail, patientPhone, appointmentDate, appointmentTime, reasonForVisit, appointmentId } = data;
    const formattedDate = new Date(appointmentDate).toLocaleDateString();

    return `
NEW APPOINTMENT BOOKED

You have a new appointment scheduled:

PATIENT INFORMATION:
- Name: ${patientName}
- Email: ${patientEmail}
${patientPhone ? `- Phone: ${patientPhone}` : ''}

APPOINTMENT DETAILS:
- Date: ${formattedDate}
- Time: ${appointmentTime}
- Reason: ${reasonForVisit || 'General consultation'}
- Appointment ID: #${appointmentId}

Healthcare Booking System
This is an automated notification.`;
  }

  /**
   * Generate cancellation email HTML
   */
  generateCancellationEmail(data) {
    const { patientName, doctorName, appointmentDate, appointmentTime, cancellationReason, appointmentId } = data;
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Appointment Cancelled</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #dc3545; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .button { background: #007C91; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>❌ Appointment Cancelled</h1>
                <p>Your appointment has been cancelled</p>
            </div>
            
            <div class="content">
                <h2>Hello ${patientName},</h2>
                <p>We're writing to confirm that your appointment has been cancelled.</p>
                
                <div class="appointment-details">
                    <h3>📅 Cancelled Appointment Details</h3>
                    <div class="detail-row">
                        <span class="label">Doctor:</span>
                        <span>${doctorName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date:</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Time:</span>
                        <span>${appointmentTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Appointment ID:</span>
                        <span>#${appointmentId}</span>
                    </div>
                    ${cancellationReason ? `
                    <div class="detail-row">
                        <span class="label">Reason:</span>
                        <span>${cancellationReason}</span>
                    </div>` : ''}
                </div>
                
                <p>If you need to schedule a new appointment, please visit our booking system or contact us directly.</p>
                
                <a href="#" class="button">Book New Appointment</a>
            </div>
            
            <div class="footer">
                <p>Thank you for using our healthcare services!</p>
                <p><small>This is an automated message. Please do not reply to this email.</small></p>
            </div>
        </div>
    </body>
    </html>`;
  }

  /**
   * Generate cancellation text version
   */
  generateCancellationText(data) {
    const { patientName, doctorName, appointmentDate, appointmentTime, cancellationReason, appointmentId } = data;
    const formattedDate = new Date(appointmentDate).toLocaleDateString();

    return `
APPOINTMENT CANCELLED

Hello ${patientName},

Your appointment has been cancelled.

CANCELLED APPOINTMENT DETAILS:
- Doctor: ${doctorName}
- Date: ${formattedDate}
- Time: ${appointmentTime}
- Appointment ID: #${appointmentId}
${cancellationReason ? `- Reason: ${cancellationReason}` : ''}

If you need to schedule a new appointment, please visit our booking system or contact us directly.

Thank you for using our healthcare services!

This is an automated message. Please do not reply to this email.`;
  }

  /**
   * Generate reminder email HTML
   */
  generateReminderEmail(data) {
    const { patientName, doctorName, appointmentDate, appointmentTime, appointmentId } = data;
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Appointment Reminder</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ffc107; color: #333; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #007C91; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⏰ Appointment Reminder</h1>
                <p>Your appointment is tomorrow!</p>
            </div>
            
            <div class="content">
                <h2>Hello ${patientName},</h2>
                <p>This is a friendly reminder about your upcoming appointment.</p>
                
                <div class="appointment-details">
                    <h3>📅 Tomorrow's Appointment</h3>
                    <div class="detail-row">
                        <span class="label">Doctor:</span>
                        <span>${doctorName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date:</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Time:</span>
                        <span>${appointmentTime}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Appointment ID:</span>
                        <span>#${appointmentId}</span>
                    </div>
                </div>
                
                <h3>📋 Reminders:</h3>
                <ul>
                    <li>Arrive 15 minutes early</li>
                    <li>Bring your ID and insurance card</li>
                    <li>Bring list of current medications</li>
                    <li>Wear a mask if required</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>See you tomorrow!</p>
                <p><small>This is an automated reminder. Please do not reply to this email.</small></p>
            </div>
        </div>
    </body>
    </html>`;
  }

  /**
   * Generate reminder text version
   */
  generateReminderText(data) {
    const { patientName, doctorName, appointmentDate, appointmentTime, appointmentId } = data;
    const formattedDate = new Date(appointmentDate).toLocaleDateString();

    return `
APPOINTMENT REMINDER

Hello ${patientName},

This is a friendly reminder about your upcoming appointment.

TOMORROW'S APPOINTMENT:
- Doctor: ${doctorName}
- Date: ${formattedDate}
- Time: ${appointmentTime}
- Appointment ID: #${appointmentId}

REMINDERS:
- Arrive 15 minutes early
- Bring your ID and insurance card
- Bring list of current medications
- Wear a mask if required

See you tomorrow!

This is an automated reminder. Please do not reply to this email.`;
  }
}

// Export singleton instance
module.exports = new EmailService();