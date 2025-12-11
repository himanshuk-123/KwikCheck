export interface LeadRejectRemarkListResponseInterface {
  Error?: string;
  Status?: string;
  MESSAGE?: string;
  DataRecord?: LeadRejectRemarkListResponseDataRecord[];
  DataDetails?: null;
  TotalCount?: number;
}

export interface LeadRejectRemarkListResponseDataRecord {
  id?: number;
  name?: string;
}
