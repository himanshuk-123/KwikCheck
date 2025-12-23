# Image Upload API Integration in handleProceed - Implementation Guide

## Overview
This document explains how to implement direct API integration in the `handleProceed` button so that images are uploaded to the server immediately after being saved locally, instead of waiting for the "Next" button on the Valuation screen.

---

## 📌 Current Flow vs. New Flow

### **CURRENT FLOW:**
```
Valuation Screen
    ↓
Camera Screen (user clicks image)
    ↓
handleProceed()
    ↓
Save Image Locally → Navigate Back to Valuation
    ↓
User clicks "Next" button
    ↓
handleNextClick() → Upload all images to server
```

### **NEW FLOW (REQUIRED):**
```
Valuation Screen (user clicks card)
    ↓
Navigate to Camera with dynamic card data
    ↓
Camera Screen (user clicks image)
    ↓
handleProceed()
    ├─ Save Image Locally ✓
    ├─ Get Image URI ✓
    ├─ Call API immediately ← NEW
    │   └─ POST to DocumentUploadOtherImage
    │   └─ Send with dynamic parameters
    └─ Navigate Back to Valuation with success/error status
```

---

## 🔄 Step-by-Step Implementation Guide

### **Step 1: Extend Route Parameters Passed to Camera Screen**

**Location:** `src/pages/Valuate/index.tsx` - In the `ValuateCard` component

**Current Code:**
```typescript
navigation.navigate("Camera", {
  id: id,
  side: text,
  isDone,
  vehicleType,
});
```

**What You Need to Add:**
When user clicks on any card (Odometer, Dashboard, Interior Back, etc.), pass additional parameters:

```typescript
navigation.navigate("Camera", {
  id: id,
  side: text,                    // e.g., "Odometer Reading"
  isDone,
  vehicleType,
  
  // NEW PARAMETERS FOR API INTEGRATION
  cardName: text,                // e.g., "Odometer Reading"
  apiFieldName: text,            // e.g., "Odometer" (dynamic, used as form field)
  shouldUploadToServer: true,    // Flag to enable server upload
  leadId: carId,                 // LeadId from current lead
});
```

**Key Point:**
- You need to determine the API field name based on the card name
- Example mapping:
  ```
  "Odometer Reading" → apiFieldName: "Odometer"
  "Dashboard" → apiFieldName: "Dashboard"
  "Interior Back Side" → apiFieldName: "InteriorBack"
  ```

---

### **Step 2: Create Card Configuration Mapping**

**Location:** `src/constants/` (create new file or add to existing)

**File Name:** `CardApiMapping.ts`

**Purpose:** Map card names to their corresponding API field names

```typescript
// This mapping tells the app which API field name to use for each card
const CARD_API_MAPPING: Record<string, string> = {
  "Odometer Reading": "Odometer",
  "Dashboard": "Dashboard",
  "Interior Back Side": "InteriorBack",
  "Engine Image": "Engine",
  "Chassis Imprint Image": "ChassisImprint",
  "Front Side": "FrontImage",
  "Right Side": "RightImage",
  "Back Side": "BackImage",
  "Left Side": "LeftImage",
  // ... add all card names and their corresponding API field names
};

export const getApiFieldName = (cardName: string): string => {
  return CARD_API_MAPPING[cardName] || cardName;
};
```

**Why This is Important:**
- Keeps API field names consistent
- Easy to maintain and update
- Reduces hardcoding in components

---

### **Step 3: Receive Parameters in CustomCamera Component**

**Location:** `src/components/CustomCamera.tsx`

**What You Need to Do:**

```typescript
export default function CustomCamera({
  id = "",
  side,
  isDone,
  vehicleType,
  
  // NEW PARAMETERS
  cardName = "",           // e.g., "Odometer Reading"
  apiFieldName = "",       // e.g., "Odometer"
  shouldUploadToServer = false,
  leadId = "",             // For API call
}: {
  id: string;
  side: string;
  isDone?: string;
  vehicleType: string;
  
  // NEW TYPES
  cardName?: string;
  apiFieldName?: string;
  shouldUploadToServer?: boolean;
  leadId?: string;
}) {
  // ... rest of component
}
```

