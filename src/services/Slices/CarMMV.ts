import { FullPageLoader, LocalStorage } from "@src/Utils";
import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService";

interface RequestType {
  Year: string;
  Make: string;
  Model: string;
  ActionType: string;
  Variant: string;
  Version: string;
  LeadId: string | number;
}

const CarMMV = async (request: RequestType) => {
  try {
    FullPageLoader.open({
      label: "Loading...",
    });

    const { post } = apiCallService();

    const response = await post({
      service: "/App/webservice/CarMMV",
      body: request,
    });

    if (
      response.ERROR !== "0" &&
      !response.MESSAGE.toLowerCase().includes("success")
    ) {
      return null;
    }

    return response.DataRecord;
  } catch (error) {
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
    console.log(error);
    return false;
  } finally {
    FullPageLoader.close();
  }
};

export default CarMMV;
