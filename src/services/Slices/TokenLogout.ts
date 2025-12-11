import apiCallService from "../apiCallService";
import { FullPageLoader } from "@src/Utils";
import { ToastAndroid } from "react-native";

const TokenLogout = async (): Promise<boolean> => {
  try {
    FullPageLoader.open({
      label: "Please wait...",
    });
    const { post } = apiCallService();
    const resp = await post({
      service: "/App/webservice/TokenLogout",
    });

    return resp.ERROR == "0" ? true : false;
  } catch (error) {
    console.log(error);
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
  } finally {
    FullPageLoader.close();
  }
};

export default TokenLogout;
