import { FullPageLoader } from "@src/Utils";
import apiCallService from "../apiCallService";
import { LeadListStatuswiseRespDataRecord } from "@src/@types";
import { ToastAndroid } from "react-native";

interface AppStepListProps {
  LeadId: string;
}

const LeadFindId = async ({
  LeadId,
}: AppStepListProps): Promise<LeadListStatuswiseRespDataRecord> => {
  try {
    FullPageLoader.open({
      label: "Loading details...",
    });
    const { postWithFormData } = apiCallService();

    const resp = await postWithFormData({
      service: "App/webservice/LeadReportFindById",
      body: {
        LeadId,
      },
      headers: {
        "Content-Type": "application/json",
      },
      label: "",
    });
    if (resp.data.ERROR !== "0") {
      ToastAndroid.show(resp.data.MESSAGE, ToastAndroid.SHORT);
      return null;
    }
    console.log("THIS IS RESP FOR LEADREPORTFINDBYID", resp.data);
    return resp.data.LeadList[0] as LeadListStatuswiseRespDataRecord;
  } catch (error) {
    console.log(error);

    return null;
  } finally {
    FullPageLoader.close();
  }
};

export default LeadFindId;
