import { SingleCardType } from "./SingleCardType";
import { HandleSaveImageTypes } from "./HandleSaveImageTypes";
import { Chassis, Data, Question, Side } from "./RealmSchemaTypes";
import { LoginData } from "./LoginFormData";
import { ValuationDataCardProps } from "./ValuationDataCard";
import { AreaDataRecord } from "./ClientCompanyList";
import {
  LeadListStatusWiseResp,
  LeadListStatuswiseRespDataRecord,
} from "./LeadListStatusWiseResp";
import { GetClientCompanyListResponse } from "./GetClientCompanyListResponse";
import { LeadStatusChangeInterface } from "./LeadStatusChange";

export type TextType =
  | "Front Side"
  | "Back Side"
  | "Left Side"
  | "Right Side"
  | "Chassis"
  | "Chassis Imprint"
  | "Chassis Number";

type LeadListStatusMappingType =
  | "SCLeads"
  | "ROLeads"
  | "AssignedLeads"
  | "ReassignedLeads"
  | "RoConfirmationLeads"
  | "QCLeads"
  | "QCHoldLeads"
  | "PricingLeads"
  | "CompletedLeads"
  | "OutofTatLeads"
  | "DuplicateLeads"
  | "RejectedLeads";

export {
  SingleCardType,
  HandleSaveImageTypes,
  Chassis,
  Data,
  Question,
  Side,
  LoginData,
  ValuationDataCardProps,
  AreaDataRecord,
  LeadListStatusMappingType,
  LeadListStatusWiseResp,
  LeadListStatuswiseRespDataRecord,
  GetClientCompanyListResponse,
  LeadStatusChangeInterface,
};
