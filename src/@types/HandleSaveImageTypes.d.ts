import { TextType } from ".";
import { SideType } from "./RealmSchemaTypes";

export interface HandleSaveImageTypes {
  uri: string;
  id: string;
  side: string;
  answer?: string;
  removePreviousImage: boolean;
  totalLength?: number;
}
