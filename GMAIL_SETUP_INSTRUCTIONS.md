# 📧 Gmail Setup for Healthcare Booking System

## 🎯 **Quick Gmail Setup (5 minutes)**

### **Step 1: Enable 2-Factor Authentication**
1. Go to **Google Account** → **Security**
2. Turn on **2-Step Verification** if not already enabled
3. Follow the setup process

### **Step 2: Generate App Password**
1. In **Google Account** → **Security**
2. Click **2-Step Verification**
3. Scroll down to **App passwords**
4. Click **Generate app password**
5. Select **Mail** as the app
6. **Copy the 16-character password** (save it!)

### **Step 3: Update Backend Configuration**
1. **Open**: `backend/.env`
2. **Update these lines**:
   ```env
   SMTP_USER=your-actual-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM_EMAIL=your-actual-email@gmail.com
   ```

### **Step 4: Test the Setup**
1. **Start backend**: `cd backend && npm start`
2. **Run test**: `node test-email-system.js`
3. **Check your email** for test messages

## 📧 **Example Configuration**

```env
# Replace with your actual Gmail details
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=narayana024766@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM_NAME=Healthcare Booking System
SMTP_FROM_EMAIL=narayana024766@gmail.com
```

## 🧪 **Testing Steps**

### **1. Backend Test:**
```bash
cd backend
npm start
# Should see: "✅ Email service configured successfully"
```

### **2. Email System Test:**
```bash
node test-email-system.js
# Tests all email types and functionality
```

### **3. Real Appointment Test:**
1. **Visit**: http://localhost:3000/booking
2. **Book appointment** with your email
3. **Check inbox** for confirmation email
4. **Check doctor email** for notification

## 🔧 **Alternative Email Providers**

### **Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### **Yahoo Mail:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### **Custom SMTP Server:**
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
```

## 🎯 **What Emails Are Sent**

### **When Patient Books Appointment:**
1. **Patient gets**: Beautiful confirmation email with appointment details
2. **Doctor gets**: Notification email with patient information

### **When Appointment is Cancelled:**
1. **Patient gets**: Cancellation confirmation with rebooking options

### **Manual Reminders:**
1. **Patients get**: Reminder emails before appointments

## 🔐 **Security Notes**

- **Never commit** your actual email credentials to Git
- **Use App Passwords** instead of your main Gmail password
- **Keep .env file** in .gitignore
- **Use environment variables** for production deployment

## 🎉 **Ready to Configure!**

**Choose your setup method:**

1. **Gmail (Recommended)** - Follow steps above
2. **Other Provider** - Use alternative configurations
3. **Demo Mode** - Leave as-is for testing (emails logged to console)

**Which email provider would you like to configure?** I can help you set it up! 📧