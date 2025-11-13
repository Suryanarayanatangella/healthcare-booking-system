# Settings Module - Quick Test Guide

## Quick Access
```
URL: http://localhost:3001/settings
Login: patient@demo.com / password123
```

## 30-Second Test

### 1. Profile Tab (10 seconds)
- Change first name to "Jane"
- Change last name to "Smith"
- Click "Save Changes"
- ✅ See success toast

### 2. Notifications Tab (5 seconds)
- Toggle "SMS Notifications" ON
- Click "Save Changes"
- ✅ See success toast

### 3. Security Tab (10 seconds)
- Current Password: "password123"
- New Password: "newpass123"
- Confirm Password: "newpass123"
- Click "Update Password"
- ✅ See success toast
- ✅ Fields clear automatically

### 4. Privacy Tab (5 seconds)
- Toggle "Show Email" ON
- Click "Save Changes"
- ✅ See success toast

### 5. Preferences Tab (5 seconds)
- Change Language to "Spanish"
- Click "Save Changes"
- ✅ See success toast

### 6. Data Export (3 seconds)
- Click "Export Data" in sidebar
- ✅ JSON file downloads

### 7. Delete Account (2 seconds)
- Click "Delete Account" in sidebar
- ✅ Modal appears
- Click "Cancel"
- ✅ Modal closes

## Expected Results

All operations should:
- ✅ Show loading state while saving
- ✅ Display success toast on completion
- ✅ Update UI immediately
- ✅ Persist data (refresh page to verify)

## Visual Checklist

### UI Elements Present
- ✅ 5 tabs in sidebar (Profile, Notifications, Security, Privacy, Preferences)
- ✅ "Export Data" button in sidebar
- ✅ "Delete Account" button in sidebar
- ✅ "Save Changes" button in each tab
- ✅ Form inputs styled correctly
- ✅ Toggle switches work smoothly
- ✅ Icons display properly

### Interactions Work
- ✅ Tab switching is instant
- ✅ Form inputs update in real-time
- ✅ Toggles animate smoothly
- ✅ Buttons show hover effects
- ✅ Loading states display
- ✅ Toasts appear and disappear
- ✅ Modal opens and closes

### Responsive Design
- ✅ Desktop view (sidebar + content)
- ✅ Tablet view (stacked layout)
- ✅ Mobile view (full width)

## Backend Verification

Test endpoints directly:

```bash
# Get settings
curl -X GET http://localhost:5000/api/settings \
  -H "Authorization: Bearer demo-jwt-token-1"

# Update profile
curl -X PUT http://localhost:5000/api/settings/profile \
  -H "Authorization: Bearer demo-jwt-token-1" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Smith"}'
```

## Common Issues

### Settings not loading
**Solution**: Refresh page, check backend is running

### Changes not saving
**Solution**: Check network tab, verify authentication

### Toast not appearing
**Solution**: Check browser console for errors

## Success Criteria

✅ All 5 tabs accessible
✅ All forms submit successfully
✅ Success toasts appear
✅ Data persists after refresh
✅ Export downloads file
✅ Delete modal works
✅ No console errors
✅ Responsive on all devices

## Time to Complete
- Full test: ~2 minutes
- Quick smoke test: ~30 seconds

## Next Steps

After testing Settings:
1. Test Profile page integration
2. Test theme switching
3. Test language switching
4. Test notification preferences in action
