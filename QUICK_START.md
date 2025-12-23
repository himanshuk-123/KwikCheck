# Quick Start Guide - Image Upload Implementation

## What Was Done ✅

I've successfully implemented **immediate image upload to server** when users click the Proceed button in the Camera screen. Here's what's been done:

### Files Created:
1. **src/constants/CardApiMapping.ts** - Maps card names to API field names
2. **src/services/UploadImageToServer.ts** - Handles upload logic

### Files Modified:
1. **src/pages/Valuate/index.tsx** - Passes new parameters to Camera
2. **src/components/CustomCamera.tsx** - Calls upload service on Proceed button

---

## What You Need to Do Before Testing

### Step 1: Update Card Mappings ⚠️ **CRITICAL**
Open `src/constants/CardApiMapping.ts` and update the mappings with YOUR actual card names from the Valuate screen:

**Current (Example):**
```typescript
"Odometer Reading": "Odometer",
"Dashboard": "Dashboard",
"Interior Back Side": "InteriorBack",
```

**You Need To:**
1. Check what card names you see in the Valuation screen
2. Check what API field names the server expects
3. Update the mapping accordingly

For example, if your card says "Front Photo" but server expects field "FrontImage":
```typescript
"Front Photo": "FrontImage",
```

---

## How It Works

### User Flow:
```
1. User opens Valuation screen
2. Clicks any card (e.g., "Odometer Reading")
3. Camera opens for that card
4. Takes picture
5. Clicks "Proceed"
   ↓
6. Image saved LOCALLY (existing behavior)
7. GPS location retrieved automatically
8. Image uploaded to server with correct API field name
9. Toast message shows success/failure
10. Screen navigates back
```

### Behind the Scenes:
```
Valuate Screen
├─ Extracts leadId from store
├─ Gets apiFieldName via getApiFieldName()
└─ Navigates to Camera with:
   ├─ cardName: "Odometer Reading"
   ├─ apiFieldName: "Odometer"
   ├─ shouldUploadToServer: true
   └─ leadId: "12345"
        ↓
    Camera Component
    ├─ Receives parameters
    ├─ User takes picture
    ├─ Clicks Proceed
    └─ handleProceed() runs:
       ├─ Saves image locally
       ├─ Gets GPS coordinates
       ├─ Calls uploadImageToServer()
       │  ├─ Reads image file
       │  ├─ Gets TokenID from credentials
       │  ├─ Creates FormData
       │  └─ POSTs to server
       └─ Shows Toast feedback
```

---

## Testing Checklist

### Before You Test:
- [ ] Updated CardApiMapping.ts with your actual card names
- [ ] Have internet connection
- [ ] Verified server endpoint is accessible

### Functional Testing:
- [ ] Click a card from Valuate screen
- [ ] Camera opens
- [ ] Take a picture
- [ ] Click Proceed
- [ ] See Toast message appear
- [ ] Screen goes back to Valuate
- [ ] **Check server received the image**

### Verify Server Received Image:
1. Go to your server API endpoint: `/App/webservice/DocumentUploadOtherImage`
2. Check the database for the uploaded image
3. Verify the field name is correct (e.g., "Odometer" field has the image)
4. Check LeadId matches the vehicle ID

### Error Testing:
- [ ] Disconnect internet and click Proceed
  - Should show: "Error uploading {CardName}. Check connection."
- [ ] Check location is disabled
  - Should still upload with latitude: 0, longitude: 0

---

## Common Issues & Solutions

### Issue: "Upload failed. Will retry later."
**Cause:** Usually network error or server error
**Solution:**
1. Check internet connection
2. Check server endpoint is correct
3. Check TokenID is valid
4. Look in console for detailed error

### Issue: Toast says "Uploading..." but nothing happens
**Cause:** Toast is just notification, upload happens in background
**Solution:**
1. Wait a few seconds
2. Check console for logs
3. Check if image actually uploaded to server

