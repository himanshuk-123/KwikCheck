# Complete Image Capture and Upload Flow - KwikCheck App

## Overview
This document explains the complete flow of how images are captured using the camera, stored locally, and then uploaded to the server in the KwikCheck app. This is a React Native/Expo app that follows a multi-step process for image handling.

---

## 📱 Step-by-Step Flow

### **Step 1: User Navigates to Camera Screen (Valuation Screen)**

**Location:** `src/pages/Valuate/index.tsx`

When a user clicks on any of the side images (Front Side, Right Side, Back Side, etc.) in the Valuation screen:

```typescript
const HandleClick = () => {
  // Navigate to Camera screen with parameters
  navigation.navigate("Camera", {
    id: id,              // Vehicle/Lead ID
    side: text,          // Which side (e.g., "Front Side")
    isDone,              // Previous image URI if exists
    vehicleType,         // Type of vehicle (2W, 3W, 4W, etc.)
  });
};
```

**Parameters passed:**
- `id`: Unique identifier for the lead/vehicle
- `side`: Which side of vehicle is being captured
- `isDone`: URI of previously captured image (if any)
- `vehicleType`: Type of vehicle (affects which images are required)

---

### **Step 2: Camera Component Initialization**

**Location:** `src/components/CustomCamera.tsx`

#### 2.1 Camera Setup
```typescript
const CameraRef = useRef<CameraView>(null);  // Reference to camera
const [facing, setFacing] = useState<CameraType>("back");  // back or front camera
const [preview, setPreview] = useState<string | undefined>("");  // preview image URI
```

#### 2.2 Decide Camera Facing
```typescript
const decideCameraFacing = () => {
  if (side.toLowerCase().includes("selfie")) {
    setFacing("front");  // Front camera for selfie shots
  }
};
```

#### 2.3 Camera Permissions
```typescript
const [permission, requestPermission] = useCameraPermissions({
  request: true,  // Request permission if not already granted
});
```

**Packages Used for Camera:**
- `expo-camera` - Provides the `CameraView` component and camera functionality
- `@react-native-camera/camera` - Optional alternative

---

### **Step 3: User Captures Image**

**Location:** `src/components/CustomCamera.tsx` - `handlePreview()` function

#### 3.1 Taking the Picture
```typescript
async function handlePreview() {
  try {
    const data = await CameraRef.current?.takePictureAsync({
      quality: 0.5,        // Compress image to 50% quality
      skipProcessing: true // Skip any image processing
    });

    if (data?.uri) {
      setPreview(data?.uri);  // Set preview state with image URI
    }
  } catch (error) {
    console.log("Error taking picture : ", error);
  }
}
```

#### 3.2 Understanding Image URI

**What is Image URI?**
- After `takePictureAsync()`, the camera returns an object with `uri` property
- The `uri` is a temporary file path where the image is stored in the device's cache
- Example: `file:///data/user/0/com.example.app/cache/temp-image-xxxxx.jpg`

