export interface insertImagesUploadedStatusDBInterface {
  leadId: string;
  leadUId: string;
  uri: string;
  step: string;
  vehicleType?: string;
  imgUrl?: string;
  side?: string;
  regNo?: string;
  prospectNo?: string;
  lastValuated?: string;
  longitude?: string;
  latitude?: string;
}

export interface markLeadSideUploaded {
  leadId: string;
  step: string;
}
