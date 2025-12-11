import apiCallService from "../apiCallService";
import { FullPageLoader } from "@src/Utils";
import { ToastAndroid } from "react-native";

interface LeadAppointmentDateProps {
  LeadId: string;
  AppointmentDate: Date;
}

const LeadAppointmentDate = async ({
  LeadId,
  AppointmentDate,
}): Promise<void> => {
  try {
    FullPageLoader.open({
      label: "Please wait...",
    });
    const { post } = apiCallService();
    console.log("Request to LeadAppointmentDate", { LeadId, AppointmentDate });
    const resp = await post({
      service: "/App/webservice/LeadAppointmentDate",
      body: {
        LeadId,
        AppointmentDate,
      },
    });
  } catch (error) {
    console.log(error);
    ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
  } finally {
    FullPageLoader.close();
  }
};

export default LeadAppointmentDate;
