# 🎥 How to Test Call & Video Call Features

## Quick Start Guide

### Step 1: Access the Application
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:5000

### Step 2: Login
Use one of these demo accounts:
- **Patient**: `patient@demo.com` / any password
- **Doctor**: `doctor@demo.com` / any password

### Step 3: Navigate to Messages
- **Patient**: Click "Messages" in the sidebar
- **Doctor**: Click "Messages" in the sidebar

### Step 4: Select a Conversation
- You'll see existing conversations
- Click on any conversation to open the chat

### Step 5: Start a Call

#### For Audio Call 📞
1. Look at the top-right of the chat header
2. Click the **Phone icon** (📞)
3. Call modal will open
4. Watch the call progress:
   - "Connecting..." (1 second)
   - "Ringing..." (2 seconds)
   - Call becomes active with timer

#### For Video Call 📹
1. Look at the top-right of the chat header
2. Click the **Video icon** (📹)
3. Call modal will open with video interface
4. See your video preview in bottom-right corner
5. Watch the call progress same as audio

## Call Controls During Active Call

### Mute/Unmute 🎤
- Click the microphone icon
- Turns **RED** when muted
- Click again to unmute

### Video On/Off 📹 (Video calls only)
- Click the video camera icon
- Turns **RED** when camera is off
- Click again to turn camera back on

### End Call ☎️
- Click the large **RED phone icon** in the center
- Call will end and show "Call Ended"
- Modal closes automatically after 1.5 seconds

### Speaker On/Off 🔊
- Click the speaker icon
- Turns **RED** when speaker is muted
- Click again to unmute speaker

### Fullscreen Mode ⛶
- Click the fullscreen icon (top-right corner)
- Expands call to full screen
- Click minimize icon to exit fullscreen

## Visual Guide

```
Chat Header:
┌────────────────────────────────────────────┐
│ 👤 Dr. Sarah Johnson    📞 📹 ⋮           │
│    Cardiology                              │
└────────────────────────────────────────────┘
     ↑                      ↑  ↑
     Name                   │  └─ Video Call
                            └──── Audio Call

Call Modal (Active):
┌────────────────────────────────────────────┐
│           ⏱️ 02:45                         │
│                                            │
│         👤 Dr. Sarah Johnson               │
│            (Video Preview)                 │
│                                            │
│                          ┌──────┐          │
│                          │ You  │          │
│                          └──────┘          │
├────────────────────────────────────────────┤
│    🎤      📹      ☎️      🔊             │
│   Mute   Video   End    Speaker           │
└────────────────────────────────────────────┘
```

## Testing Scenarios

### Scenario 1: Quick Audio Call
1. Login as patient
2. Go to Messages
3. Select Dr. Sarah Johnson
4. Click phone icon 📞
5. Wait for call to connect
6. Test mute button
7. End call

### Scenario 2: Video Call with Controls
1. Login as doctor
2. Go to Messages
3. Select John Doe
4. Click video icon 📹
5. Wait for call to connect
6. Toggle video off/on
7. Toggle mute
8. Try fullscreen mode
9. End call

### Scenario 3: Multiple Call Types
1. Start an audio call
2. End it
3. Immediately start a video call
4. Test all controls
5. End call

## Expected Behavior

### ✅ What Should Happen
- Call modal opens smoothly
- Status changes: Connecting → Ringing → Active
- Timer starts counting (00:00, 00:01, 00:02...)
- Controls work and show visual feedback
- Red buttons when muted/off
- Call ends gracefully
- Modal closes automatically

### ❌ What Should NOT Happen
- No errors in browser console
- No frozen UI
- No stuck modals
- Controls should not be clickable during connecting/ringing

## Troubleshooting

### Call button doesn't work?
- Make sure you've selected a conversation first
- Check browser console for errors
- Refresh the page and try again

### Modal doesn't close?
- Click the End Call button
- Wait 1.5 seconds for auto-close
- If stuck, refresh the page

### No conversation to select?
- Make sure you're logged in
- Backend should have seed data
- Try registering a new account

## Browser Console

Open browser console (F12) to see:
- Call initiation logs
- State changes
- Any errors

## Demo vs Production

**Current Implementation**: UI Demo
- Simulates call connection
- Shows call interface
- All controls work visually
- No actual audio/video transmission

**Production Would Need**:
- WebRTC integration
- Signaling server
- STUN/TURN servers
- Real media streams
- Call notifications

## Tips for Best Experience

1. **Use Chrome/Edge** for best compatibility
2. **Test in fullscreen** to see the full experience
3. **Try both roles** (patient and doctor)
4. **Test all controls** to see visual feedback
5. **Watch the timer** to see it counting

## Screenshots Locations

When testing, you'll see:
- 📞 Phone icon in chat header (top-right)
- 📹 Video icon next to phone icon
- 🎤 Microphone control in call modal
- 📹 Camera control in call modal
- ☎️ End call button (center, red)
- 🔊 Speaker control in call modal
- ⛶ Fullscreen toggle (top-right of modal)

## Success Indicators

You'll know it's working when:
- ✅ Call modal opens on button click
- ✅ Status text changes automatically
- ✅ Timer starts counting
- ✅ Controls change color when clicked
- ✅ Call ends and modal closes
- ✅ Toast notifications appear

Enjoy testing the call features! 🎉
