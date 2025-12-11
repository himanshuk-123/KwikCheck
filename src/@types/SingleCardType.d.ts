export interface SingleCardType {
  id: string;
  regNo?: string;
  vehicleName: string;
  requestId: string;
  mode?: string;
  client: string;
  companyName: string;
  isCash: boolean;
  chassisNo: string;
  location: string;
  vehicleStatus: string;
  vehicleType?: string;
  engineNo?: string;
  cashToBeCollected?: string | number;
  make?: string;
  model?: string;
  vehicleFuelType?: string;
  ownershipType?: string;
  HPAStatus?: string;
  mobileNumber?: string;
  leadType?: string;
  leadId?: string | number;
}
