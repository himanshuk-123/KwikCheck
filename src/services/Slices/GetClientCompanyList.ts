import {
    AreaDataRecord,
    ClientCompanyList,
    GetClientCompanyListRequestError,
    GetClientCompanyListResponse,
} from '@src/@types/ClientCompanyList';
import { FullPageLoader } from '@src/Utils';
import apiCallService from '../apiCallService';
import { STATE_CITY_LIST } from '@src/constants';
import { ToastAndroid } from 'react-native';

export const GetClientCompanyList =
    async (): Promise<GetClientCompanyListResponse> => {
        try {
            FullPageLoader.open({
                label: 'Fetching data...',
            });

            const clientCompanyList = await apiCallService().post({
                service: '/App/webservice/ClientCompanyList',
                body: {
                    Version: '2',
                    TypeName: 'Lead',
                },
            });

            const { CITY_LIST, STATE_LIST } = STATE_CITY_LIST;

            return {
                Error: '1',
                MESSAGE: 'Something went wrong',
                clientCompanyList,
                cityList: CITY_LIST,
                stateList: STATE_LIST
            };
        } catch (error: any) {
            FullPageLoader.close();
            console.log(error);
            return {
                Error: '1',
                MESSAGE: 'Something went wrong',
                clientCompanyList: null,
                cityList: null,
                stateList: null
            };
        } finally {
            FullPageLoader.close();
        }
    };

export const GetCityAreaList = async (cityId: string): Promise<AreaDataRecord[] | []> => {
    try {
        FullPageLoader.open({
            label: 'Fetching area...',
        });
        if (!cityId) {
            ToastAndroid.show("CityId is required", ToastAndroid.LONG);
            return []
        }

        const { post } = apiCallService();

        const resp = await post({
            service: `/App/webservice/CityAreaList?CityId=${cityId}`,
            body: {
                Version: '2',
            },
        });

        if (resp.Error != 0) {
            ToastAndroid.show(resp.MESSAGE || 'Something went wrong', ToastAndroid.LONG);
            return [];
        }

        return resp.DataRecord;
    } catch (error) {
        ToastAndroid.show('Something went wrong', ToastAndroid.LONG);
        return [];
    } finally {
        FullPageLoader.close();
    }
}