import { LocalStorage } from "@src/Utils";
import * as FileSystem from "expo-file-system/legacy";
import * as Location from "expo-location";
import { ToastAndroid } from "react-native";
import Axios from "axios";

interface UploadCameraImageParams {
  imagePath: string;
  leadId: string;
  side: string;
  latitude?: string;
  longitude?: string;
}

/**
 * Uploads an image from CustomCamera to the server
 * @param imagePath - Local file path of the saved image
 * @param leadId - The Lead ID
 * @param side - The side/step name (used as dynamic field name)
 * @param latitude - Optional latitude (will be fetched if not provided)
 * @param longitude - Optional longitude (will be fetched if not provided)
 */
export const UploadCameraImage = async ({
  imagePath,
  leadId,
  side,
  latitude,
  longitude,
}: UploadCameraImageParams) => {
  try {
    // Get user credentials for TokenID
    const userCredentials = await LocalStorage.get("user_credentials");
    
    if (!userCredentials?.TOKENID) {
      console.error("No TokenID found in user credentials");
      ToastAndroid.show("Authentication error", ToastAndroid.SHORT);
      return { success: false, error: "No TokenID" };
    }

    // Get location if not provided
    let lat = latitude;
    let long = longitude;
    
    if (!lat || !long) {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = location.coords.latitude.toString();
        long = location.coords.longitude.toString();
      } catch (error) {
        console.log("Error getting location:", error);
        // Use default values if location fails
        lat = "0";
        long = "0";
      }
    }

    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(imagePath);
    if (!fileInfo.exists) {
      console.error("Image file does not exist:", imagePath);
      return { success: false, error: "File not found" };
    }

    // Create FormData
    const formData = new FormData();
    formData.append("LeadId", leadId);
    formData.append("Version", "2");
    formData.append("TokenID", userCredentials.TOKENID);
    formData.append("Latitude", lat);
    formData.append("Longitude", long);
    
    // Add the text field with the dynamic name for the image name (e.g., "Odometer": "Odometer.jpg")
    formData.append(side, `${side}.jpg`);
    
    // Add the image file with dynamic field name (e.g., "Odometer" as file)
    formData.append(side, {
      uri: imagePath,
      type: "image/jpeg",
      name: `${side}.jpg`,
    } as any);

    // Log request parameters before sending
    console.log("[UploadCameraImage] About to upload:", {
      service: "App/webservice/DocumentUploadOtherImage",
      LeadId: leadId,
      Version: "2",
      TokenID: userCredentials.TOKENID,
      Latitude: lat,
      Longitude: long,
      file: { uri: imagePath, name: `${side}.jpg`, type: "image/jpeg" },
      paramName: side,
    });

    // Upload to server
    const response = await Axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URI || "https://inspection.kwikcheck.in/"}App/webservice/DocumentUploadOtherImage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          TokenID: userCredentials.TOKENID,
          Version: "2",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("[UploadCameraImage] Response:", response.status, response.data);

    if (response.data.Error === "0" || response.data.ERROR === "0") {
      return { success: true, data: response.data };
    } else {
      console.error("Upload failed:", response.data.MESSAGE || response.data.Message);
      return { 
        success: false, 
        error: response.data.MESSAGE || response.data.Message || "Upload failed" 
      };
    }
  } catch (error: any) {
    console.error("Error uploading camera image:", error);
    
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: "Upload timeout" };
    }
    
    return { 
      success: false, 
      error: error.message || "Upload failed" 
    };
  }
};

export default UploadCameraImage;
