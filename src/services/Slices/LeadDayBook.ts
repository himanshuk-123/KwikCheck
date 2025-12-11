import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService";
import { FullPageLoader } from "@src/Utils";
import {
  AppLeadDaybook,
  AppLeadDaybookDataRecord,
} from "@src/@types/AppLeadDayBook";

const LeadDayBook = async (): Promise<AppLeadDaybookDataRecord> => {
  try {
    FullPageLoader.open({
      label: "Please wait...",
    });
    const { post } = apiCallService();
    const resp: AppLeadDaybook = await post({
      service: "/App/webservice/AppLeadDaybook",
      body: {},
    });

    return resp.DataRecord[0];
  } catch (error) {
    console.log(error);
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
  } finally {
    FullPageLoader.close();
  }
};

export default LeadDayBook;
