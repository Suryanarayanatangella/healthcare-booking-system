# 📧 Email Notifications Setup Guide

## ✅ **Email System Implemented**

Your healthcare booking system now has a complete email notification system!

### **🎯 Features Added:**

1. **📧 Appointment Confirmation Emails** - Sent to patients when they book
2. **🏥 Doctor Notification Emails** - Sent to doctors when appointments are booked
3. **❌ Cancellation Emails** - Sent when appointments are cancelled
4. **⏰ Reminder Emails** - Can be sent before appointments (manual/cron)
5. **🧪 Email Testing** - Admin panel to test email functionality

## 🔧 **Setup Instructions**

### **Option 1: Gmail Setup (Recommended for Testing)**

1. **Create App Password:**
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Generate App Password for "Mail"

2. **Update Backend Environment:**
   ```env
   # Add to backend/.env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_NAME=Healthcare Booking System
   SMTP_FROM_EMAIL=your-email@gmail.com
   
   # Email Features
   EMAIL_ENABLED=true
   SEND_PATIENT_CONFIRMATIONS=true
   SEND_DOCTOR_NOTIFICATIONS=true
   SEND_REMINDERS=true
   ```

### **Option 2: Other Email Providers**

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Custom SMTP:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
```

### **Option 3: Demo Mode (No Setup Required)**

If you don't configure SMTP, the system runs in demo mode:
- Email content is logged to console
- No actual emails are sent
- Perfect for development and testing

## 🧪 **Testing Email System**

### **1. Check Email Status:**
```bash
GET /api/email/status
Authorization: Bearer <admin-or-doctor-token>
```

### **2. Send Test Emails:**
```bash
POST /api/email/test
Authorization: Bearer <admin-or-doctor-token>
Content-Type: application/json

{
  "type": "confirmation",
  "email": "test@example.com"
}
```

**Available Test Types:**
- `confirmation` - Patient appointment confirmation
- `doctor-notification` - Doctor notification
- `cancellation` - Appointment cancellation
- `reminder` - Appointment reminder

### **3. Test via Browser:**

1. **Login as admin/doctor**
2. **Visit**: `http://localhost:5000/api/email/status`
3. **Test emails**: Use Postman or curl

## 📧 **Email Templates**

### **Professional HTML Templates Include:**
- **Beautiful styling** with your brand colors
- **Responsive design** for mobile devices
- **Clear appointment details** with formatting
- **Professional footer** with contact info
- **Both HTML and text versions** for compatibility

### **Email Content:**
- **Patient Confirmations**: Appointment details, what to bring, arrival instructions
- **Doctor Notifications**: Patient info, appointment details, contact information
- **Cancellations**: Cancelled appointment details, rebooking options
- **Reminders**: Tomorrow's appointment reminder with preparation notes

## 🔄 **Automatic Email Triggers**

### **✅ Currently Implemented:**
- **Appointment Booked** → Patient confirmation + Doctor notification
- **Appointment Cancelled** → Patient cancellation email

### **🚀 Future Enhancements:**
- **Appointment Reminders** → Automated 24h before (cron job)
- **Appointment Rescheduled** → Notification emails
- **Doctor Schedule Changes** → Patient notifications

## 🎯 **API Endpoints**

### **Email Management:**
```
GET  /api/email/status           # Check email service status
POST /api/email/test             # Send test emails
POST /api/email/send-reminders   # Manual reminder trigger (admin)
```

### **Appointment Emails (Automatic):**
```
POST /api/appointments           # Triggers confirmation emails
PUT  /api/appointments/:id       # Triggers cancellation emails (if cancelled)
```

## 🔐 **Security Features**

- **Authentication required** for email management
- **Role-based access** (admin/doctor for testing)
- **Environment-based configuration** (no hardcoded credentials)
- **Graceful fallbacks** (demo mode if not configured)
- **Error handling** (appointment booking doesn't fail if email fails)

## 📱 **User Experience**

### **For Patients:**
- **Instant confirmation** when booking appointments
- **Clear appointment details** with all necessary information
- **Professional appearance** builds trust
- **Mobile-friendly** emails

### **For Doctors:**
- **Immediate notifications** of new appointments
- **Patient contact information** readily available
- **Appointment details** for preparation

## 🎉 **Ready to Use!**

Your email system is now fully functional:

1. **Configure SMTP** (or use demo mode)
2. **Restart backend server**
3. **Book a test appointment**
4. **Check your email!**

### **Quick Test:**
1. Book appointment as patient
2. Check patient email for confirmation
3. Check doctor email for notification
4. Cancel appointment
5. Check patient email for cancellation

**Professional email notifications are now part of your healthcare booking system!** 📧✨