**Key Points:**
- This is a **temporary location** - the image is in device cache/temporary storage
- The image exists only in memory at this point
- We need to move/copy it to permanent storage (app's document directory)

---

### **Step 4: User Reviews Preview and Clicks "Proceed"**

**Location:** `src/components/CustomCamera.tsx` - `handleProceed()` function

When the user clicks the "Proceed" button after reviewing the preview:

```typescript
const handleProceed = async () => {
  if (!preview) return;  // Exit if no preview image

  const isQuestionToShowModal = !!isQuestionForSide();
  setUploadingSide(side, true);  // Mark this side as uploading

  // Fast navigation to next screen
  navigation.navigate("Valuation", {
    id,
    imgUrl: preview,           // Preview image URI
    showModal: isQuestionToShowModal,
    side,
    vehicleType,
  });

  // Handle previous image deletion
  if (isDone) {
    await removePictureToLocalStorage(isDone);
  }

  // Reset screen orientation
  await resetOrientation();

  // Background upload process (happens after navigation)
  setTimeout(() => {
    handleWithErrorReporting(async () => {
      // ... save and upload logic ...
    });
  }, 200);
};
```

**What's happening:**
1. User navigates back to Valuation screen immediately (fast UX)
2. Image saving and upload happen in the background
3. Previous image is deleted if it exists

---

### **Step 5: Save Image to Local Storage**

**Location:** `src/Utils/imageHandlers.ts`

#### 5.1 HandleSaveImage Function
```typescript
const HandleSaveImage = async ({
  uri,           // Temporary image URI from camera
  side,          // Side name
  id,            // Lead ID
  removePreviousImage,
}: HandleSaveImageTypes) => {
  try {
    FullPageLoader.open({
      label: "Saving image...",
    });

    // Copy image from temporary location to permanent storage
    const imgUrl = await savePictureToLocalStorage(uri);

    // Store metadata in async storage
    await HandleStoreDataToAsyncStore({
      imgUrl,    // New permanent path
      side,
      id,
      totalLength,
    });

    return imgUrl;  // Return new permanent path
  } finally {
    FullPageLoader.close();
  }
};
```

#### 5.2 Save Picture to Local Storage
```typescript
const savePictureToLocalStorage = async (uri: string) => {
  try {
    // Use expo-file-system for file operations
    import * as FileSystem from 'expo-file-system/legacy';

    // Create photos directory in app's document directory
    const dir = FileSystem.documentDirectory + 'photos/';
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

    // Generate unique filename with timestamp
    const fileName = `${Date.now()}.jpg`;
    const dest = dir + fileName;

    // Copy image from temporary cache to permanent storage
    await FileSystem.copyAsync({ from: uri, to: dest });

    console.log(`Photo saved to ${dest}`);
    return dest;  // Return permanent path
  } catch (err) {
    console.error('savePictureToLocalStorage error', err);
    throw err;
  }
};
```

**Packages Used:**
- `expo-file-system` - File system operations
  - `documentDirectory` - App's persistent storage location
  - `makeDirectoryAsync()` - Create directories
  - `copyAsync()` - Copy files from temp to permanent location

**File Storage Path:**
```
Android: /data/data/com.example.kwikcheck/files/photos/
iOS: /Documents/photos/

Example path: /data/data/com.example.kwikcheck/files/photos/1702134567890.jpg
```

---

### **Step 6: Store Image Metadata**

**Location:** `src/db/HandleStoreData.ts`

#### 6.1 HandleStoreDataToAsyncStore Function

```typescript
export interface LocalDataType {
  id: string;                    // Lead/Vehicle ID
  side: Side[];                  // Array of sides with images
  totalLength: number;           // Total sides to capture
}

export interface Side {
  type: string;                  // Side name (e.g., "Front Side")
  img: string;                   // Image path
  questions?: Question[];        // Optional questions for this side
}

export const HandleStoreDataToAsyncStore = async (data) => {
  // Get existing data from AsyncStorage
  const localData = await LocalStorage.get("sync_queue");

  // If no data exists, create new entry
  if (!Object.keys(localData).length) {
    return await LocalStorage.set("sync_queue", [
      {
        id: data.id,
        side: [
          {
            type: data.side,
            img: data.imgUrl,
          },
        ],
      },
    ]);
  }

  // If lead ID already exists, update the side array
  const allIds = localData.map((item) => item.id);
  
  if (!allIds.includes(data.id)) {
    // New lead ID - add new entry
    localData.push({
      id: data.id,
      side: [
        {
          type: data.side,
          img: data.imgUrl,
        },
      ],
      totalLength: data.totalLength,
    });
  } else {
    // Existing lead ID - update or add side
    const index = allIds.indexOf(data.id);
    const sideIndex = localData[index].side.findIndex(
      (item) => item.type === data.side
    );

    if (sideIndex !== -1) {
      // Side exists - replace image
      localData[index].side[sideIndex] = {
        type: data.side,
        img: data.imgUrl,
        questions: [],
      };
    } else {
      // Side doesn't exist - add new side
      localData[index].side.push({
        type: data.side,
        img: data.imgUrl,
        questions: [],
      });
    }
  }

  // Save updated data
  await LocalStorage.set("sync_queue", localData);
};
```

**Storage Used:**
- `AsyncStorage` (from @react-native-async-community/async-storage)
- Key: `"sync_queue"`
- Format: JSON array of lead objects with sides and image paths

**Example Data Structure:**
```json
[
  {
    "id": "lead123",
    "totalLength": 6,
    "side": [
      {
        "type": "Front Side",
        "img": "/data/data/com.example.kwikcheck/files/photos/1702134567890.jpg"
      },
      {
        "type": "Right Side",
        "img": "/data/data/com.example.kwikcheck/files/photos/1702134567891.jpg"
      }
    ]
  }
]
```

---

### **Step 7: Store Image in SQLite Database**

**Location:** `src/db/uploadStatusDb.ts`

#### 7.1 Database Schema
```typescript
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS images_uploaded_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      identifier TEXT NOT NULL UNIQUE,
      leadId TEXT NOT NULL, 
      step TEXT NOT NULL,
      uri TEXT,                    // Local file path
      isUploaded INTEGER DEFAULT 0, // 0 = not uploaded, 1 = uploaded
      vehicleType TEXT,
      imgUrl TEXT,                 // Local image path
      side TEXT,
      regNo TEXT,
      prospectNo TEXT,
      lastValuated TEXT,
      latitude TEXT,
      longitude TEXT
  );
`);
```

#### 7.2 Insert Image Data with Location
```typescript
export const getLocationAndInsertInDB = async ({
  imgPath,
  side,
}: {
  imgPath: string;
  side: string;
}) => {
  // Get current GPS location
  let location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
  });

  // Insert into SQLite database
  await insertImagesUploadedStatusDB({
    leadUId: myTaskValuate.data.LeadUId,
    leadId: myTaskValuate.data.LeadId,
    uri: imgPath,                    // Local path
    step: toCamelCase(side),
    vehicleType: myTaskValuate.data.VehicleType.toString(),
    imgUrl: imgPath,
    side: toCamelCase(side),
    lastValuated: new Date().toLocaleString(),
    regNo: myTaskValuate.data.RegNo,
    prospectNo: myTaskValuate.data.ProspectNo,
    latitude: location.coords.latitude.toString(),
    longitude: location.coords.longitude.toString(),
  });
};
```

**Database Used:**
- `expo-sqlite` - SQLite database for React Native
- Database name: `upload_status.db`
- Stores: Image metadata, location, upload status

---

### **Step 8: Upload Image to Server**

**Location:** `src/pages/Valuate/index.tsx` - `handleNextClick()` function

#### 8.1 Get Not Uploaded Images
```typescript
const handleNextClick = async () => {
  // Get all images that haven't been uploaded yet
  const notUploadedImages = getNotUploadedImageWithLeadId({
    leadId: myTaskValuate.data.LeadId?.toString(),
  });

  FullPageLoader.open({
    label: "Uploading Images",
  });

  // Upload all not uploaded images in parallel
  await Promise.all(
    notUploadedImages.map((lead) =>
      HandleValuationUpload({
        base64String: lead.uri,      // Local file path
        paramName: AppStepListState.find(
          (item) => toCamelCase(item.Name) === lead.step
        ).Appcolumn,
        LeadId: myTaskValuate.data.Id.toString(),
        VehicleTypeValue: myTaskValuate.data.VehicleTypeValue,
        geolocation: {
          lat: lead.latitude?.toString(),
          long: lead.longitude?.toString(),
          timeStamp: lead.lastValuated?.toString(),
        },
      })
    )
  );

  // Navigate to next screen after successful upload
  navigation.navigate("VehicleDetails", {
    carId: carId,
  });
};
```

#### 8.2 HandleValuationUpload Function
**Location:** `src/services/Slices/HandleValuationUpload.ts`

```typescript
export const HandleValuationUpload = async ({
  base64String,    // Local file path
  paramName,       // API parameter name
  LeadId,
  VehicleTypeValue,
  geolocation,
}: HandleValuationUploadType) => {
  const { postWithFormData } = apiCallService();

  try {
    // Get file info from local storage
    const { uri } = await FileSystem.getInfoAsync(base64String);

    // Create FormData object for multipart upload
    const formData = new FormData();
    formData.append("LeadId", LeadId);
    formData.append("Version", "2");
    formData.append(paramName, `${paramName}.jpg`);

    // Append file
    formData.append('file1', {
      type: 'image/jpg',
      name: `${paramName}.jpg`,
      uri,  // Local file URI
    });

    // Append location data
    formData.append('Latitude', geolocation.lat);
    formData.append('Longitude', geolocation.long);
    formData.append('Timestamp', geolocation.timeStamp);

    // Send to server
    const resp = await postWithFormData({
      service: `/App/webservice/DocumentUploadOtherImage`,
      body: formData,
      headers: {
        Version: "2",
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(resp);

  } catch (error) {
    console.log("Error in HandleValuationUpload", error);
  }
};
```

**Upload Process:**
1. Read image file from local storage using `expo-file-system`
2. Create `FormData` object (multipart/form-data)
3. Append image file and metadata (location, timestamp)
4. Send via HTTP POST request to server
5. Server receives image and stores it

**Packages Used:**
- `expo-file-system` - Read file from local storage
- `FormData` - Browser API available in React Native for multipart uploads
- Custom `apiCallService()` - Wrapper around fetch/axios for API calls

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    VALUATION SCREEN                              │
│                 (User clicks side image)                         │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              CUSTOM CAMERA COMPONENT                             │
│          (expo-camera CameraView)                                │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ User captures image → handlePreview()               │        │
│  │ Camera.takePictureAsync()                           │        │
│  │ Returns: uri (temporary cache path)                 │        │
│  │ Sets: preview state                                 │        │
│  └─────────────────────────────────────────────────────┘        │
│                      │                                           │
│                      ▼                                           │
│          USER CLICKS "PROCEED" BUTTON                            │
└────────────────┬────────────────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌──────────────────┐  ┌────────────────────┐
│  FAST NAVIGATION │  │ BACKGROUND PROCESS │
│  Back to         │  │ (setTimeout 200ms) │
│  Valuation       │  │                    │
│  Screen          │  └────────────────────┘
└──────────────────┘        │
                            ▼
                ┌────────────────────────┐
                │ HandleSaveImage()      │
                │ savePictureToLocal...()│
                └──────┬─────────────────┘
                       │
                       ▼
            ┌──────────────────────────┐
            │  expo-file-system        │
            │  documentDirectory +     │
            │  photos/                 │
            │  Copy temp → permanent   │
            │  Returns: new URI        │
            └──────────────┬───────────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
            ▼                             ▼
    ┌──────────────────┐      ┌──────────────────┐
    │  AsyncStorage    │      │  SQLite DB       │
    │  sync_queue      │      │  uploadStatus    │
    │  (image paths)   │      │  (metadata +     │
    │                  │      │   location)      │
    └──────────────────┘      └──────────────────┘
            │                             │
            └──────────────┬──────────────┘
                           │
                    WHEN USER CLICKS
                    "NEXT" / CONFIRM
                           │
                           ▼
            ┌──────────────────────────┐
            │  Get NotUploadedImages   │
            │  from SQLite Database    │
            └──────────────┬───────────┘
                           │
                           ▼
            ┌──────────────────────────┐
            │ HandleValuationUpload()  │
            │  For each image:         │
            │  - expo-file-system      │
            │    reads local file      │
            │  - FormData created      │
            │  - Multipart POST sent   │
            └──────────────┬───────────┘
                           │
                           ▼
                    ┌────────────┐
                    │   SERVER   │
                    │ /DocumentUp│
                    │LoadOtherImg│
                    │  (Receives │
                    │   image +  │
                    │  metadata) │
                    └────────────┘
```

---

## 🔑 Key Packages and Their Functions

### **1. expo-camera**
```typescript
import { CameraView, useCameraPermissions } from "expo-camera";

// Usage:
<CameraView
  ref={CameraRef}
  facing={facing}
  onCameraReady={callback}
/>

// Take picture
const data = await CameraRef.current?.takePictureAsync({
  quality: 0.5,
  skipProcessing: true
});
// Returns: { uri: "file://path/to/image.jpg", ... }
```

**Functions:**
- `CameraView` - Camera component
- `useCameraPermissions()` - Check/request camera permissions
- `takePictureAsync()` - Capture image

---

### **2. expo-file-system**
```typescript
import * as FileSystem from 'expo-file-system/legacy';

// Key properties:
FileSystem.documentDirectory  // App's persistent storage

// Key methods:
await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
await FileSystem.copyAsync({ from: uri, to: dest });
await FileSystem.deleteAsync(uri, { idempotent: true });
const info = await FileSystem.getInfoAsync(uri);
```

**Functions:**
- `documentDirectory` - Persistent storage location
- `makeDirectoryAsync()` - Create folders
- `copyAsync()` - Copy files
- `deleteAsync()` - Delete files
- `getInfoAsync()` - Get file information

---

### **3. expo-sqlite**
```typescript
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("upload_status.db");

// Methods:
await db.execAsync(SQL_QUERY);
await db.runAsync(SQL_QUERY, [params]);
const result = await db.getFirstAsync(SQL_QUERY, [params]);
```

**Functions:**
- `openDatabaseSync()` - Open/create database
- `execAsync()` - Execute SQL
- `runAsync()` - Execute with parameters
- `getFirstAsync()` - Get single row

---

### **4. @react-native-async-community/async-storage**
```typescript
import AsyncStorage from '@react-native-async-community/async-storage';

// Methods:
await AsyncStorage.getItem('key');
await AsyncStorage.setItem('key', JSON.stringify(value));
await AsyncStorage.removeItem('key');
```

**Functions:**
- `getItem()` - Retrieve data
- `setItem()` - Store data
- `removeItem()` - Delete data

---

### **5. expo-location**
```typescript
import * as Location from "expo-location";

// Get current location
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Highest,
});

// Returns:
{
  coords: {
    latitude: number,
    longitude: number,
    altitude: number,
    accuracy: number
  },
  timestamp: number
}
```

---

## 📸 Image URI Explained

### **Understanding Image URI in Mobile Apps**

**What is URI?**
- **URI** = Uniform Resource Identifier
- In mobile context: A path to access a file/resource
- Format: `file:///path/to/file` or `content://...`

### **Different URIs in the App Lifecycle**

```
1. CAMERA CAPTURE → Temporary Cache URI
   file:///data/user/0/com.example.kwikcheck/cache/temp-xxxxx.jpg
   └─ Temporary, exists only in memory
   └─ Will be deleted on app close

2. SAVED TO DEVICE → Permanent Document Directory URI
   file:///data/data/com.example.kwikcheck/files/photos/1702134567890.jpg
   └─ Permanent storage
   └─ Accessible until manually deleted
   └─ Used for preview and upload

3. SERVER UPLOAD → Server URL
   https://api.server.com/api/images/image123.jpg
   └─ Server-side path
   └─ Used for displaying image from server
```

### **Why Copy to Document Directory?**

```
Cache (Temporary)              Document (Permanent)
├─ Auto-cleaned               ├─ App controls
├─ Limited size               ├─ Persistent
├─ Fast access                ├─ Safe for storage
└─ Volatile                   └─ Survives app restart
```

---

## 🔄 Complete Image Lifecycle

```
1. USER TAKES PHOTO
   Camera.takePictureAsync()
   ↓
   Returns temporary URI in cache
   
2. USER SEES PREVIEW
   Image displayed via preview state
   
3. USER CLICKS PROCEED
   Image copied from cache to documents
   ↓
   Metadata stored in AsyncStorage
   ↓
   Database record created with location
   
4. USER CONFIRMS SUBMISSION
   App reads image from documents
   ↓
   FormData created with image + metadata
   ↓
   HTTP POST sent to server
   
5. SERVER RECEIVES IMAGE
   Image stored on server
   ↓
   Database marked as uploaded (isUploaded = 1)
```

---

## 💾 Local Storage Structure

```
App's Local Storage on Device:
/data/data/com.example.kwikcheck/
├── files/
│   └── photos/                    (expo-file-system)
│       ├── 1702134567890.jpg      (Front Side image)
│       ├── 1702134567891.jpg      (Right Side image)
│       └── 1702134567892.jpg      (Back Side image)
│
├── databases/
│   └── upload_status.db           (SQLite database)
│       ├── images_uploaded_status table
│       └── leads_valuated table
│
└── shared_prefs/
    └── AsyncStorage/              (AsyncStorage)
        └── sync_queue.json
            {
              "id": "lead123",
              "side": [
                {
                  "type": "Front Side",
                  "img": "/data/data/.../photos/1702134567890.jpg"
                }
              ]
            }
```

---

## 📤 Uploading Images to Server

### **FormData Multipart Upload**

```typescript
const formData = new FormData();
formData.append("LeadId", "123");
formData.append("Version", "2");
formData.append("FrontImage", "FrontImage.jpg");
formData.append('file1', {
  type: 'image/jpg',
  name: 'FrontImage.jpg',
  uri: '/data/data/.../photos/1702134567890.jpg'
});
formData.append('Latitude', '28.5244');
formData.append('Longitude', '77.1855');

// HTTP Request
POST /App/webservice/DocumentUploadOtherImage
Content-Type: multipart/form-data
Body: formData
```

### **Server Receives:**
```
FormData Parts:
- LeadId: "123"
- Version: "2"
- FrontImage: "FrontImage.jpg"
- file1: [binary image data]
- Latitude: "28.5244"
- Longitude: "77.1855"
```

---

## 🛑 Error Handling and Cleanup

### **Remove Picture if Retaken**
```typescript
export const removePictureToLocalStorage = async (uri: string) => {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
    console.log(`Photo removed from ${uri}`);
  } catch (error) {
    console.log("ERROR IN REMOVING IMAGE", error);
  }
};
```

### **Handle Upload Errors**
```typescript
try {
  await HandleValuationUpload({...});
} catch (error: any) {
  console.log("ERROR IN UPLOADING IMAGES", error);
  AppErrorMessage({ message: error.message.toString() });
} finally {
  FullPageLoader.close();
}
```

---

## 🎯 Key Takeaways

1. **Image Capture**: Uses `expo-camera` to capture images, returns temporary URI
2. **Local Storage**: Images copied from temporary cache to app's document directory using `expo-file-system`
3. **Metadata Storage**: Two layers:
   - AsyncStorage: Quick access to image paths and basic info
   - SQLite Database: Persistent storage with upload status, location data
4. **Upload Process**: Images read from local storage, sent via FormData multipart HTTP POST
5. **Packages Used**:
   - `expo-camera` - Camera functionality
   - `expo-file-system` - File operations
   - `expo-sqlite` - Database
   - `AsyncStorage` - Quick key-value storage
   - `expo-location` - GPS coordinates

---

## 🔍 Important Code References

### Camera Component
- [src/components/CustomCamera.tsx](../src/components/CustomCamera.tsx)

### Image Handling
- [src/Utils/imageHandlers.ts](../src/Utils/imageHandlers.ts)

### Local Storage
- [src/db/HandleStoreData.ts](../src/db/HandleStoreData.ts)

### Database
- [src/db/uploadStatusDb.ts](../src/db/uploadStatusDb.ts)

### Upload Service
- [src/services/Slices/HandleValuationUpload.ts](../src/services/Slices/HandleValuationUpload.ts)

### Valuation Screen
- [src/pages/Valuate/index.tsx](../src/pages/Valuate/index.tsx)

---

This document provides a complete understanding of the image capture, storage, and upload flow in your KwikCheck app. You can now modify any part of this process with full knowledge of how it works internally.
