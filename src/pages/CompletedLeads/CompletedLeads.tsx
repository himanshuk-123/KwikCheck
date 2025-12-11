/** @deprecated use @src/pages/ValuationCompletedLeads/index.tsx */

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import { Box, Card } from "@gluestack-ui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCustomNavigation } from "@src/services/useCustomNavigation";
import { AppLeadCompletedDataRecord } from "@src/@types/AppLeadCompleted";
import AppLeadCompleted from "@src/services/Slices/AppLeadCompleted";
import { COLORS } from "@src/constants/Colors";
import { LeadStyles } from "@src/assets";
import ClubSvg from "@src/assets/Club-svg";
import HSVG from "@src/assets/H-Svg";
import { FullPageLoader } from "@src/Utils";
import { useFocusEffect } from "@react-navigation/native";

type Props = {};

const CompletedLeads = (props: Props) => {
  const [leadsData, setLeadsData] = React.useState<AppLeadCompletedDataRecord>({
    completedLead: 0,
    qccompleted: 0,
    qchold: 0,
    qcpending: 0,
    ValuatorId: 0,
  });
  const { pushNavigation } = useCustomNavigation();

  const navigateToPage = (pgName: string) => {
    pushNavigation(pgName);
  };

  const getData = async () => {
    try {
      FullPageLoader.open({
        label: "Loading...",
      });
      const resp = await AppLeadCompleted();
      console.log("RESP", resp);
      if (resp) setLeadsData(resp);
    } catch (error) {
      console.log(error);
    } finally {
      FullPageLoader.close();
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 15,
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card height={"$40"} width={"45%"} style={styles.flexCenter}>
        <TouchableOpacity onPress={() => navigateToPage("QCLeads")}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Text>QC Pending</Text>
            {/* <MaterialIcons name="pending" size={75} color="black" /> */}
            <ClubSvg />
            <Text
              style={[
                {
                  color: COLORS.AppTheme.primary,
                  fontWeight: "bold",
                  marginTop: 10,
                },
                LeadStyles.textMd,
              ]}
            >
              {leadsData.qcpending}{" "}
              <Text style={[{ color: "black", fontWeight: "normal" }]}>
                Reports
              </Text>
            </Text>
          </Box>
        </TouchableOpacity>
      </Card>
      <Card height={"$40"} width={"45%"} style={styles.flexCenter}>
        <TouchableOpacity onPress={() => navigateToPage("QCCompletedLeads")}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Text>QC Completed</Text>
            {/* <MaterialIcons name="check" size={75} color="black" /> */}
            <HSVG />
            <Text
              style={[
                {
                  color: COLORS.AppTheme.primary,
                  fontWeight: "bold",
                  marginTop: 10,
                },
                LeadStyles.textMd,
              ]}
            >
              {leadsData.qccompleted}{" "}
              <Text style={[{ color: "black", fontWeight: "normal" }]}>
                Reports
              </Text>
            </Text>
          </Box>
        </TouchableOpacity>
      </Card>
      <Card height={"$40"} width={"45%"} style={styles.flexCenter}>
        <TouchableOpacity onPress={() => navigateToPage("QCHoldLeads")}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Text>QC Hold</Text>
            <MaterialIcons
              name="pause"
              size={75}
              color={COLORS.AppTheme.primary}
            />
            <Text
              style={[
                {
                  color: COLORS.AppTheme.primary,
                  fontWeight: "bold",
                  marginTop: 10,
                },
                LeadStyles.textMd,
              ]}
            >
              {leadsData.qchold}{" "}
              <Text style={[{ color: "black", fontWeight: "normal" }]}>
                Reports
              </Text>
            </Text>
          </Box>
        </TouchableOpacity>
      </Card>
      <Card height={"$40"} width={"45%"} style={styles.flexCenter}>
        <TouchableOpacity
          onPress={() => navigateToPage("ValuationCompletedLeads")}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Text>Completed Lead</Text>
            <MaterialCommunityIcons
              name="check-decagram"
              size={75}
              color={COLORS.AppTheme.primary}
            />
            <Text
              style={[
                {
                  color: COLORS.AppTheme.primary,
                  fontWeight: "bold",
                  marginTop: 10,
                },
                LeadStyles.textMd,
              ]}
            >
              {leadsData.completedLead}{" "}
              <Text style={[{ color: "black", fontWeight: "normal" }]}>
                Reports
              </Text>
            </Text>
          </Box>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default CompletedLeads;

const styles = StyleSheet.create({
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
