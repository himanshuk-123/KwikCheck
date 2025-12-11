import { LeadListStatusMappingType } from "@src/@types";
import { COLORS } from "./Colors";
import {
  AllApiAcceptedKeys,
  ApiAcceptedKeys,
} from "./DocumentUploadDataMapping";
import { STATE_CITY_LIST } from "./StateCityList";
import {
  MAX_VIDEO_RECORDING_DURATION,
  MAX_VIDEO_RECORDING_DURATION_MS,
} from "./TIME_CONSTANTS";
import { RCVahan } from "@src/@types/FetchVahanApiData";

const LEAD_LIST_STATUS_MAPPING: Record<LeadListStatusMappingType, string> = {
  SCLeads: "1",
  ROLeads: "2",
  AssignedLeads: "3",
  ReassignedLeads: "4",
  RoConfirmationLeads: "5",
  QCLeads: "6",
  QCHoldLeads: "7",
  PricingLeads: "8",
  CompletedLeads: "9",
  OutofTatLeads: "10",
  DuplicateLeads: "11",
  RejectedLeads: "13",
};

/**
 * Mapping for vehicle type from API response.
 * @example
 * '2W' => 1
 * '3W' => 2
 *  1   => "2W"
 *  2   => "3W"
 */
const VEHICLE_TYPE_LIST_MAPPING = {
  "2W": 1,
  "3W": 2,
  "4W": 3,
  FE: 5,
  CV: 4,
  CE: 6,
  "1": "2W",
  "2": "3W",
  "3": "4W",
  "5": "FE",
  "4": "CV",
  "6": "CE",
};

const EMPTY_FETCH_VAHAN_DATA: RCVahan = {
  Id: -1,
  LeadId: "",
  TypeId: -1,
  CustomerNo: "",
  OwnerName: "",
  PresentAddress: "",
  PermanentAddress: "",
  Financier: "",
  Insurer: "",
  RCRegisterNo: "",
  RegisterRTOAddress: "",
  RCRegistrationDate: "",
  RCOwnerSR: "",
  VehicleMake: "",
  color: "",
  chassinumber: "",
  Enginenumber: "",
  VehicleCategory: "",
  VehicleClassDescription: "",
  BodyType: "",
  MobileNo: "",
  RCFitnessValidity: "",
  RCTaxValidity: "",
  InsurancePolicyNumber: "",
  InsuranceValidity: "",
  RcStatus: "",
  Manufacturedate: "",
  VehicleModel: "",
  Fuel: "",
  FuelNorms: "",
  EngineCubicCapacity: "",
  NCRBStatus: "",
  BlackListStatus: "",
  NOCDetails: "",
  PermitNo: "",
  PermitissueDate: "",
  PermitValidfromdate: "",
  permitValiduptodate: "",
  Permittype: "",
  RCStatusasOn: "",
  AddedByDate: "",
  Status: -1,
  RtoCode: "",
  MakeCompany: "",
  WheelBase: "",
  Unladenweight: "",
  Frossweight: "",
  NoofCylinder: "",
  Seatingcapacity: "",
  SleeperCapacity: "",
  StandingCapacity: "",
  Emissionnorms: "",
  RcFatherName: "",
  PermitValidFrom: "",
  PUCCNo: "",
  PUCCUpto: "",
};

/** @description Used for mapping of Questions uploading api */
const MAPPING_FOR_IMAGE_TYPES = {
  "Odmeter Reading": "Odometer",
  "Front Side Image": "FrontExterior",
  "Right side Image": "RightExterior",
  "Right Side Image": "RightExterior",
  "Back Side Image": "BackExterior",
  "Left Side Image": "LeftExterior",
  "Chassis Imprint Image": "ChassisTypeId",
  "Chassis Plate Image": "ChassisPlate",
  "Engine Image": "EngineExterior",
  "Front Tyre Image": "Tyre",
  "Front Right Tyre Image": "Tyre",
  "Front Left Tyre Image": "Tyre",
  "Rear Tyre Image": "Tyre",
  "Rear Right Tyre Image": "Tyre",
  "Rear Left Tyre Image": "Tyre",
  "RC Front Image": "RcStatusTypeId",
  "Rc Front Image": "RcStatusTypeId",
  "RC Back Image": "",
  Dashboard: "InteriorDashboard",
};

const MAPPING_FOR_OPTIONAL_QUESTIONS = {
  "battery condition check": "BatteryCondition",
  "vehicle condition check": "VehicleCondition",
  "check paint condition": "PaintCondition",
};

const SHOW_TEXT_INPUT_FOR_LEAD_REJECT_MODAL = [49];

const DRAWER_ROUTES_DISABLED_FOR_ROLEID = [20];

export {
  COLORS as COLORS_CONSTANTS,
  AllApiAcceptedKeys,
  ApiAcceptedKeys,
  STATE_CITY_LIST,
  MAX_VIDEO_RECORDING_DURATION,
  MAX_VIDEO_RECORDING_DURATION_MS,
  LEAD_LIST_STATUS_MAPPING,
  VEHICLE_TYPE_LIST_MAPPING,
  EMPTY_FETCH_VAHAN_DATA,
  MAPPING_FOR_IMAGE_TYPES,
  MAPPING_FOR_OPTIONAL_QUESTIONS,
  SHOW_TEXT_INPUT_FOR_LEAD_REJECT_MODAL,
  DRAWER_ROUTES_DISABLED_FOR_ROLEID,
};
