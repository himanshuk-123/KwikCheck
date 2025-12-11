import { FullPageLoader } from "@src/Utils";
import apiCallService from "../apiCallService";
import { AppStepListDataRecord } from "@src/@types/AppStepList";

interface AppStepListProps {
  LeadId: string;
}

interface AppErrorMessageDataRecord {
  Error: any;
  Status: any;
  MESSAGE: any;
  DataRecord: any;
  DataDetails: any;
  TotalCount: any;
}

const AppErrorMessage = async ({
  message,
}: {
  message: string;
}): Promise<boolean> => {
  try {
    FullPageLoader.open({
      label: "Loading details...",
    });
    const { post } = apiCallService();

    const resp = await post({
      service: "App/webservice/AppErrorMessage",
      body: { version: "2", ErrorMessage: message },

      label: "",
    });
    if (resp.data.Error !== "0") {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    FullPageLoader.close();
  }
};

export default AppErrorMessage;
