import Axios from "axios";
import { LoginData } from "../@types";
import { FullPageLoader, LocalStorage, dismissKeyboard } from "../Utils";
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiCallService from "./apiCallService";
import {
  GetClientCompanyList,
  HandleSaveCustomerData,
  HandleValuationUpload,
  GetCityAreaList,
  GetDashBoard,
  GetLeadListStatuswise,
  GetClientCompanyListWithCompanyId,
  GetFetchVahan,
  GetTokenValidity,
  LeadReportDataCreateedit,
  YardNameStateWise,
  AppStepList,
  GetLeadRejectRemarkList,
  LeadStatusChange,
  TokenLogout,
  DocumentUploadVideo,
  LeadAppointmentDate,
  LeadDayBook,
  AppStepImageList,
} from "./Slices";
import { useCustomNavigation } from "./useCustomNavigation";

const axios = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URI,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.response.use(function (request) {
  // console.log();
  // console.log(`==== REQUEST TO ${request.config.url} ====`);
  // console.log(JSON.stringify(request.data, null, 2));
  // console.log(`========`);
  // console.log();
  return request;
});
axios.interceptors.response.use(function (response) {
  // console.log();
  // console.log(`==== RESPONSE FROM ${response.request._url} ====`);
  // console.log(JSON.stringify(response.data, null, 2));
  // console.log(`========`);
  // console.log();
  return response;
});

const useApiCall = () => {
  const toast = ToastAndroid.show;
  const navigation = useNavigation();
  const { replaceNavigation } = useCustomNavigation();

  const Login = async (data: LoginData) => {
    try {
      if (!data.username || !data.password) {
        toast("Please enter username and password", ToastAndroid.LONG);
        return;
      }
      dismissKeyboard();
      FullPageLoader.open({
        label: "Logging in...",
      });

      const request = {
        service: "/App/webservice/Login",
        body: {
          UserName: data.username,
          Pass: data.password,
          IMEI: "a546acc999b8918e",
          Version: "6",
          IP: "162.158.86.21",
          Location: null,
        },
      };

      console.log("Login request ==> ", request);

      const response = await apiCallService().post(request);

      if (response.ERROR != "0") {
        throw new Error(response.MESSAGE || "Something went wrong!");
      }

      console.log(response);
      await LocalStorage.set("user_credentials", response);

      toast("Success", ToastAndroid.LONG);
      // @ts-ignore
      navigation.replace("Homepage");
    } catch (error: any) {
      toast(error.message || "Something went wrong!", ToastAndroid.LONG);
    } finally {
      FullPageLoader.close();
    }
  };

  return {
    Login,
    GetClientCompanyList,
    HandleSaveCustomerData,
    HandleValuationUpload,
    GetCityAreaList,
    GetDashBoard,
    GetLeadListStatuswise,
    GetClientCompanyListWithCompanyId,
    GetFetchVahan,
    GetTokenValidity,
    YardNameStateWise,
    LeadReportDataCreateedit,
    AppStepList,
    GetLeadRejectRemarkList,
    LeadStatusChange,
    TokenLogout,
    DocumentUploadVideo,
    LeadAppointmentDate,
    LeadDayBook,
    AppStepImageList,
  };
};

export default useApiCall;
