import { FullPageLoader, LocalStorage } from "@src/Utils";
import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService";

type typeParam =
  | "FuelType"
  | "PaintConditionType"
  | "VehicleConditionTypeBatteryType"
  | "TyresLifeTYpe"
  | "ChassisType"
  | "ExteriorEngineInteriorsside"
  | "ExteriorLeftRightside"
  | "ExteriorFrontRearSide"
  | "RcStatusType"
  | "VehicleTypeMode"
  | "TransmissinType"
  | "ColorsType";

const DropDownListType = async (type: typeParam, category: string) => {
  try {
    FullPageLoader.open({
      label: "Loading...",
    });

    const { post } = apiCallService();

    console.log("This is category -> ", category);
    const response = await post({
      service: "/App/webservice/DropDownListType",
      body: { Version: "2", DropDownName: type, category },
    });

    if (response.ERROR !== "0") {
      ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
      console.log(response);
      return;
    }

    return response.DataList;
  } catch (error) {
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
    console.log(error);
    return false;
  } finally {
    FullPageLoader.close();
  }
};

export default DropDownListType;
