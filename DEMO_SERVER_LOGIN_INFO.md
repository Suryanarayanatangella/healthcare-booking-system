# 🔐 Demo Server Login Information

## Current Status
✅ Backend running on: http://localhost:5000
✅ Frontend running on: http://localhost:3001

## How Demo Server Works

The demo server uses **in-memory storage** - no database required. This means:
- Users are stored in memory during server runtime
- Data resets when server restarts
- Perfect for testing and demos

## Login Options

### Option 1: Use Pre-configured Demo Accounts
These accounts are always available:

**Patient Account:**
- Email: `patient@demo.com`
- Password: any password (e.g., `password123`)

**Doctor Account:**
- Email: `doctor@demo.com`
- Password: any password (e.g., `password123`)

### Option 2: Register Your Own Account
1. Go to: http://localhost:3001/register
2. Fill in your details
3. Click Register
4. You'll be automatically logged in
5. Your account will persist until server restart

## Important Notes

⚠️ **Password Flexibility**: In demo mode, any password works for existing users
⚠️ **Data Persistence**: All data (users, messages, appointments) resets on server restart
⚠️ **No Database**: This is intentional - makes it easy to test without setup

## Testing the Messaging System

1. **Login as Patient** (patient@demo.com)
   - Go to Messages
   - You'll see a conversation with Dr. Sarah Johnson
   - Send a message

2. **Login as Doctor** (doctor@demo.com) in another browser/incognito
   - Go to Messages  
   - You'll see the conversation with John Doe (patient)
   - See the patient's message
   - Reply to it

3. **Switch back to Patient**
   - Refresh the page
   - See the doctor's reply!

## Troubleshooting

**"User not found" error?**
- You need to register first, OR
- Use the demo accounts: patient@demo.com or doctor@demo.com

**"User already exists" error?**
- The email is already registered
- Just login with that email (any password works)

**Messages not showing?**
- Make sure backend is running on port 5000
- Check browser console for errors
- Try refreshing the page

## For Production

For a production environment, you would:
1. Use the real backend (server.js) instead of demo-server.js
2. Connect to a real database (PostgreSQL)
3. Implement proper password hashing
4. Add JWT token validation
5. Implement real-time messaging with WebSockets
