import { ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ValuationDataCard } from "@src/components";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import { LeadStyles } from "@src/assets";
import useApiCall from "@src/services/useApiCall";
import { LeadListStatuswiseRespDataRecord } from "@src/@types";
import { convertDateString } from "@src/Utils/convertDateString";

export default function LeadsInProgress() {
  const { GetLeadListStatuswise } = useApiCall();
  const [leadsInProgress, setLeadsInProgress] = useState<
    LeadListStatuswiseRespDataRecord[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await GetLeadListStatuswise("QCHoldLeads");
      setLeadsInProgress(resp);
    };
    fetchData();
  }, []);

  return (
    <ScrollView>
      <Box px={"$3"} py={"$5"}>
        <Box style={styles.container}>
          {leadsInProgress?.length > 0 ? (
            leadsInProgress.map((lead) => (
              <ValuationDataCard
                key={lead.LeadUId}
                topLeftComponent={
                  <Box style={styles.topLeftComponent}>
                    <Text
                      style={LeadStyles.textStyle}
                      lineBreakMode="middle"
                      numberOfLines={1}
                      textBreakStrategy="highQuality"
                    >
                      Lead Id: <Text>{lead.LeadUId || "NA"}</Text>
                    </Text>
                    <Text
                      style={LeadStyles.textStyle}
                      lineBreakMode="middle"
                      numberOfLines={1}
                      textBreakStrategy="highQuality"
                    >
                      Reg. Number : <Text>{lead.RegNo || "NA"}</Text>
                    </Text>
                    <Text
                      style={LeadStyles.textStyle}
                      lineBreakMode="middle"
                      numberOfLines={1}
                      color={COLORS.textSecondary}
                      textBreakStrategy="highQuality"
                    >
                      Name:{" "}
                      <Text textTransform="uppercase">
                        {lead.CustomerName || "NA"}{" "}
                        {/* TODO: need to Validate from client */}
                      </Text>
                    </Text>
                  </Box>
                }
                bottomLeftComponent={
                  <Box flex={1} display="flex" flexDirection="row">
                    <Text
                      style={LeadStyles.textXl}
                      textTransform="capitalize"
                      color={COLORS.Dashboard.text.Orange}
                    >
                      pending with qc
                      {/* TODO: need to get from client or API */}
                    </Text>
                  </Box>
                }
                topRightComponent={
                  <>
                    <Text
                      color={COLORS.textSecondary}
                      style={LeadStyles.textMd}
                      textAlign="right"
                    >
                      Created Date
                    </Text>
                    <Text
                      style={LeadStyles.textXl}
                      textAlign="right"
                      color={COLORS.AppTheme.primary}
                    >
                      {convertDateString(lead.AddedByDate)}
                      {/* TODO: need to get from client or API */}
                    </Text>
                  </>
                }
                bottomRightComponent={
                  <Box>
                    <Text
                      color={COLORS.textSecondary}
                      style={LeadStyles.textMd}
                      textAlign="right"
                    >
                      Valuated Date
                    </Text>
                    <Text
                      style={LeadStyles.textXl}
                      textAlign="right"
                      color={COLORS.AppTheme.primary}
                    >
                      {convertDateString(lead.QcUpdateDate) || "N/A"}
                      {/* TODO: need to get from client or API */}
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
  noLeadsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
