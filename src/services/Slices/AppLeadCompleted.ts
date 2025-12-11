import { FullPageLoader } from "@src/Utils";
import apiCallService from "../apiCallService";
import { AppStepListDataRecord } from "@src/@types/AppStepList";
import { AppLeadCompletedDataRecord } from "@src/@types/AppLeadCompleted";

interface AppStepListProps {
  LeadId: string;
}

const AppLeadCompleted =
  async (): Promise<AppLeadCompletedDataRecord> | null => {
    try {
      FullPageLoader.open({
        label: "Loading details...",
      });
      const { post } = apiCallService();

      const resp = await post({
        service: "App/webservice/AppLeadCompleted",
        body: {
          Version: process.env.EXPO_APP_API_VERSION || "2",
        },
      });
      if (resp.Error !== "0") {
        return null;
      }
      return resp.DataRecord[0] as AppLeadCompletedDataRecord;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      FullPageLoader.close();
    }
  };

export default AppLeadCompleted;
