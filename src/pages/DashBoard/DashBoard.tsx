import { StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MaterialIcons } from "@expo/vector-icons";
import { useCustomNavigation } from "@src/services/useCustomNavigation";
import { PieChart } from "react-native-gifted-charts";
import useApiCall from "@src/services/useApiCall";
import { AppDashboardType } from "@src/@types/Dashboard";
import { useFocusEffect } from "@react-navigation/native";
import { getStatusWithoutLeadId } from "@src/db/uploadStatusDb";
import { DRAWER_ROUTES_DISABLED_FOR_ROLEID } from "@src/constants";
import { LocalStorage } from "@src/Utils";

type Props = {};

const DisplayComponent = ({
  value,
  text,
  icon,
  color,
  redirectTo,
}: {
  value: any;
  text: string;
  icon: string;
  color: "Grey" | "Orange" | "Blue" | "Green";
  redirectTo?: string;
}) => {
  const { pushNavigation } = useCustomNavigation();

  return (
    <Box style={styles.displayContainer}>
      <Box
        style={{
          ...styles.displayValueContainer,
          backgroundColor: COLORS.Dashboard.bg[color],
        }}
      >
        <Text
          fontSize={"$lg"}
          bold
          minWidth={"$10"}
          textAlign="center"
          color={COLORS.Dashboard.text[color]}
        >
          {value}
        </Text>
      </Box>
      <Box
        onTouchEnd={() => redirectTo && pushNavigation(redirectTo)}
        style={{
          ...styles.displayTextContainer,
          backgroundColor: COLORS.Dashboard.bg.Grey,
        }}
      >
        <MaterialIcons
          // @ts-ignore
          name={icon}
          size={24}
          color={COLORS.Dashboard.text[color]}
        />
        <Text
          ml={"$1"}
          fontWeight={"$medium"}
          color={COLORS.primary}
          textTransform="uppercase"
          fontSize={"$lg"}
        >
          {text}
        </Text>
        <Box style={{ position: "absolute", right: 10 }}>
          <FontAwesome6
            name="arrow-right"
            size={24}
            color={COLORS.Dashboard.text[color]}
          />
        </Box>
      </Box>
    </Box>
  );
};

const DashBoard = (props: Props) => {
  const { pushNavigation } = useCustomNavigation();
  const { GetDashBoard } = useApiCall();
  const [dashBoardData, setDashBoardData] = React.useState<AppDashboardType>({
    Openlead: 0,
    ROlead: 0,
    Assignedlead: 0,
    ReAssigned: 0,
    RoConfirmation: 0,
    QC: 0,
    QCHold: 0,
    Pricing: 0,
    CompletedLeads: 0,
    OutofTATLeads: 0,
    DuplicateLeads: 0,
    PaymentRequest: 0,
    RejectedLeads: 0,
  });

  const [valuationData, setValuationData] = useState<any>([]);
  const [roleId, setRoleId] = useState<number>(-1);

  // const data = [
  //   {
  //     value: dashBoardData?.["Assignedlead"] || 0,
  //     color: COLORS.Dashboard.bg.Grey,
  //   },
  //   { value: 10, color: COLORS.Dashboard.text.Orange },
  //   { value: dashBoardData?.["QCHold"], color: COLORS.Dashboard.text.Blue },
  //   {
  //     value: dashBoardData?.["CompletedLeads"],
  //     color: COLORS.Dashboard.text.Green,
  //   },
  // ];
const [data, setData] = useState([
  { value: 0, color: COLORS.Dashboard.bg.Grey },
  { value: 0, color: COLORS.Dashboard.text.Orange },
  { value: 0, color: COLORS.Dashboard.text.Blue },
  { value: 0, color: COLORS.Dashboard.text.Green },
]);
  const HandleNavigation = () => {
    pushNavigation("CreateLeads");
  };

  const fetchData = async () => {
    const response = await GetDashBoard();
    const valuatedLeads = getStatusWithoutLeadId();
    const userCreds = await LocalStorage.get("user_credentials");
    setRoleId(userCreds.RoleId);

    const dashboardCountData = valuatedLeads["response"];
    console.log("response", response);
    console.log("dashboardCountData", valuatedLeads);
    setDashBoardData({
      ...dashBoardData,
      ...response[0],
    });
    setValuationData(valuatedLeads["total"]);
    if (response?.[0] && valuatedLeads) {
    setData([
      {
        value: response[0]?.Assignedlead || 0,
        color: COLORS.Dashboard.bg.Grey,
      },
      {
        value: valuatedLeads.total || 0,
        color: COLORS.Dashboard.text.Orange,
      },
      {
        value: response[0]?.QCHold || 0,
        color: COLORS.Dashboard.text.Blue,
      },
      {
        value: response[0]?.CompletedLeads || 0,
        color: COLORS.Dashboard.text.Green,
      },
    ]);
  }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <Box
      pl={"$5"}
      pt={"$5"}
      backgroundColor="white"
      flex={1}
      position="relative"
    >
      <Text fontSize={"$xl"}>Hello,</Text>
      <Text
        fontSize={"$3xl"}
        bold
        maxWidth={"80%"}
        color={COLORS.AppTheme.primary}
        // maxFontSizeMultiplier={2}
      >
        {dashBoardData["Name"]}
      </Text>
      <Box pt={"$6"} />

      <Box style={styles.pieChartContainer} mb={"$5"}>
        
        <PieChart
          data={data}
          radius={60}
          animationDuration={2000}
          isAnimated
          showValuesAsLabels
        />
      </Box>

      {!DRAWER_ROUTES_DISABLED_FOR_ROLEID.includes(roleId) && (
        <DisplayComponent
          value={dashBoardData["Assignedlead"]?.toString()}
          text="Assigned"
          icon={"content-copy"}
          color="Grey"
          redirectTo={"My Tasks"}
        />
      )}
      {!DRAWER_ROUTES_DISABLED_FOR_ROLEID.includes(roleId) && (
        <DisplayComponent
          value={valuationData ?? "00"}
          text="Valuated"
          icon={"cameraswitch"}
          color="Orange"
          redirectTo={"ValuatedLeads"}
        />
      )}
      <DisplayComponent
        value={dashBoardData["QCHold"]?.toString()}
        text="Progress"
        icon={"pending-actions"}
        color="Blue"
        redirectTo={"LeadsInProgress"}
      />
      <DisplayComponent
        value={dashBoardData["CompletedLeads"]?.toString()}
        text="Completed"
        icon={"assignment-turned-in"}
        color="Green"
        redirectTo={"ValuationCompletedLeads"}
      />

      <Box mr={"$5"} style={styles.CreateLeadBtn}>
        <Button
          backgroundColor={COLORS.AppTheme.primary}
          onPress={HandleNavigation}
        >
          <Text textTransform="uppercase" color="white" fontSize={"$xl"}>
            Create Lead
          </Text>
        </Button>
      </Box>
    </Box>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  displayContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  displayValueContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  displayTextContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    minWidth: "60%",
    position: "relative",
  },
  CreateLeadBtn: {
    position: "absolute",
    bottom: 30,
    left: 10,
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  pieChartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
});