---

### **Step 4: Modify handleProceed to Include API Upload**

**Location:** `src/components/CustomCamera.tsx` - `handleProceed()` function

**Current Logic:**
```typescript
const handleProceed = async () => {
  if (!preview) return;
  
  // Save locally + navigate back
  // Upload happens later on Valuation screen
};
```

**New Logic You Need to Implement:**

```typescript
const handleProceed = async () => {
  if (!preview) return;

  setIsProceeding(true);

  try {
    // STEP 1: Save image locally (existing code)
    const imgPath = await HandleSaveImage({
      uri: preview,
      id,
      side,
      removePreviousImage: Boolean(isDone),
    });

    // STEP 2: Get location (existing code)
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    // STEP 3: NEW - Upload to server immediately
    if (shouldUploadToServer && apiFieldName && leadId) {
      await uploadImageToServer({
        imagePath: imgPath,
        leadId: leadId,
        apiFieldName: apiFieldName,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }

    // STEP 4: Navigate back to Valuation screen
    navigation.navigate("Valuation", {
      id,
      imgUrl: preview,
      side: side,
      vehicleType,
      uploadSuccess: true,  // Indicate upload was successful
    });

  } catch (error) {
    console.error(error);
    ToastAndroid.show(
      "Error: " + (error as any).message,
      ToastAndroid.LONG
    );
    setIsProceeding(false);
  }
};
```

---

### **Step 5: Create New Upload Function**

**Location:** `src/services/Slices/` or `src/Utils/` (create new file)

**File Name:** `UploadImageToServer.ts`

**Purpose:** Handle immediate image upload to server

```typescript
/**
 * Upload image to server immediately after local save
 * Called from handleProceed button
 */
export const uploadImageToServer = async ({
  imagePath,           // Local file path (e.g., /data/.../photos/1702134567890.jpg)
  leadId,              // Lead ID
  apiFieldName,        // Dynamic field name (e.g., "Odometer", "Dashboard")
  latitude,            // GPS latitude
  longitude,           // GPS longitude
}: {
  imagePath: string;
  leadId: string;
  apiFieldName: string;
  latitude: number;
  longitude: number;
}) => {
  try {
    // STEP 1: Read image from local storage as base64 or uri
    const { uri } = await FileSystem.getInfoAsync(imagePath);

    // STEP 2: Create FormData with all required parameters
    const formData = new FormData();
    
    // Get the filename (e.g., "1702134567890.jpg")
    const fileName = uri.split('/').pop() || `${apiFieldName}.jpg`;
    
    // Append basic parameters
    formData.append("LeadId", leadId);
    formData.append("Version", "2");
    
    // Append metadata
    formData.append('Latitude', latitude.toString());
    formData.append('Longitude', longitude.toString());
    formData.append('Timestamp', new Date().toLocaleString());
    
    // Append TokenID (get from store/context)
    const tokenId = await getTokenId();  // Retrieve from secure storage
    formData.append('TokenID', tokenId);
    
    // Append file with dynamic field name (e.g., "Odometer")
    formData.append(apiFieldName, {
      type: 'image/jpg',
      name: fileName,
      uri: uri,
    } as any);
    
    // Append filename string again with same dynamic field name
    // (Backend uses this to identify which card's image)
    formData.append(apiFieldName, fileName);

    // STEP 3: Send to server
    const response = await postWithFormData({
      service: `/App/webservice/DocumentUploadOtherImage`,
      body: formData,
      headers: {
        Version: "2",
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Upload successful:", response);
    return response;

  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(`Failed to upload image: ${(error as any).message}`);
  }
};
```

---

