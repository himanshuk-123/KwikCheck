# Image Compression Verification Guide

## How to Check if Compressed or Original Image is Being Sent

### 📊 File Size Check Points

The image goes through these stages:

```
Camera (Raw) → ProcessImage (Compressed) → HandleSaveImage (Saved) → Upload (Sent to Server)
```

### 🔍 Verification Steps

#### **Step 1: Check Console Logs During Capture**
When you take a photo, look in your Expo console for:

```
[processImage] Attempt 1: XXX.XX KB
[processImage] Attempt 2: XXX.XX KB
...
```

This shows the **compression loop is working**. Target should be **300-500 KB**.

---

#### **Step 2: Check File Size Before Upload**
Before the upload happens, the console should log:

```
[HandleValuationUpload] 📁 FILE SIZE: 350.45 KB
```

**✅ Good**: 300-500 KB range (compressed)  
**❌ Bad**: 2000+ KB (original image)

---

#### **Step 3: Check FormData Logging**
In the console, you should see:

```
[apiCallService] 📤 FormData Summary:
  - LeadId: 12345
  - paramName: "Front"
  - imageSizeKB: 350.45 KB  ← This is what's being sent
  - Latitude: 28.xxxx
  - Longitude: 77.xxxx
```

---

### 🚀 How to Enable Full Debugging

Add these console logs to track the image through the pipeline:

**In `CustomCamera.tsx` (handlePreview):**
```typescript
const processedUri = await processImage(data.uri);
const previewInfo = await FileSystem.getInfoAsync(processedUri);
console.log(`[CustomCamera] Preview after compression: ${(previewInfo.size / 1024).toFixed(2)} KB`);
setPreview(processedUri);
```

**In `CustomCamera.tsx` (handleProceed - background upload):**
```typescript
const uploadInfo = await FileSystem.getInfoAsync(imgPath);
console.log(`[CustomCamera] Image being uploaded: ${(uploadInfo.size / 1024).toFixed(2)} KB`);
```

---

### 📋 What Each Part Does

| Component | Purpose | Output Size |
|-----------|---------|------------|
| **handlePreview()** | Captures from camera + compresses | ~350 KB (target) |
| **processImage()** | Compression loop (4 iterations) | 300-500 KB |
| **HandleSaveImage()** | Saves to local storage | Same as input |
| **uploadImageWithRetry()** | Uploads with retry logic | ✅ 300-500 KB |

---

### ✅ Checklist for Compression

- [ ] Console shows `[processImage] Attempt X:` logs (compression happening)
- [ ] File sizes in ProcessImage loop are **decreasing** (aggressive compression)
- [ ] Final compressed size is **300-500 KB**
- [ ] `[HandleValuationUpload] 📁 FILE SIZE:` shows **300-500 KB**
- [ ] Upload succeeds
- [ ] Backend logs show received file is **300-500 KB** (not 2000+ KB)

---

### ❌ If Images Are Still Large

**Issue**: Backend shows 2000+ KB files

**Root Cause**: 
1. `processImage()` not being called
2. Compression loop failing silently
3. Original raw image being used instead of compressed

**Fix**:
1. Check that `preview` state contains the **processed URI**, not raw URI
2. Check console logs show compression attempts
3. Verify `HandleSaveImage()` is receiving the compressed path

---

### 🔧 Server-Side Verification

After upload, check your backend logs for actual file size received:

```json
{
  "LeadId": "12345",
  "paramName": "Front",
  "receivedFileSizeBytes": 358000,     // Should be ~300-500 KB
  "receivedFileSizeKB": 350,
  "status": "success"
}
```

If backend shows **2000+ KB**, the compressed image is NOT being sent.

---

### 💡 Quick Test

1. **Open Console** (Expo CLI shows real-time logs)
2. **Take Photo** 
3. **Look for these logs in order**:
   ```
   [processImage] Attempt 1: 2500.50 KB
   [processImage] Attempt 2: 1800.25 KB
   [processImage] Attempt 3: 1100.75 KB
   [processImage] Attempt 4: 450.30 KB
   [HandleValuationUpload] 📁 FILE SIZE: 450.30 KB
   ```
4. **Press Proceed**
5. **Watch Upload Toast** (should succeed)

If you see 2000+ KB at any point → compression is failing.

---

### 📞 Support

If images are still large after these checks, collect:
1. Console logs from capture to upload
2. Backend received file size
3. Error messages from processImage or HandleSaveImage
