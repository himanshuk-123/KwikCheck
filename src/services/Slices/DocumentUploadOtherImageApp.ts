import { FullPageLoader, LocalStorage } from "@src/Utils";
import apiCallService from "../apiCallService";
import { ToastAndroid } from "react-native";
import { AllApiAcceptedKeys, ApiAcceptedKeys } from "@constants";
import { HandleValuationUploadType } from "@src/@types/HandleValuationUploadType";
import * as FileSystem from "expo-file-system";
import useZustandStore from "@src/store/useZustandStore";
import { TYRE_MAPPING } from "@src/constants/DocumentUploadDataMapping";

const decideParameterWithAPI = (key: string, vehicleType: string) => {
  let apiKey = "";
  let isDocumentUpload = false;
  console.log("KEY HERE IS ", key, key.toLowerCase().includes("tyre"));
  try {
    if (AllApiAcceptedKeys[key] && !key.toLowerCase().includes("tyre")) {
      apiKey = AllApiAcceptedKeys[key];
    } else {
      apiKey = TYRE_MAPPING[vehicleType].find(
        (item: any) => item.name === key
      ).number;
      console.log("ININININ Else", key, vehicleType, key.includes("Tyre"));
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

export const DocumentUploadOtherImageApp = async ({
  base64String = "",
  paramName = "Other",
  LeadId = "",
  VehicleTypeValue = "",
}: HandleValuationUploadType) => {
  const { post } = apiCallService();

  try {
    const { apiParam, apiService } = decideParameterWithAPI(
      paramName,
      VehicleTypeValue
    );
    const serviceUrl =
      paramName !== "Profile"
        ? `/App/webservice/DocumentUploadOtherImageApp`
        : `/App/webservice/DocumentUploadProfileImage`;

    const reqObj = {
      LeadId,
      //   TokenId: userCredentials?.TokenID,
      Version: "2",
      [apiParam]: base64String,
    };

    console.log("DocumentUploadOtherImageApp Request", reqObj);
    const resp = await post({
      service: serviceUrl,
      body: reqObj,
      headers: {
        Version: "2",
      },
    });

    console.log("DocumentUploadOtherImageApp RESPONSE", resp);
    if (resp.ERROR != "0") {
      ToastAndroid.show(
        resp.MESSAGE || "Something went wrong",
        ToastAndroid.LONG
      );
    } else {
      ToastAndroid.show("Success", ToastAndroid.LONG);
    }
  } catch (error) {
    console.log("Error in HandleValuationUpload", error);
  } finally {
    FullPageLoader.close();
  }
};
