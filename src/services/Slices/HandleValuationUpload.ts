import { FullPageLoader, LocalStorage } from "@src/Utils";
import apiCallService from "../apiCallService";
import { ToastAndroid } from "react-native";
import { AllApiAcceptedKeys, ApiAcceptedKeys } from "@constants";
import { HandleValuationUploadType } from "@src/@types/HandleValuationUploadType";
import * as FileSystem from "expo-file-system";
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
  base64String = "",
  paramName = "Other",
  LeadId,
  VehicleTypeValue,
  geolocation,
}: HandleValuationUploadType) => {
  const { post, postWithFormData } = apiCallService();
  // console.log(
  //   "IN HandleValuationUpload DATA=>",
  //   base64String,
  //   paramName,
  //   LeadId,
  // );
  try {
    const { uri } = await FileSystem.getInfoAsync(base64String);

    const formData = new FormData();
    formData.append("LeadId", LeadId);
    formData.append("Version", "2");
    formData.append(paramName, `${paramName}.jpg`);
    formData.append('file1', {
      type: 'image/jpg',
      name: `${paramName}.jpg`,
      uri,
    } as any);
    formData.append('Latitude', geolocation.lat);
    formData.append('Longitude', geolocation.long);
    formData.append('Timestamp', geolocation.timeStamp);

    // console.log("BASE 64 STR ", formData.getAll(paramName));
    // console.log("FORMDATA", reqObj);
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
  } finally {
    // FullPageLoader.close();
  }
};