### Issue: "Authentication error" or token error
**Cause:** TokenID not found
**Solution:**
1. Verify user is logged in
2. Check credentials are saved in LocalStorage
3. Check `TOKENID` field exists in user_credentials

### Issue: Wrong field name being sent to server
**Cause:** CardApiMapping not updated with your card names
**Solution:**
1. Check CardApiMapping.ts
2. Verify mappings match your card names exactly
3. Update CardApiMapping.ts and save
4. Test again

---

## Key Files for Reference

### CardApiMapping.ts (Card Name Mappings)
Location: `src/constants/CardApiMapping.ts`
```typescript
const CARD_API_MAPPING: Record<string, string> = {
  "Your Card Name": "YourApiFieldName",
};
```

### UploadImageToServer.ts (Upload Logic)
Location: `src/services/UploadImageToServer.ts`
- Handles reading local image
- Creates FormData
- POSTs to server
- Returns success/error

### CustomCamera.tsx (Uses Upload Service)
Location: `src/components/CustomCamera.tsx`
- handleProceed() now calls uploadImageToServer()
- Gets GPS location
- Shows Toast feedback

### Valuate/index.tsx (Passes Parameters)
Location: `src/pages/Valuate/index.tsx`
- Extracts apiFieldName via getApiFieldName()
- Passes to Camera component

---

## Console Debugging

### Enable Console Logs:
```
React Native Debugger → Tools → Toggle Dev Menu
Select "Show JS Errors" and "Show Network Requests"
```

### Look for These Logs:
```
✅ Successfully uploaded Dashboard for Lead 12345
   → Upload worked!

⚠️ Upload failed for Odometer: Image file not found
   → File issue - check local save

❌ Error uploading Dashboard to server: Network error
   → Network issue - check connection

Starting image upload to server...
   → Upload started (should appear when you click Proceed)

FormData created successfully
   → FormData ready to send

Upload successful: {...}
   → Server accepted request
```

---

## API Request Format (for Reference)

**Endpoint:** POST `/App/webservice/DocumentUploadOtherImage`

**FormData:**
```
LeadId: "12345"
Version: "2"
Latitude: "28.7041"
Longitude: "77.1025"
Timestamp: "12/15/2024, 3:30:45 PM"
TokenID: "auth_token_from_credentials"
Odometer: [IMAGE_FILE]          ← File data
Odometer: "1702134567890.jpg"   ← Filename
```

**Important:** The field name (e.g., "Odometer") appears TWICE - once with file, once with filename

---

## Next Steps After Testing

### If Upload Works:
1. ✅ Implementation is complete!
2. Optional: Add database tracking to mark images as uploaded
3. Optional: Add retry logic for failed uploads

### If Upload Fails:
1. Check console logs for specific error
2. Verify CardApiMapping matches your cards
3. Verify server endpoint is accessible
4. Check network connection

---

## Support & Questions

If something doesn't work:

1. **Check console logs first** - they usually tell what's wrong
2. **Verify CardApiMapping** - most issues are wrong card names
3. **Check network** - if offline, upload will fail gracefully
4. **Verify TokenID** - must be in user_credentials
5. **Check server logs** - see what error server returned

---

## Final Checklist

Before considering this complete:
- [ ] CardApiMapping.ts updated with YOUR card names
- [ ] Tested upload for at least one card
- [ ] Toast messages appearing
- [ ] Checked server received the image
- [ ] Tested error scenario (offline)
- [ ] No app crashes

**When all checked: Implementation is COMPLETE!** 🎉

---

## Summary

**What's New:**
✅ Click card → take picture → Proceed → image uploads immediately
✅ No waiting for "Next" button
✅ Background upload (doesn't block UI)
✅ Toast feedback for user
✅ GPS location included automatically
✅ Error handling for all scenarios

**What's Required:**
⚠️ Update CardApiMapping with your card names
⚠️ Test one upload to verify it works

**Status:** Ready to test! 🚀
