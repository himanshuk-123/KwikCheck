import { YardListResponse } from "@src/@types/YardListType";
import apiCallService from "../apiCallService";
import { FullPageLoader } from "@src/Utils";
import { ToastAndroid } from "react-native";

const YardNameStateWise = async (StateId: string): Promise<YardListResponse> => {
    try {
        FullPageLoader.open({
            label: 'Please wait...'
        })
        const { post } = apiCallService();
        const resp: YardListResponse = await post({
            service: '/App/webservice/YardList',
            body: {
                "Version": "2",
                StateId
            }
        });

        return resp;
    } catch (error) {
        console.log(error);
        ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
    } finally {
        FullPageLoader.close()
    }
}

export default YardNameStateWise