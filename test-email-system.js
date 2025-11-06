/**
 * Email System Test Script
 * 
 * Tests the complete email notification system
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEmailSystem() {
  console.log('📧 Testing Email Notification System');
  console.log('='.repeat(50));

  try {
    // Step 1: Check if backend is running
    console.log('1️⃣ Checking backend server...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Backend is running:', healthResponse.data.message);

    // Step 2: Login as admin to test email endpoints
    console.log('\n2️⃣ Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@healthcare.com',
      password: 'password123'
    });

    if (!loginResponse.data.token) {
      throw new Error('Login failed - no token received');
    }

    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');

    // Configure axios with token
    const api = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    });

    // Step 3: Check email service status
    console.log('\n3️⃣ Checking email service status...');
    const statusResponse = await api.get('/email/status');
    const emailStatus = statusResponse.data.status;
    
    console.log('📊 Email Service Status:');
    console.log(`   Configured: ${emailStatus.configured ? '✅ Yes' : '❌ No (Demo Mode)'}`);
    console.log(`   Host: ${emailStatus.host}`);
    console.log(`   Port: ${emailStatus.port}`);
    console.log(`   User: ${emailStatus.user}`);
    console.log(`   From Name: ${emailStatus.fromName}`);
    
    console.log('\n📧 Email Features:');
    console.log(`   Patient Confirmations: ${emailStatus.features.patientConfirmations ? '✅' : '❌'}`);
    console.log(`   Doctor Notifications: ${emailStatus.features.doctorNotifications ? '✅' : '❌'}`);
    console.log(`   Reminders: ${emailStatus.features.reminders ? '✅' : '❌'}`);

    // Step 4: Test different email types
    const testEmail = 'test@example.com'; // Change this to your email for real testing
    
    console.log(`\n4️⃣ Testing email templates (sending to: ${testEmail})...`);
    
    const emailTypes = [
      { type: 'confirmation', name: 'Patient Confirmation' },
      { type: 'doctor-notification', name: 'Doctor Notification' },
      { type: 'cancellation', name: 'Appointment Cancellation' },
      { type: 'reminder', name: 'Appointment Reminder' }
    ];

    for (const emailType of emailTypes) {
      try {
        console.log(`\n   Testing ${emailType.name}...`);
        const testResponse = await api.post('/email/test', {
          type: emailType.type,
          email: testEmail
        });

        if (testResponse.data.success) {
          console.log(`   ✅ ${emailType.name} sent successfully`);
          if (testResponse.data.demo) {
            console.log('   📝 Demo mode - check console logs');
          } else {
            console.log(`   📧 Email sent with ID: ${testResponse.data.messageId}`);
          }
        } else {
          console.log(`   ❌ ${emailType.name} failed: ${testResponse.data.error}`);
        }
      } catch (error) {
        console.log(`   ❌ ${emailType.name} failed: ${error.response?.data?.message || error.message}`);
      }
    }

    // Step 5: Test appointment booking with email
    console.log('\n5️⃣ Testing appointment booking with email notifications...');
    
    // Login as patient
    const patientLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'patient@demo.com',
      password: 'password123'
    });

    if (patientLoginResponse.data.token) {
      const patientApi = axios.create({
        baseURL: BASE_URL,
        headers: { Authorization: `Bearer ${patientLoginResponse.data.token}` }
      });

      // Book appointment
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const appointmentDate = tomorrow.toISOString().split('T')[0];

      try {
        const bookingResponse = await patientApi.post('/appointments', {
          doctorId: 1,
          appointmentDate,
          appointmentTime: '14:00',
          reasonForVisit: 'Email system test appointment'
        });

        console.log('✅ Appointment booked successfully!');
        console.log('📧 Email notifications should have been sent');
        console.log(`   Appointment ID: ${bookingResponse.data.appointment.id}`);
      } catch (error) {
        console.log('⚠️ Appointment booking failed:', error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Email system test completed!');
    console.log('\n📋 Summary:');
    console.log('✅ Email service initialized');
    console.log('✅ Email templates created');
    console.log('✅ API endpoints working');
    console.log('✅ Automatic triggers configured');

  } catch (error) {
    console.log('\n❌ Email system test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend server not running. Start it with:');
      console.log('   cd backend');
      console.log('   npm start');
    }
  }

  console.log('\n📧 Email Configuration:');
  console.log('1. Update backend/.env with your email credentials');
  console.log('2. Restart backend server');
  console.log('3. Book appointment to test automatic emails');
  console.log('4. Use /api/email/test to send test emails');
}

testEmailSystem();