### **Step 6: Understand the API Request Structure**

**API Endpoint:**
```
POST {BASE_URL}/App/webservice/DocumentUploadOtherImage
```

**FormData Parameters:**

```
LeadId           → "12345"           (The lead/vehicle ID)
Version          → "2"               (API version)
Latitude         → "28.5244"         (GPS coordinate)
Longitude        → "77.1855"         (GPS coordinate)
Timestamp        → "2025-12-16..."   (When image was captured)
TokenID          → "auth_token_xyz"  (Authentication token)
Odometer         → [binary image]    (Actual file data - FIRST with dynamic field name)
Odometer         → "xyz.jpg"         (Filename string - SECOND with same dynamic field name)

Note: The dynamic field name (e.g., "Odometer") appears TWICE:
- First: Contains the actual image file (multipart file)
- Second: Contains just the filename as a string (for backend identification)
```

**Example Request (pseudocode):**
```typescript
// When user clicks "Odometer Reading" card:
POST /App/webservice/DocumentUploadOtherImage
Content-Type: multipart/form-data

Form Fields:
- LeadId: "12345"
- Version: "2"
- Latitude: "28.5244"
- Longitude: "77.1855"
- Timestamp: "2025-12-16 10:30:45"
- TokenID: "auth_token_xyz"
- Odometer: [binary image data]        (File upload with dynamic field name)
- Odometer: "xyz.jpg"                 (Filename as string with same field name)

// Backend receives:
// - Image file from first Odometer field
// - Filename "xyz.jpg" from second Odometer field
// - Stores in database table/column: Odometer
```

---

### **Step 7: Get TokenID from Secure Storage**

**Location:** Need to determine where TokenID is stored

```typescript
// Option 1: From Redux/Zustand store
const getTokenId = async () => {
  const token = useZustandStore.getState().authToken;
  if (!token) throw new Error("Authentication token not found");
  return token;
};

// Option 2: From SecureStore (for sensitive data)
import * as SecureStore from 'expo-secure-store';

const getTokenId = async () => {
  const token = await SecureStore.getItemAsync('authToken');
  if (!token) throw new Error("Authentication token not found");
  return token;
};

// Option 3: From AsyncStorage
import AsyncStorage from '@react-native-async-community/async-storage';

const getTokenId = async () => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error("Authentication token not found");
  return token;
};
```

---

### **Step 8: Error Handling and User Feedback**

**What Can Go Wrong:**

```typescript
// 1. Image save failed
if (!imgPath) {
  throw new Error("Failed to save image locally");
}

// 2. Network error (user offline)
try {
  await uploadImageToServer(...);
} catch (error) {
  if (error.message.includes("Network")) {
    ToastAndroid.show(
      "No internet connection. Image saved locally. Will upload when online.",
      ToastAndroid.LONG
    );
    // Still navigate back, mark for later upload
  }
}

// 3. Server error (500, 403, etc)
// Implement retry logic

// 4. Timeout
// Set timeout threshold, retry with exponential backoff
```

---

### **Step 9: Track Upload Status**

**Update SQLite Database:**

When upload succeeds, update the `isUploaded` field in the database:

```typescript
// After successful server upload
await db.runAsync(
  `UPDATE images_uploaded_status 
   SET isUploaded = 1 
   WHERE uri = ? AND leadId = ?`,
  [imagePath, leadId]
);
```

---

### **Step 10: Handle Network Failures**

**What If User is Offline?**

