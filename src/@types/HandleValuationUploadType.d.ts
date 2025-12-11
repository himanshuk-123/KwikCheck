export interface HandleValuationUploadType {
  base64String: string;
  paramName: string;
  LeadId?: string;
  VehicleTypeValue?: string;
  geolocation?: {
    lat: string;
    long: string;
    timeStamp: string;
  };
}
