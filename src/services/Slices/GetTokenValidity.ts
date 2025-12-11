import { FullPageLoader, LocalStorage } from "@src/Utils"
import { ToastAndroid } from "react-native";
import apiCallService from "../apiCallService";

interface TokenInterface {
    ERROR: string;
    STATUS: string;
    MESSAGE: string;
}


const GetTokenValidity = async (): Promise<boolean> => {
    try {
        FullPageLoader.open({
            label: 'Loading...',
        });

        const { post } = apiCallService();

        const response: TokenInterface = await post({
            service: '/App/webservice/TokenCheck',

        });

        if (response.ERROR === "0" && response.MESSAGE.toLowerCase().includes('success')) {
            return true
        } else {
            return false
        }
    } catch (error) {
        ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
        console.log(error)
        return false
    } finally {
        FullPageLoader.close();
    }
}

export default GetTokenValidity;