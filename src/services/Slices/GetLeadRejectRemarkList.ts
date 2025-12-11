import { FullPageLoader, LocalStorage } from "@src/Utils";
import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService";
import {
  LeadRejectRemarkListResponseDataRecord,
  LeadRejectRemarkListResponseInterface,
} from "@src/@types/LeadRejectRemarkListResponse";

const GetLeadRejectRemarkList = async ({
  LeadId,
}: {
  LeadId: string;
}): Promise<LeadRejectRemarkListResponseDataRecord[] | null> => {
  try {
    FullPageLoader.open({
      label: "Loading...",
    });

    const { post } = apiCallService();

    const response: LeadRejectRemarkListResponseInterface = await post({
      service: "/App/webservice/LeadRejectRemarkList",
      body: {
        LeadId,
      },
    });

    if (
      response.Error === "0" &&
      response.MESSAGE.toLowerCase().includes("success")
    ) {
      return response.DataRecord || [];
    } else {
      return null;
    }
  } catch (error) {
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
    console.log(error);
    return null;
  } finally {
    FullPageLoader.close();
  }
};

export default GetLeadRejectRemarkList;
