import { FullPageLoader } from "@src/Utils";
import apiCallService from "../apiCallService";
import { AppStepListDataRecord } from "@src/@types/AppStepList";

interface AppStepListProps {
  LeadId: string;
}

const AppStepList = async ({
  LeadId,
}: AppStepListProps): Promise<AppStepListDataRecord[]> | null => {
  try {
    FullPageLoader.open({
      label: "Loading details...",
    });
    const { postWithFormData } = apiCallService();

    const formData = new URLSearchParams({
      LeadId,
      Version: process.env.EXPO_APP_API_VERSION || "2",
      StepName: "",
      DropDownName: "",
    });

    const resp = await postWithFormData({
      service: "App/webservice/AppStepList",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      label: "",
    });
    if (resp.data.ERROR !== "0") {
      return null;
    }
    return resp.data.DataList as AppStepListDataRecord[];
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    FullPageLoader.close();
  }
};

export default AppStepList;
