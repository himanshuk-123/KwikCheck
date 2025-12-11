
import { FullPageLoader } from '@src/Utils';
import apiCallService from '../apiCallService';
import { STATE_CITY_LIST } from '@src/constants';
import { ToastAndroid } from 'react-native';
import { GetClientCompanyListResponse } from '@src/@types';

export const GetClientCompanyListWithCompanyId =
    async (companyId: string | number): Promise<GetClientCompanyListResponse> => {
        try {
            FullPageLoader.open({
                label: 'Fetching data...',
            });

            const ClientCompanyList: GetClientCompanyListResponse = await apiCallService().post({
                service: `App/webservice/CompanyVehicleList?companyId=${companyId}`,
            })

            return ClientCompanyList;
        }
        catch (error: any) {
            console.log(error);
            ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
            return {
                DataDetails: null,
                DataRecord: [],
                Error: "1",
                MESSAGE: "Something went wrong",
                Status: "0",
                TotalCount: 0,
            }
        }
        finally {
            FullPageLoader.close()
        }
    }