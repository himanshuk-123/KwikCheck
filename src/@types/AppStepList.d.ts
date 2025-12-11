export interface AppStepListDataRecord {
  Id?: number;
  Name?: string;
  VehicleType?: string;
  Images?: boolean;
  Display?: number;
  Questions?: string;
  Answer?: string;
  Appcolumn?: string;
}

export interface AppStepListQuestion {
  Id?: number;
  Name?: string;
  VehicleType?: string;
  Display?: number;
  Questions?: string | string[] | null;
  Answer?: string;
}