```typescript
const handleProceed = async () => {
  try {
    // Save locally first (always succeeds)
    const imgPath = await HandleSaveImage({...});

    // Try to upload to server
    try {
      await uploadImageToServer({...});
      ToastAndroid.show("Image uploaded successfully", ToastAndroid.SHORT);
    } catch (uploadError) {
      // If upload fails due to network, still save locally
      // Mark in DB as "pending upload"
      ToastAndroid.show(
        "Image saved. Will upload when online.",
        ToastAndroid.LONG
      );
      
      // Store in "pending uploads" queue
      await StorePendingUpload({
        imagePath: imgPath,
        leadId: leadId,
        apiFieldName: apiFieldName,
      });
    }

    // Navigate back (upload success or failure)
    navigation.navigate("Valuation", {...});

  } catch (error) {
    // Local save failed - critical error
    ToastAndroid.show("Failed to save image", ToastAndroid.LONG);
  }
};
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│         VALUATION SCREEN                    │
│  (Cards: Odometer, Dashboard, Engine, etc) │
└────────────────┬────────────────────────────┘
                 │ Click on card
                 │ Pass: cardName, apiFieldName
                 ▼
┌─────────────────────────────────────────────┐
│      CUSTOM CAMERA COMPONENT                │
│  Receives: cardName, apiFieldName,          │
│           shouldUploadToServer              │
└────────────────┬────────────────────────────┘
                 │ User captures + clicks Proceed
                 ▼
┌─────────────────────────────────────────────┐
│       HANDLE PROCEED FUNCTION               │
│                                             │
│  1. Save Image Locally                      │
│  2. Get Location (GPS)                      │
│  3. IF shouldUploadToServer                 │
│     └─ Call uploadImageToServer()           │
│  4. Navigate Back to Valuation              │
└────────────────┬────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌──────────────┐     ┌──────────────────────┐
│  expo-file   │     │uploadImageToServer() │
│  system      │     │                      │
│              │     │ 1. Read image        │
│ Save locally │     │ 2. Create FormData   │
└──────────────┘     │ 3. POST to API       │
                     └──────────┬───────────┘
                                │
                                ▼
                        ┌────────────────┐
                        │  API ENDPOINT  │
                        │ Document       │
                        │ UploadOther    │
                        │ Image          │
                        └────────────────┘
                                │
                                ▼
                        ┌────────────────┐
                        │  SERVER        │
                        │ Saves image    │
                        │ in DB with     │
                        │ field name     │
                        │ (CardName)     │
                        └────────────────┘
```

---

## 📝 Required Code Changes Summary

### **Files You Need to Modify:**

1. **`src/pages/Valuate/index.tsx`**
   - Add `cardName` and `apiFieldName` to navigation params
   - Get these values from the card being clicked

2. **`src/components/CustomCamera.tsx`**
   - Accept new route parameters
   - Modify `handleProceed()` to call API immediately
   - Add error handling for upload failures

3. **`src/constants/` (new or existing)**
   - Create/update card to API field mapping
   - Keep all card names consistent

### **Files You Need to Create:**

1. **`src/services/UploadImageToServer.ts`** (or in Slices folder)
   - New function for immediate image upload
   - Handle FormData creation
   - API integration logic

2. **`src/constants/CardApiMapping.ts`** (optional but recommended)
   - Card name to API field name mapping
   - Makes maintenance easier

---

## 🔑 Key Concepts to Understand

### **1. Dynamic Field Names**
```typescript
// The field name changes based on which card user clicks
Odometer Reading → Odometer
Dashboard → Dashboard
Engine Image → Engine

// Sent in FormData as (APPEARS TWICE):
// First time - with the file:
formData.append(apiFieldName, { type: 'image/jpg', name: fileName, uri: uri });
// Result: "Odometer": [binary image data]

// Second time - with the filename:
formData.append(apiFieldName, fileName);
// Result: "Odometer": "xyz.jpg"
```

### **2. Dynamic Field Name Appears Twice**
```typescript
// The same field name is sent TWICE in FormData:

// FIRST: With the actual image file
formData.append("Odometer", {
  type: 'image/jpg',
  name: 'xyz.jpg',
  uri: '/data/.../photos/1702134567890.jpg'
});

// SECOND: With just the filename string (for backend identification)
formData.append("Odometer", "xyz.jpg");

// Backend uses the field name ("Odometer") and filename to:
// - Identify which card's image it is
// - Save in correct database column/table
```

