import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService"
import { FullPageLoader } from "@src/Utils";

export const GetDashBoard = async () => {
    const { post } = apiCallService();

    try {
        FullPageLoader.open({
            label: "Loading...",
        })
        const resp = await post({
            service: '/App/webservice/AppDashboard',
            body: {
                Version: '2',
            },
        })

        console.log("resp", resp)
        if (resp.Error != 0) {
            return [];
        } else {
            if (resp.Status === "2") {
                return [{
                    Openlead: 0,
                    Assignedlead: 0,
                    ROlead: 0,
                    ReAssigned: 0,
                    RoConfirmation: 0,
                    QC: 0,
                    QCHold: 0,
                    Pricing: 0,
                    CompletedLeads: 0,
                    OutofTATLeads: 0,
                    DuplicateLeads: 0,
                    PaymentRequest: 0,
                    RejectedLeads: 0,
                }]
            }
            return resp.DataRecord || [];
        }
    } catch (error) {
        ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
        return [];
    } finally {
        FullPageLoader.close();
    }
}