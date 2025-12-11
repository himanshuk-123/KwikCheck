import apiCallService from "../apiCallService";
import { FullPageLoader } from "@src/Utils";
import { ToastAndroid } from "react-native";
import {
  LeadReportDataCreateedit,
  LeadReportDataCreateeditResponse,
} from "@src/@types/LeadReportDataCreateEdit";

const LeadReportDataCreateEdit = async (
  data: LeadReportDataCreateedit
): Promise<LeadReportDataCreateeditResponse> => {
  try {
    // FullPageLoader.open({
    //   label: "Please wait...",
    // });
    const { post } = apiCallService();
    console.log("LeadReportDataCreateEdit", data);
    const resp: LeadReportDataCreateeditResponse = await post({
      service: "/App/webservice/LeadReportDataCreateedit",
      body: {
        Version: "2",
        ...data,
      },
    });

    return resp;
  } catch (error) {
    console.log(error);
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
  } finally {
    FullPageLoader.close();
  }
};

export default LeadReportDataCreateEdit;
