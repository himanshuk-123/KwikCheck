export interface AppLeadDaybook {
  Error?: string;
  Status?: string;
  MESSAGE?: string;
  DataRecord?: AppLeadDaybookDataRecord[];
  DataDetails?: null;
  TotalCount?: number;
}

export interface AppLeadDaybookDataRecord {
  ValuatorId?: number;
  Today?: number;
  lastmonth?: number;
  thismonth?: number;
}
