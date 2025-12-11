export interface GetClientCompanyListResponse {
    Error: string;
    Status: string;
    MESSAGE: string;
    DataRecord: GetClientCompanyListResponseDataRecord[];
    DataDetails: null;
    TotalCount: number;
}

export interface GetClientCompanyListResponseDataRecord {
    id: number;
    name: string;
    name1: string;
}
