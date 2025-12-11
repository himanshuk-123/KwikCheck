import { LeadListStatuswiseRespDataRecord, SingleCardType } from "./index";
export type MyTaskValuate = {
  data: LeadListStatuswiseRespDataRecord;
  vehicleType: string;
};

export interface MyTaskValuateStoreType {
  myTaskValuate: MyTaskValuate;
  setMyTaskValuate: (value: MyTaskValuate) => void;
}
