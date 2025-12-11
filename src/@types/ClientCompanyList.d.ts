export interface GetClientCompanyListResponse {
    clientCompanyList: ClientCompanyList | null;
    cityList: CityList | null;
    stateList: StateList | null;
    Error: string;
    MESSAGE: string;
}

export interface StateList2 {
    Error: string;
    Status: string;
    MESSAGE: string;
    CircleList: CircleList[];
}

export interface CircleList {
    id: number;
    name: string;
}


export interface GetClientCompanyListRequestError {
    Error: string;
    Status: string;
    MESSAGE: string;
    DataRecord: DataRecord[];
    DataDetails: null;
    TotalCount: number;
}


export interface ClientCompanyList {
    Error: string;
    Status: string;
    MESSAGE: string;
    DataRecord: DataRecord[];
    DataDetails: null;
    TotalCount: number;
}

export interface DataRecord {
    CompanyTypeId: number;
    id: number;
    name: string;
    TypeName: string;
    Addresss: string;
    StateName: string;
    CityName: string;
    Pincode: string;
    Status: string;
}

export interface CityList2 {
    Error: string;
    Status: string;
    MESSAGE: string;
    DataRecord: CityListDataRecord[] | null;
    DataDetails: null;
    TotalCount: number;
}

export interface CityListDataRecord {
    id: string | number;
    name: string;
    stateid?: number | string
}

export interface AreaDataRecord {
    "id": string | number;
    "name": string | number;
    "pincode": string | number;
    "cityname": string | number;
}


interface ListData {
    Error: string;
    Status: string;
    MESSAGE: string;
    DataDetails?: null;
    TotalCount?: number;
}

interface StateListDataRecord {
    id: string | number;
    name: string;
}

interface CityListDataRecord {
    id: string | number;
    name: string;
    stateid: number;
}

interface StateList extends ListData {
    CircleList: StateListDataRecord[];
}

export interface CityList extends ListData {
    DataRecord: CityListDataRecord[];
}

interface StateCityListInterface {
    STATE_LIST: StateList;
    CITY_LIST: CityList;
}