### **3. Timing of Upload**
```typescript
// OLD: Upload when user finishes ALL images
// NEW: Upload EACH image immediately after capture

// Benefits:
// - Immediate confirmation to user
// - No need to wait for "Next" button
// - Can retry individual images if failed
```

---

## ✅ Implementation Checklist

- [ ] Create card-to-API-field mapping (`CardApiMapping.ts`)
- [ ] Update Valuation screen to pass `cardName` and `apiFieldName` to Camera
- [ ] Update CustomCamera component to receive new parameters
- [ ] Modify `handleProceed()` to check `shouldUploadToServer` flag
- [ ] Create `uploadImageToServer()` function
- [ ] Implement error handling for network failures
- [ ] Handle offline scenarios (queue for later upload)
- [ ] Update database to mark image as uploaded (isUploaded = 1)
- [ ] Test with single card first, then all cards
- [ ] Add user feedback (Toast messages for success/failure)
- [ ] Implement retry logic for failed uploads
- [ ] Add TokenID retrieval from auth store

---

## 🧪 Testing Approach

### **Test Scenario 1: Single Card Upload (Happy Path)**
1. Valuation screen has cards: Odometer, Dashboard, Engine
2. Click Odometer card
3. Take image and click Proceed
4. Image saves locally
5. API call sends image to server
6. Navigate back to Valuation with success status
7. Verify image in server database

### **Test Scenario 2: Multiple Cards**
1. Upload Odometer image
2. Upload Dashboard image
3. Upload Engine image
4. Verify all three images in database

### **Test Scenario 3: Network Failure**
1. Enable airplane mode
2. Take image and click Proceed
3. Local save succeeds
4. Upload fails
5. Show message: "Image saved, will upload when online"
6. Disable airplane mode
7. Retry upload

### **Test Scenario 4: Wrong API Field Name**
1. Send with wrong field name
2. Server should reject or save incorrectly
3. Backend error handling

---

## 📚 API Contract (Confirm with Backend Team)

**Endpoint:** `POST /App/webservice/DocumentUploadOtherImage`

**Required Parameters:**
- `LeadId` (string)
- `Version` (string, value: "2")
- `{DYNAMIC_FIELD_NAME}` (file, e.g., "Odometer") - THE ACTUAL IMAGE FILE
- `{DYNAMIC_FIELD_NAME}` (string, e.g., "xyz.jpg") - THE FILENAME STRING (same field name, appears again)
- `Latitude` (string/number)
- `Longitude` (string/number)
- `Timestamp` (string)
- `TokenID` (string)

**Expected Response:**
```json
{
  "success": true/false,
  "message": "Image uploaded successfully" or error message,
  "imageId": "xxx",
  "uploadedAt": "2025-12-16T10:30:00Z",
  "cardName": "Odometer",
  "fileName": "xyz.jpg"
}
```

---

## 💡 Tips for Implementation

1. **Start Simple:** Implement for one card first, test thoroughly
2. **Error Handling:** Prioritize error messages and user feedback
3. **Offline Support:** Queue failed uploads for retry when online
4. **Logging:** Add console logs at each step for debugging
5. **Performance:** Images are compressed (quality: 0.5), uploads should be fast
6. **State Management:** Update upload status in Zustand store if needed
7. **UX:** Show loading indicator while uploading
8. **Retry Logic:** Implement exponential backoff for failed uploads

---

## 🎯 Expected Outcome

After implementation:
- User clicks card (e.g., "Odometer Reading")
- Camera opens
- User captures image
- Clicks "Proceed"
- Image saves locally AND uploads to server immediately
- Success/error message shown
- Navigate back to Valuation screen
- Card shows checkmark or "Uploaded" status
- User can capture next card

**No need to click "Next" button to trigger uploads - each image is uploaded immediately!**

---

