/**
 * Upload image to server immediately after local save
 * Called from handleProceed button in CustomCamera component
 * 
 * This function:
 * 1. Reads image from local storage
 * 2. Creates FormData with required parameters
 * 3. Sends to server via POST request
 */

import * as FileSystem from "expo-file-system/legacy";
import apiCallService from "./apiCallService";
import { LocalStorage } from "@src/Utils";
import { ToastAndroid } from "react-native";
import * as Location from "expo-location";

/**
 * Get TokenID from user credentials stored in LocalStorage
 * (Same pattern as UploadCameraImage.ts)
 */
const getTokenId = async (): Promise<string> => {
  try {
    // Get credentials from LocalStorage (same as UploadCameraImage.ts)
    const userCredentials = await LocalStorage.get("user_credentials");
    
    if (!userCredentials?.TOKENID) {
      throw new Error("Authentication token (TOKENID) not found in user credentials");
    }
    
    return userCredentials.TOKENID;
  } catch (error) {
    console.error("Error getting TokenID:", error);
    throw new Error("Failed to retrieve authentication token");
  }
};

/**
 * Upload image to server immediately after local save
 * @param imagePath - Local file path where image is saved
 * @param leadId - Lead/Vehicle ID
 * @param apiFieldName - Dynamic field name (e.g., "Odometer", "Dashboard")
 * @param latitude - GPS latitude
 * @param longitude - GPS longitude
 * @param cardName - Card name for logging (e.g., "Odometer Reading")
 * @returns Promise with {success: boolean, error?: string, data?: any}
 */
export const uploadImageToServer = async ({
  imagePath,
  leadId,
  apiFieldName,
  latitude,
  longitude,
  cardName = "",
}: {
  imagePath: string;
  leadId: string;
  apiFieldName: string;
  latitude: number;
  longitude: number;
  cardName?: string;
}): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    console.log("\n╔═══════════════════════════════════════════════╗");
    console.log("║  UPLOAD IMAGE TO SERVER - STARTED            ║");
    console.log("╚═══════════════════════════════════════════════╝");
    console.log("📦 Upload Parameters:");
    console.log("  - imagePath:", imagePath);
    console.log("  - leadId:", leadId);
    console.log("  - apiFieldName:", apiFieldName);
    console.log("  - cardName:", cardName);
    console.log("  - latitude:", latitude);
    console.log("  - longitude:", longitude);

    // STEP 1: Get file info from local storage
    console.log("\n📂 STEP 1: Checking if image file exists...");
    const fileInfo = await FileSystem.getInfoAsync(imagePath);
    console.log("File info:", fileInfo);
    
    if (!fileInfo.exists) {
      const errorMsg = `Image file not found at path: ${imagePath}`;
      console.error("❌ File does not exist!");
      console.error("Error:", errorMsg);
      return { success: false, error: errorMsg };
    }
    console.log("✅ File exists!");

    const { uri } = fileInfo;
    console.log("File URI:", uri);

    // STEP 2: Extract filename from path
    console.log("\n📝 STEP 2: Extracting filename from path...");
    // Example: "/data/data/.../photos/1702134567890.jpg" → "1702134567890.jpg"
    const fileName = uri.split("/").pop() || `${apiFieldName}.jpg`;
    console.log("✅ Filename extracted:", fileName);

    // STEP 3: Create FormData with all required parameters
    console.log("\n📋 STEP 3: Creating FormData...");
    const formData = new FormData();

    // Append basic parameters
    console.log("Adding LeadId:", leadId);
    formData.append("LeadId", leadId);
    console.log("Adding Version: 2");
    formData.append("Version", "2");

    // Append GPS metadata
    console.log("Adding Latitude:", latitude.toString());
    formData.append("Latitude", latitude.toString());
    console.log("Adding Longitude:", longitude.toString());
    formData.append("Longitude", longitude.toString());
    const timestamp = new Date().toLocaleString();
    console.log("Adding Timestamp:", timestamp);
    formData.append("Timestamp", timestamp);

    // STEP 4: Get and append TokenID
    console.log("\n🔑 STEP 4: Getting TokenID...");
    const tokenId = await getTokenId();
    console.log("✅ TokenID retrieved:", tokenId ? "[PRESENT]" : "[MISSING]");
    formData.append("TokenID", tokenId);

    // STEP 5: Append file with dynamic field name
    console.log("\n📎 STEP 5: Appending image file to FormData...");
    console.log("Field name (dynamic):", apiFieldName);
    const fileObject = {
      type: "image/jpg",
      name: fileName,
      uri: uri,
    };
    console.log("File object:", fileObject);
    // First occurrence: The actual image file
    formData.append(apiFieldName, fileObject as any);
    console.log(`✅ First occurrence: formData['${apiFieldName}'] = [File Object]`);

    // STEP 6: Append filename string with same dynamic field name
    console.log("\n📎 STEP 6: Appending filename string to FormData...");
    // Second occurrence: Filename string for backend identification
    formData.append(apiFieldName, fileName);
    console.log(`✅ Second occurrence: formData['${apiFieldName}'] = "${fileName}"`);

    console.log("\n✅ FormData created successfully");
    console.log("FormData contents summary:");
    console.log("  - LeadId, Version, Lat, Long, Timestamp, TokenID");
    console.log(`  - ${apiFieldName} (file object)`);
    console.log(`  - ${apiFieldName} (filename string)`);

    // STEP 7: Get API service and make POST request
    console.log("\n🌐 STEP 7: Making POST request to server...");
    const { postWithFormData } = apiCallService();
    console.log("API Service initialized");

    const endpoint = `/App/webservice/DocumentUploadOtherImage`;
    console.log("Endpoint:", endpoint);
    console.log("Headers: { Version: '2' }");
    console.log("Body: FormData (multipart/form-data)");
    
    console.log("\n⏳ Sending request to server...");
    const response = await postWithFormData({
      service: endpoint,
      body: formData,
      headers: {
        Version: "2",
        // Note: 'Content-Type': 'multipart/form-data' is set automatically
      },
    });

    console.log("\n✅✅✅ Upload successful!");
    console.log("Server response:", JSON.stringify(response, null, 2));

    // STEP 8: Update database to mark as uploaded (optional)
    console.log("\n💾 STEP 8: Database update (currently disabled)");
    // You can update SQLite here if needed
    // await db.runAsync(
    //   `UPDATE images_uploaded_status SET isUploaded = 1 WHERE uri = ? AND leadId = ?`,
    //   [imagePath, leadId]
    // );

    console.log("\n╔═══════════════════════════════════════════════╗");
    console.log("║  UPLOAD COMPLETED SUCCESSFULLY! ✅           ║");
    console.log("╚═══════════════════════════════════════════════╝\n");
    return { success: true, data: response };
  } catch (error) {
    console.error("\n╔═══════════════════════════════════════════════╗");
    console.error("║  UPLOAD FAILED! ❌                           ║");
    console.error("╚═══════════════════════════════════════════════╝");
    console.error("❌ Upload error:", error);
    console.error("Error type:", typeof error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    // Provide more detailed error message
    let errorMessage = "Failed to upload image";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error message:", errorMessage);
      console.error("Error stack:", error.stack);
    }
    
    console.error("\n❌ Returning failure response:", { success: false, error: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export default uploadImageToServer;
