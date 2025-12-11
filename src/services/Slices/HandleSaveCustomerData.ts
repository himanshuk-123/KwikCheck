import { FullPageLoader } from "@src/Utils";
import apiCallService from "../apiCallService";
import { ToastAndroid } from "react-native";

export const HandleSaveCustomerData = async (data: any) => {
  try {
    FullPageLoader.open({
      label: "Fetching data...",
    });

    const resp = await apiCallService().post({
      service: "/App/webservice/CreateLead",
      body: data,
    });

    if (resp.ERROR != "0") {
      ToastAndroid.show(
        resp.MESSAGE || "Something went wrong",
        ToastAndroid.LONG
      );
    } else {
      ToastAndroid.show(resp.MESSAGE || "Success", ToastAndroid.LONG);
    }

    return resp;
  } catch (error) {
    FullPageLoader.close();
    console.log(error);
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
    return {
      Error: "1",
      Message: "Something went wrong",
    };
  } finally {
    FullPageLoader.close();
  }
};
