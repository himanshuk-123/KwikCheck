import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService"
import { FullPageLoader } from "@src/Utils";
import { LeadListStatusMappingType, LeadListStatusWiseResp, LeadListStatuswiseRespDataRecord } from "@src/@types";
import { LEAD_LIST_STATUS_MAPPING } from "@src/constants";

export const GetLeadListStatuswise = async (statusType: LeadListStatusMappingType): Promise<LeadListStatuswiseRespDataRecord[] | []> => {
    try {
        FullPageLoader.open({
            label: "Loading...",
        })
        const { post } = apiCallService();
        const resp: LeadListStatusWiseResp = await post({
            service: '/App/webservice/LeadListStatuswise',
            body: {
                Version: process.env.EXPO_API_VERSION || "2",
                StatusId: LEAD_LIST_STATUS_MAPPING[statusType],
                // PageNumber: 1,
                // PageSize: 20,
            },
        })

        if (resp.Error != "0") {
            ToastAndroid.show(resp.MESSAGE || 'Something went wrong', ToastAndroid.LONG);
        }
        console.log("body", {
            Version: process.env.EXPO_API_VERSION || "2",
            StatusId: LEAD_LIST_STATUS_MAPPING[statusType],
            // PageNumber: 1,
            // PageSize: 10,
        });
        return resp?.DataRecord;
    } catch (error) {
        ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
        console.log(error);
        return []
    } finally {
        FullPageLoader.close();
    }
}