import { insertImagesUploadedStatusDB } from "@src/db/uploadStatusDb";
import useZustandStore from "@src/store/useZustandStore";
import * as Location from "expo-location";
import { toCamelCase } from "./toCamelCase";

export const useGetLocationAndInsertInDB = () => {
  const { myTaskValuate } = useZustandStore();

  const getLocationAndInsertInDB = async ({
    imgPath,
    side,
  }: {
    imgPath: string;
    side: string;
  }) => {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    await insertImagesUploadedStatusDB({
      leadUId: myTaskValuate.data.LeadUId,
      leadId: myTaskValuate.data.LeadId,
      uri: imgPath,
      step: toCamelCase(side),
      vehicleType: myTaskValuate.data.VehicleType.toString(),
      imgUrl: imgPath,
      side: toCamelCase(side),
      lastValuated: new Date().toLocaleString(),
      regNo: myTaskValuate.data.RegNo,
      prospectNo: myTaskValuate.data.ProspectNo,
      latitude: location.coords.latitude.toString(),
      longitude: location.coords.longitude.toString(),
    });
  };

  return {
    getLocationAndInsertInDB,
  };
};
