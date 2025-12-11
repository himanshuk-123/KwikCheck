import { FullPageLoader } from "@src/Utils";
import apiCallService from "../apiCallService";
import { AppStepImageListType } from "@src/@types/AppStepImageList";

interface AppStepListProps {
  LeadId: string;
}

const AppStepImageList = async ({ LeadId }: AppStepListProps) => {
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
      service: "App/webservice/AppStepImageList",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      label: "",
    });
    if (resp.data.ERROR !== "0") {
      return null;
    }
    return resp.data.DataList[0] as AppStepImageListType;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    FullPageLoader.close();
  }
};

export default AppStepImageList;
