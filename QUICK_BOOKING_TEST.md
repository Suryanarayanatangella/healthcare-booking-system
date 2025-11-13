# 🧪 Quick Booking System Test

## 30-Second Test

### Step 1: Login
- Go to: http://localhost:3001/login
- Email: `patient@demo.com`
- Password: any password

### Step 2: Start Booking
- Click "Book Appointment" or go to: http://localhost:3001/book-appointment

### Step 3: Follow the Steps

#### ✅ Step 1: Choose Doctor
- See 2 doctor cards
- Click on "Dr. Sarah Johnson"
- See checkmark appear
- Click "Next"

#### ✅ Step 2: Select Date
- Pick tomorrow's date
- Click "Next"

#### ✅ Step 3: Pick Time
- See 16 time slots (09:00 AM - 04:30 PM)
- Click any time (e.g., "10:00 AM")
- Click "Next"

#### ✅ Step 4: Confirm Details
- See appointment summary
- Enter reason: "Regular checkup"
- Click "Book Appointment"

### Step 4: Verify Success
- **Expected**: Success message
- **Expected**: Redirect to appointments page
- **Expected**: See your appointment in the list

## What You Should See

### Booking Page
```
┌─────────────────────────────────────────┐
│  Book Your Appointment                  │
│  Simple and easy - just follow steps   │
│                                         │
│  ① ━━━ ② ━━━ ③ ━━━ ④                  │
│  Doctor  Date  Time  Confirm            │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Step Content Here                │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Previous]              [Next]         │
└─────────────────────────────────────────┘
```

### Time Slots (Step 3)
```
┌─────────────────────────────────────────┐
│  Pick Your Time                         │
│  16 time slots available                │
│                                         │
│  [09:00 AM] [09:30 AM] [10:00 AM]      │
│  [10:30 AM] [11:00 AM] [11:30 AM]      │
│  [12:00 PM] [12:30 PM] [01:00 PM]      │
│  [01:30 PM] [02:00 PM] [02:30 PM]      │
│  [03:00 PM] [03:30 PM] [04:00 PM]      │
│  [04:30 PM]                             │
└─────────────────────────────────────────┘
```

### Appointments List
```
┌─────────────────────────────────────────┐
│  My Appointments                        │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Dr. Sarah Johnson                 │ │
│  │ Cardiology                        │ │
│  │ 📅 Jan 15, 2024 at 10:00 AM      │ │
│  │ Status: Scheduled                 │ │
│  │ [View Details] [Cancel]           │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Test Checklist

### ✅ Basic Flow
- [ ] Can select doctor
- [ ] Can select date
- [ ] Time slots appear
- [ ] Can select time
- [ ] Can enter reason
- [ ] Can submit booking
- [ ] See success message
- [ ] Redirected to appointments
- [ ] Appointment appears in list

### ✅ Validation
- [ ] Can't proceed without doctor
- [ ] Can't proceed without date
- [ ] Can't proceed without time
- [ ] Must enter reason (min 10 chars)
- [ ] See error messages

### ✅ Conflict Detection
- [ ] Book a time slot
- [ ] Try to book same slot again
- [ ] That slot should not appear
- [ ] Or get conflict error

## Expected Behavior

### ✅ Success Flow
```
1. Select doctor → Next enabled
2. Select date → Next enabled
3. Select time → Next enabled
4. Enter reason → Book enabled
5. Submit → Success message
6. Redirect → See appointment
```

### ✅ Time Slots
- 16 slots available initially
- Booked slots disappear
- Only available times shown
- AM/PM format displayed

### ✅ Appointments List
- Shows your appointments
- Includes doctor name
- Shows date and time
- Shows status
- Has action buttons

## Troubleshooting

### No time slots showing?
- Check date is selected
- Check doctor is selected
- Check backend is running
- Check console for errors

### Can't book appointment?
- Check all fields filled
- Check reason is 10+ characters
- Check backend is running
- Check you're logged in

### Appointment not in list?
- Refresh the page
- Check you're logged in
- Check backend is running
- Check console for errors

## Quick Links

- **Login**: http://localhost:3001/login
- **Book Appointment**: http://localhost:3001/book-appointment
- **My Appointments**: http://localhost:3001/appointments
- **Backend Health**: http://localhost:5000/api/health

## Demo Accounts

- **Patient**: patient@demo.com / any password
- **Doctor**: doctor@demo.com / any password

Test it now! 🚀
