import { FullPageLoader, LocalStorage } from "@src/Utils";
import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService";

interface RequestType {
  Password: string;
  oldPassword: string;
}

const ChangePass = async (request: RequestType) => {
  try {
    FullPageLoader.open({
      label: "Loading...",
    });

    const { post } = apiCallService();
    const userCredentials = await LocalStorage.get("user_credentials");

    const response = await post({
      service: "/App/webservice/ChangePass",
      body: {
        ...request,
        TokenID: userCredentials?.TOKENID || "",
      },
    });

    if (
      response.ERROR !== "0" &&
      !response.MESSAGE.toLowerCase().includes("success")
    ) {
      return false;
    }

    return true;
  } catch (error) {
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
    console.log(error);
    return false;
  } finally {
    FullPageLoader.close();
  }
};

export { ChangePass };
