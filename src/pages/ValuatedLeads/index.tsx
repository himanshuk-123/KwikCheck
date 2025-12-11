import { ScrollView, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { ValuationDataCard } from "@src/components";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import { LeadStyles } from "@src/assets";
import {
  clearDB,
  getClickedImagesWithLeadId,
  getStatusWithoutLeadId,
} from "@src/db/uploadStatusDb";
import { convertDateString } from "@src/Utils/convertDateString";
import { useCustomNavigation } from "@src/services/useCustomNavigation";
import useApiCall from "@src/services/useApiCall";
import { FullPageLoader, toCamelCase } from "@src/Utils";
import { AppStepList, HandleValuationUpload } from "@src/services/Slices";
import { HandleSaveImage } from "@src/Utils/imageHandlers";
import { readFileAsBase64 } from "@src/Utils/readAsBase64";
import * as Location from "expo-location";
import LeadFindId from "@src/services/Slices/LeadFindId";
import useZustandStore from "@src/store/useZustandStore";

export default function ValuatedLeads() {
  const [data, setData] = React.useState<any>([]);
  const { pushNavigation } = useCustomNavigation();
  const { setMyTaskValuate } = useZustandStore();

  useEffect(() => {
    const getStatusData = getStatusWithoutLeadId();
    console.log("ValuatedLeads Page data", getStatusData);
    setData(getStatusData["response"] ?? []);
  }, []);

  const handleUploadPress = async (data) => {
    console.log("handleUploadPress", data);
    const condition = data.total_count > data.uploaded_count;

    // await clearDB();
    // return;

    if (condition) {
      const leadData = await LeadFindId({
        LeadId: data.leadId,
      });

      console.log("IN LEAD DATA", leadData);
      if (!leadData) {
        return;
      }

      setMyTaskValuate({
        data: leadData,
        vehicleType: "2W",
      });
      pushNavigation("Valuation", {
        id: leadData.LeadUId.toUpperCase(),
        vehicleType: "2W",
      });

      return;
    }

    const clickedSides = await getClickedImagesWithLeadId(data.leadId);
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    console.log(clickedSides);

    if (!clickedSides) {
      return;
    }

    console.log("appStepImageList", clickedSides);
    const appSteps = await AppStepList({
      LeadId: data.leadId,
    });

    // We get Appcolumn from App step list
    // Which we will map in following variable
    const apiParam = {};
    appSteps.map((item) => {
      apiParam[toCamelCase(item.Name)] = item.Appcolumn;
    });

    try {
      FullPageLoader.open({
        label: "Uploading All Images...",
      });
      for (let obj of Object.keys(clickedSides)) {
        try {
          const currentStep = toCamelCase(obj);
          console.log("CLICKED IMG SIDE", data);
          if (clickedSides[currentStep]) {
            // const imgBase64 = await readFileAsBase64(clickedSides[currentStep]);
            await HandleValuationUpload({
              base64String: clickedSides[currentStep],
              paramName: apiParam[currentStep],
              LeadId: data.leadId,
              VehicleTypeValue: data.vehicleType,
              geolocation: {
                lat: location.coords.latitude.toString(),
                long: location.coords.longitude.toString(),
                timeStamp: convertDateString(new Date()),
              },
            });
          }
        } catch (error) {}
      }
    } catch (error) {
    } finally {
      FullPageLoader.close();
    }
  };

  return (
    <ScrollView>
      {data
        ? data.map((item) => {
            return (
              <Box px={"$3"} pt={"$4"} key={item.leadId}>
                <Box style={styles.container}>
                  <ValuationDataCard
                    topLeftComponent={
                      <Box style={styles.topLeftComponent}>
                        <Text
                          style={LeadStyles.textMd} // fontSize={'$lg'}
                          lineBreakMode="middle"
                          numberOfLines={1}
                          color={COLORS.textSecondary}
                          textBreakStrategy="highQuality"
                        >
                          Lead Id:{" "}
                          <Text style={LeadStyles.textMd}>
                            {item["leadId"] ?? "NA"}
                          </Text>
                        </Text>
                        <Text
                          style={LeadStyles.textMd}
                          lineBreakMode="middle"
                          numberOfLines={1}
                          color={COLORS.textSecondary}
                          textBreakStrategy="highQuality"
                        >
                          Reg. Number:{" "}
                          <Text style={LeadStyles.textMd}>
                            {item["regNo"] ?? "NA"}
                          </Text>
                        </Text>
                        <Text
                          style={LeadStyles.textMd}
                          lineBreakMode="middle"
                          numberOfLines={1}
                          color={COLORS.textSecondary}
                          textBreakStrategy="highQuality"
                        >
                          Loan Number:{" "}
                          <Text
                            textTransform="uppercase"
                            style={LeadStyles.textMd}
                          >
                            {item["prospectNo"] ?? "NA"}
                          </Text>
                        </Text>
                      </Box>
                    }
                    bottomLeftComponent={
                      <Box
                        flex={1}
                        display="flex"
                        flexDirection="row"
                        alignItems="baseline"
                      >
                        <Text
                          // fontSize={'$xl'}
                          style={{
                            fontSize: 20,
                          }}
                          color={COLORS.Dashboard.text.Green}
                        >
                          {item["uploaded_count"]}/{item["total_count"]}
                          {"  "}
                        </Text>
                        <Text style={LeadStyles.textLg} bold>
                          UPLOADED
                        </Text>
                      </Box>
                    }
                    topRightComponent={
                      <>
                        <Text
                          color={COLORS.textSecondary}
                          // fontSize={'$md'}
                          style={LeadStyles.textMd}
                          textAlign="right"
                        >
                          Valuated Date
                        </Text>
                        <Text
                          // fontSize={'$xl'}
                          style={LeadStyles.textXl}
                          textAlign="right"
                          color={COLORS.AppTheme.primary}
                        >
                          {item["lastValuated"]
                            ? convertDateString(item["lastValuated"])
                            : "NA"}
                        </Text>
                      </>
                    }
                    bottomRightComponent={
                      <>
                        <Button
                          size="xs"
                          minWidth={"$24"}
                          onPress={() => handleUploadPress(item)}
                        >
                          <Text
                            color="$white" // fontSize={'$xl'}
                            style={LeadStyles.textMd}
                          >
                            {item.total_count > item.uploaded_count
                              ? "Valuate"
                              : "Upload Again"}
                          </Text>
                        </Button>
                      </>
                    }
                  />
                </Box>
              </Box>
            );
          })
        : null}

      <Box paddingVertical={"$2"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 15,
  },
  topLeftComponent: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
});
