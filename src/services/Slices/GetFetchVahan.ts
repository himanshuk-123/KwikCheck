import { FullPageLoader } from "@src/Utils"
import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService";
import { FetchVahanAPIData, RCVahan } from "@src/@types/FetchVahanApiData";

const GetFetchVahan = async (leadId: string): Promise<RCVahan | null> => {
    try {
        FullPageLoader.open({
            label: 'Fetching data...',
        });

        const { post } = apiCallService();

        const response: FetchVahanAPIData = await post({
            service: '/App/webservice/LeadReportRcVahan',
            body: {
                "LeadReportDataId": 1,
                "LeadId": leadId
            },
        });

        if (response.ERROR != "0") {
            ToastAndroid.show(response.MESSAGE, ToastAndroid.LONG);
            return null;
        }

        return response.RCVahan[0] || null;
    } catch (error) {
        ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
        console.log(error)
        return null
    } finally {
        FullPageLoader.close();
    }
}

export default GetFetchVahan;