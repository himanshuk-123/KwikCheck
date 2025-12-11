import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useEffect, useState } from "react";
import { ValuationDataCard } from "@src/components";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { LeadStyles } from "@src/assets";
import useApiCall from "@src/services/useApiCall";
import { LeadListStatuswiseRespDataRecord } from "@src/@types";
import { convertDateString } from "@src/Utils/convertDateString";
import { openUrlInBrowser, share } from "@src/Utils";
import { LeadDayBook } from "@src/services/Slices";
import { AppLeadDaybookDataRecord } from "@src/@types/AppLeadDayBook";

interface CounterProps {
  primaryText: string;
  count: string | number;
  backgroundStyle: ViewStyle;
}

const Counter = (props: CounterProps) => {
  return (
    <Box style={[styles.counterContainer, props.backgroundStyle]}>
      <Text style={styles.counterPrimaryText}>{props.primaryText}</Text>
      <Text style={styles.counterCount}>{props.count}</Text>
    </Box>
  );
};

export default function ValuationCompletedLeads() {
  const { GetLeadListStatuswise } = useApiCall();
  const [completedLeads, setCompletedLeads] = useState<
    LeadListStatuswiseRespDataRecord[]
  >([]);
  const [dayBook, setDayBook] = useState<AppLeadDaybookDataRecord>({
    lastmonth: 0,
    thismonth: 0,
    Today: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const resp = await GetLeadListStatuswise("CompletedLeads");
      const dayResp = await LeadDayBook();
      setCompletedLeads(resp);
      setDayBook({
        lastmonth: dayResp.lastmonth ?? 0,
        thismonth: dayResp.thismonth ?? 0,
        Today: dayResp.Today ?? 0,
      });
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <Box px={"$3"} py={"$5"}>
        <Box style={styles.counterStack}>
          <Counter
            backgroundStyle={{ backgroundColor: COLORS.Dashboard.bg.Blue }}
            primaryText="TODAY'S COUNT"
            count={dayBook.Today}
          />
          <Counter
            backgroundStyle={{ backgroundColor: COLORS.Dashboard.bg.Green }}
            primaryText="TDM"
            count={dayBook.thismonth}
          />
          <Counter
            backgroundStyle={{ backgroundColor: COLORS.Dashboard.bg.Orange }}
            primaryText="PREV'S MONTH"
            count={dayBook.lastmonth}
          />
        </Box>
        <Box style={styles.container}>
          {completedLeads?.length > 0 ? (
            completedLeads.map((lead) => (
              <ValuationDataCard
                key={lead.LeadUId}
                topLeftComponent={
                  <Box style={styles.topLeftComponent}>
                    <Text
                      style={LeadStyles.textMd}
                      lineBreakMode="middle"
                      numberOfLines={1}
                      color={COLORS.textSecondary}
                      textBreakStrategy="highQuality"
                    >
                      Lead Id:{" "}
                      <Text style={[LeadStyles.textMd, { fontWeight: "bold" }]}>
                        {lead.LeadUId}
                      </Text>
                    </Text>
                    <Text
                      style={LeadStyles.textMd}
                      lineBreakMode="middle"
                      numberOfLines={1}
                      color={COLORS.textSecondary}
                      textBreakStrategy="highQuality"
                    >
                      Reg. Number :{" "}
                      <Text style={[LeadStyles.textMd, { fontWeight: "bold" }]}>
                        {lead.RegNo}
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
                        style={[LeadStyles.textMd, { fontWeight: "bold" }]}
                      >
                        {lead.ProspectNo}
                      </Text>
                    </Text>
                  </Box>
                }
                bottomLeftComponent={
                  <Box display="flex" flexDirection="column">
                    <Text
                      color={COLORS.textSecondary}
                      style={LeadStyles.textMd}
                    >
                      Created Date
                    </Text>
                    <Text
                      style={[LeadStyles.textMd, { fontWeight: "semibold" }]}
                      color={COLORS.AppTheme.primary}
                    >
                      {convertDateString(lead.AddedByDate)}
                    </Text>
                  </Box>
                }
                topRightComponent={
                  <Box flex={1} display="flex" flexDirection="row" gap={"$3"}>
                    <TouchableOpacity
                      onPress={() => openUrlInBrowser(lead.ViewUrl)}
                    >
                      <Feather name="eye" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openUrlInBrowser(lead.DownLoadUrl)}
                    >
                      <Feather name="download-cloud" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => share(lead.ViewUrl)}>
                      <Feather name="share" size={20} color="black" />
                    </TouchableOpacity>
                  </Box>
                }
                bottomRightComponent={
                  <Box>
                    <Text
                      color={COLORS.textSecondary}
                      style={LeadStyles.textMd}
                      textAlign="right"
                    >
                      Completed Date
                    </Text>
                    <Text
                      style={[LeadStyles.textMd, { fontWeight: "semibold" }]}
                      textAlign="right"
                      color={COLORS.Dashboard.text.Green}
                    >
                      {/* 04-07-2025 */}
                      {convertDateString(lead.PriceUpdateDate) || "N/A"}
                    </Text>
                  </Box>
                }
              />
            ))
          ) : (
            <Box style={styles.noLeadsContainer}>
              <Text style={[{ ...LeadStyles.textXl }, { fontWeight: "500" }]}>
                No leads in progress
              </Text>
            </Box>
          )}
        </Box>
      </Box>
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
  counterStack: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
  },
  counterContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 85,
    width: 110,
    borderRadius: 8,
    paddingVertical: 10,
    paddingBottom: 15,
  },

  counterPrimaryText: {
    fontSize: 13,
    color: COLORS.Dashboard.text.Grey,
    fontWeight: "600",
    textAlign: "center",
    verticalAlign: "middle",
    height: 35,
    letterSpacing: 0.25,
  },
  counterCount: {
    fontSize: 30,
    color: COLORS.AppTheme.primary,
    textAlign: "center",
    verticalAlign: "middle",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "600",
    height: "auto",
  },
  noLeadsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
