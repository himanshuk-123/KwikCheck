import { FullPageLoader, LocalStorage } from "@src/Utils";
import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService";
import { LeadStatusChangeInterface } from "@src/@types";

/**
 * StatusId = 16 in case of reject
 * StatusId = null in case of remark
 */
const LeadStatusChange = async ({
  LeadId,
  RemarkId,
  RemarkMessage,
  type,
}: {
  LeadId: string;
  RemarkId: string | number;
  RemarkMessage: string;
  type: "Reject" | "Remark";
}): Promise<boolean> => {
  try {
    FullPageLoader.open({
      label: "Loading...",
    });

    const { post } = apiCallService();

    const response: LeadStatusChangeInterface = await post({
      service: "/App/webservice/LeadStatusChange",
      body: {
        LeadId,
        RemarkId,
        RemarkMessage,
        Status: type,
      },
    });

    if (
      response.Error === "0" &&
      response.MESSAGE.toLowerCase().includes("success")
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
    console.log(error);
    return false;
  } finally {
    FullPageLoader.close();
  }
};

export default LeadStatusChange;
