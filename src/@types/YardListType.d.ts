export interface YardListResponse {
    Error: string;
    Status: string;
    MESSAGE: string;
    DataRecord: DataRecordYardListResponse[];
    DataDetails: null;
    TotalCount: number;
}

export interface DataRecordYardListResponse {
    id: number;
    name: string;
    ContactPersonName: string;
    ContactNumber: string;
    Address: string;
    StateId: number;
    CityId: number | null;
    AreaId: number | null;
    Longitude: string;
    Latitude: string;
    statename: YardListResponseStatename;
    cityname: string;
    AreaName: null | string;
    Status: YardListResponseStatus;
}

export enum YardListResponseStatus {
    Active = "Active",
}

export enum YardListResponseStatename {
    UttarPradesh = "Uttar Pradesh",
}
