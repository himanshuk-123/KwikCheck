import { FullPageLoader, LocalStorage } from "@src/Utils";
import apiCallService from "../apiCallService";
import { ToastAndroid } from "react-native";
import { AllApiAcceptedKeys, ApiAcceptedKeys } from "@constants";
import { HandleValuationUploadType } from "@src/@types/HandleValuationUploadType";
// Use legacy FileSystem API to avoid deprecation warnings in SDK 54
import * as FileSystem from "expo-file-system/legacy";
import useZustandStore from "@src/store/useZustandStore";
import { TYRE_MAPPING } from "@src/constants/DocumentUploadDataMapping";

const readImageAsBase64 = async (imagePath: any) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imagePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error reading image:", error);
    return null;
  }
};

/**
 * 
 * @deprecated The method not to be used anymore
 */
const decideParameterWithAPI = (key: string, vehicleType: string) => {
  let apiKey = "";
  let isDocumentUpload = false;
  console.log("KEY HERE IS ", key, key.toLowerCase().includes("tyre"));
  console.log("VEHICLE TYPE HERE IS ", vehicleType);
  try {
    if (AllApiAcceptedKeys[key] && !key.toLowerCase().includes("tyre")) {
      apiKey = AllApiAcceptedKeys[key];
    } else {
      const trimmedVehicleType = vehicleType.trim();
      if (vehicleType == "2W" && trimmedVehicleType !== "Rear Tyre Image") {
        key = "Front Tyre Image";
      }

      apiKey = TYRE_MAPPING[trimmedVehicleType]?.find(
        (item: any) =>
          item.name.toLocaleLowerCase() === key.toLocaleLowerCase(),
      )?.number;
    }

    if (ApiAcceptedKeys.includes(key)) {
      isDocumentUpload = true;
    }
  } catch (error) {
    console.log("ERROR IN decideParameterWithAPI", error);
  }
  return {
    apiParam: apiKey,
    apiService: isDocumentUpload
      ? "DocumentUpload"
      : "DocumentUploadOtherImage",
  };
};

export const HandleValuationUpload = async ({
  base64String, // actually file URI
  paramName = "Other",
  LeadId,
  VehicleTypeValue,
  geolocation,
}: HandleValuationUploadType) => {
  const { postWithFormData } = apiCallService();

  // ---- validations ----
  if (!base64String || !base64String.startsWith("file:")) {
    throw new Error("Invalid image URI");
  }
  if (!LeadId) {
    throw new Error("LeadId missing");
  }
  if (!paramName) {
    throw new Error("paramName missing");
  }

  // 🔍 LOG FILE SIZE BEFORE UPLOAD TO VERIFY COMPRESSION
  let fileSizeKB = "unknown";
  try {
    const fileInfo = await FileSystem.getInfoAsync(base64String);
    if (fileInfo.exists && fileInfo.size) {
      fileSizeKB = (fileInfo.size / 1024).toFixed(2);
      const fileSizeBytes = fileInfo.size;
      console.log(
        `[HandleValuationUpload] 📁 FILE SIZE: ${fileSizeKB} KB (${fileSizeBytes} bytes)`
      );
      
      // ✅ Expected compressed range: 300-500 KB
      if (parseFloat(fileSizeKB) > 1000) {
        console.warn(
          `⚠️ [HandleValuationUpload] WARNING: Image seems large (${fileSizeKB} KB). ` +
          `Expected 300-500 KB. Check if compression is working.`
        );
      } else if (parseFloat(fileSizeKB) < 100) {
        console.warn(
          `⚠️ [HandleValuationUpload] WARNING: Image seems very small (${fileSizeKB} KB). ` +
          `Expected 300-500 KB. May be corrupted.`
        );
      } else {
        console.log(`✅ [HandleValuationUpload] Image size is in expected range: ${fileSizeKB} KB`);
      }
    }
  } catch (err) {
    console.warn("[HandleValuationUpload] Could not read file size:", err);
  }

  const formData = new FormData();

  formData.append("LeadId", LeadId);
  formData.append("Version", "2");

  // 🔴 REQUIRED by backend (DO NOT REMOVE)
  // 1️⃣ filename string
  formData.append(paramName, `${paramName}.jpg`);

  // 2️⃣ actual image file
  formData.append(paramName, {
    uri: base64String,
    name: `${paramName}.jpg`,
    type: "image/jpeg",
  } as any);

  formData.append("Latitude", String(geolocation.lat));
  formData.append("Longitude", String(geolocation.long));
  formData.append("Timestamp", String(geolocation.timeStamp));

  // ---- debug logs ----
  if (__DEV__) {
    console.log("[HandleValuationUpload] REQUEST", {
      LeadId,
      paramName,
      imageUri: base64String,
      imageSizeKB: fileSizeKB + " KB",
      lat: geolocation.lat,
      long: geolocation.long,
      time: geolocation.timeStamp,
    });
  }

  const resp = await postWithFormData({
    service: "/App/webservice/DocumentUploadOtherImage",
    body: formData,
    headers: {
      Version: "2", // ❗ boundary auto-set by RN
    },
  });

  if (__DEV__) {
    console.log("[HandleValuationUpload] RESPONSE", {
      status: resp?.status,
      data: resp?.data,
    });
  }

  if (!resp || !resp.status || resp.status < 200 || resp.status >= 300) {
    throw new Error(`Upload failed with status ${resp?.status}`);
  }

  const data = resp.data || {};
  if (data.Error === "1" || data.ERROR === "1") {
    throw new Error(data.MESSAGE || data.Message || "Server rejected upload");
  }

  return resp;
};
