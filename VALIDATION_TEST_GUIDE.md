# 🧪 Validation Testing Guide

## Quick Validation Tests

### Test 1: Invalid Doctor ❌
**Try to book with non-existent doctor**

1. Go to booking page
2. Manually change doctor ID to 999 (via browser console)
3. Try to book
4. **Expected**: Error - "Doctor with ID 999 does not exist"

---

### Test 2: Past Date ❌
**Try to book appointment in the past**

1. Go to booking page
2. Select doctor
3. Try to select yesterday's date
4. **Expected**: Date picker prevents past dates
5. Or if bypassed: Error - "Cannot book appointments in the past"

---

### Test 3: Invalid Time ❌
**Try to book with invalid time slot**

1. Book appointment normally
2. In browser console, change time to "10:15 AM"
3. Submit
4. **Expected**: Error - "Invalid time slot"

---

### Test 4: Reason Too Short ❌
**Try to book with short reason**

1. Go through booking steps
2. At final step, enter reason: "Checkup" (7 chars)
3. Try to submit
4. **Expected**: Frontend validation prevents submission
5. Or: Error - "Reason must be at least 10 characters"

---

### Test 5: Double Booking ❌
**Try to book same slot twice**

1. Book appointment: Dr. Sarah, Tomorrow, 10:00 AM
2. **Expected**: Success
3. Try to book again: Same doctor, date, time
4. **Expected**: That time slot doesn't appear in available slots
5. Or if bypassed: Error - "Slot already booked"

---

### Test 6: Valid Booking ✅
**Normal successful booking**

1. Select Dr. Sarah Johnson
2. Select tomorrow's date
3. Select 10:00 AM
4. Enter reason: "Regular checkup for annual physical"
5. Submit
6. **Expected**: Success! Appointment created

---

## Browser Console Tests

### Test Invalid Doctor
```javascript
// Open browser console (F12)
fetch('http://localhost:5000/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    doctorId: 999,
    appointmentDate: '2024-01-15',
    appointmentTime: '10:00 AM',
    reasonForVisit: 'Regular checkup'
  })
})
.then(r => r.json())
.then(console.log)

// Expected: 404 error with message
```

### Test Past Date
```javascript
fetch('http://localhost:5000/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    doctorId: 1,
    appointmentDate: '2023-01-01',
    appointmentTime: '10:00 AM',
    reasonForVisit: 'Regular checkup'
  })
})
.then(r => r.json())
.then(console.log)

// Expected: 400 error - "Cannot book in the past"
```

### Test Invalid Time
```javascript
fetch('http://localhost:5000/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    doctorId: 1,
    appointmentDate: '2024-01-15',
    appointmentTime: '10:15 AM',
    reasonForVisit: 'Regular checkup'
  })
})
.then(r => r.json())
.then(console.log)

// Expected: 400 error - "Invalid time slot"
```

---

## Expected Error Messages

### Doctor Validation
```json
{
  "error": "Invalid doctor",
  "message": "Doctor with ID 999 does not exist. Please select a valid doctor."
}
```

### Date Validation
```json
{
  "error": "Invalid date",
  "message": "Cannot book appointments in the past. Please select a future date."
}
```

### Time Validation
```json
{
  "error": "Invalid time",
  "message": "Invalid time slot \"10:15 AM\". Please select a valid time between 09:00 AM and 04:30 PM.",
  "validTimeSlots": ["09:00 AM", "09:30 AM", ...]
}
```

### Reason Validation
```json
{
  "error": "Invalid reason",
  "message": "Reason for visit must be at least 10 characters long."
}
```

### Conflict Validation
```json
{
  "error": "Slot already booked",
  "message": "This time slot is no longer available. Please choose another time."
}
```

---

## Validation Checklist

### ✅ Doctor Validation
- [ ] Rejects invalid doctor ID
- [ ] Accepts valid doctor ID (1 or 2)
- [ ] Shows clear error message

### ✅ Date Validation
- [ ] Rejects past dates
- [ ] Rejects dates > 30 days ahead
- [ ] Rejects invalid format (01/15/2024)
- [ ] Rejects invalid dates (2024-13-01)
- [ ] Accepts valid future dates
- [ ] Shows clear error messages

### ✅ Time Validation
- [ ] Rejects invalid time slots
- [ ] Rejects wrong format (10:00)
- [ ] Accepts valid slots (09:00 AM - 04:30 PM)
- [ ] Shows list of valid slots in error

### ✅ Reason Validation
- [ ] Rejects < 10 characters
- [ ] Rejects > 500 characters
- [ ] Accepts valid length (10-500)
- [ ] Shows clear error message

### ✅ Conflict Validation
- [ ] Prevents double booking
- [ ] Shows error if slot taken
- [ ] Removes booked slots from availability

---

## Success Indicators

### ✅ Validation Working
- Invalid inputs rejected
- Clear error messages shown
- User guided to correct input
- No system crashes
- No invalid data in database

### ✅ User Experience
- Helpful error messages
- Specific guidance provided
- Quick feedback
- Easy to fix errors
- Smooth booking flow

---

## Quick Test Commands

### Test All Validations
```bash
# 1. Invalid doctor
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-jwt-token-1" \
  -d '{"doctorId":999,"appointmentDate":"2024-01-15","appointmentTime":"10:00 AM","reasonForVisit":"Regular checkup"}'

# 2. Past date
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-jwt-token-1" \
  -d '{"doctorId":1,"appointmentDate":"2023-01-01","appointmentTime":"10:00 AM","reasonForVisit":"Regular checkup"}'

# 3. Invalid time
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-jwt-token-1" \
  -d '{"doctorId":1,"appointmentDate":"2024-01-15","appointmentTime":"10:15 AM","reasonForVisit":"Regular checkup"}'

# 4. Valid booking
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-jwt-token-1" \
  -d '{"doctorId":1,"appointmentDate":"2024-01-15","appointmentTime":"10:00 AM","reasonForVisit":"Regular checkup for annual physical"}'
```

---

## Summary

**Validation Tests**: 6 scenarios
**Coverage**: All input fields
**Error Messages**: Clear and specific
**Status**: ✅ Ready to test

Test the validation at: http://localhost:3001/book-appointment 🚀
