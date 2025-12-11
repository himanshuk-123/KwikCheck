import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ValuationDataCard } from "@src/components";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { LeadStyles } from "@src/assets";
import useApiCall from "@src/services/useApiCall";
import { LeadListStatuswiseRespDataRecord } from "@src/@types";
import { convertDateString } from "@src/Utils/convertDateString";
import { FullPageLoader, openUrlInBrowser } from "@src/Utils";

export default function QCHoldLeads() {
  const { GetLeadListStatuswise } = useApiCall();
  const [qcHoldLeads, setQCCompletedLeads] = useState<
    LeadListStatuswiseRespDataRecord[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        FullPageLoader.open({
          label: "Loading leads...",
        });
        const resp = await GetLeadListStatuswise("QCHoldLeads");
        if (resp.length > 0) {
          setQCCompletedLeads(resp);
        }
      } catch (error) {
        console.log(error);
      } finally {
        FullPageLoader.close();
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView>
      <Box px={"$3"} py={"$5"}>
        <Box style={styles.container}>
          {qcHoldLeads.length > 0 ? (
            qcHoldLeads.map((lead) => (
              <ValuationDataCard
                key={lead.LeadUId}
                topLeftComponent={
                  <Box style={styles.topLeftComponent}>
                    <Text
                      // fontSize={'$lg'}
                      style={LeadStyles.textMd}
                      lineBreakMode="middle"
                      numberOfLines={1}
                      color={COLORS.textSecondary}
                      textBreakStrategy="highQuality"
                    >
                      Lead Id:{" "}
                      <Text style={LeadStyles.textMd}>
                        {lead.LeadUId || "NA"}
                      </Text>
                    </Text>
                    <Text
                      // fontSize={'$lg'}
                      style={LeadStyles.textMd}
                      lineBreakMode="middle"
                      numberOfLines={1}
                      color={COLORS.textSecondary}
                      textBreakStrategy="highQuality"
                    >
                      Reg. Number :{" "}
                      <Text style={LeadStyles.textMd}>
                        {lead.RegNo || "NA"}
                      </Text>
                    </Text>
                    <Text
                      style={LeadStyles.textMd}
                      // fontSize={'$lg'}
                      lineBreakMode="middle"
                      numberOfLines={1}
                      color={COLORS.textSecondary}
                      textBreakStrategy="highQuality"
                    >
                      Loan Number:{" "}
                      <Text textTransform="uppercase">
                        {/* TODO: ADD LOAN NUMBER */}
                        {lead.ProspectNo || "NA"}
                      </Text>
                    </Text>
                    <Box display="flex" flexDirection="row">
                      <Text
                        style={[LeadStyles.textMd, { maxWidth: "60%" }]}
                        // fontSize={'$lg'}
                        color={COLORS.textSecondary}
                        height={"$full"}
                        numberOfLines={2}
                      >
                        hold remark:{" "}
                      </Text>
                      <Text
                        textTransform="uppercase"
                        width={"75%"}
                        lineBreakMode="middle"
                        // height={"auto"}
                        style={[LeadStyles.textMd, { marginBottom: 40 }]}
                        numberOfLines={5}
                      >
                        {lead.LeadRemark || "NA"}
                      </Text>
                    </Box>
                  </Box>
                }
                bottomLeftComponent={
                  <Box marginBottom={20}>
                    <Text
                      color={COLORS.textSecondary}
                      // fontSize={'$md'}
                      style={LeadStyles.textMd}
                      textAlign="right"
                    >
                      Created Date
                    </Text>
                    <Text
                      // fontSize={'$2xl'}
                      style={LeadStyles.textMd}
                      color={COLORS.AppTheme.primary}
                    >
                      {/* 04-07-2025 */}
                      {convertDateString(lead.AddedByDate) ?? "N/A"}
                    </Text>
                  </Box>
                }
                topRightComponent={
                  <TouchableOpacity
                    onPress={() => openUrlInBrowser(lead.ViewUrl)}
                  >
                    <Box flex={1} display="flex" flexDirection="row" gap={"$3"}>
                      <Feather name="eye" size={20} color="black" />
                    </Box>
                  </TouchableOpacity>
                }
                bottomRightComponent={
                  <Box marginBottom={20}>
                    <Text
                      color={COLORS.textSecondary}
                      // fontSize={'$md'}
                      style={LeadStyles.textMd}
                      textAlign="right"
                    >
                      Completed Date
                    </Text>
                    <Text
                      style={LeadStyles.textMd}
                      textAlign="right"
                      color={COLORS.Dashboard.text.Green}
                    >
                      {/* 04-07-2025 */}
                      {convertDateString(lead.UpdatedByDate) ?? "N/A"}
                    </Text>
                  </Box>
                }
              />
            ))
          ) : (
            <Box style={styles.noLeadsContainer}>
              <Text style={[{ ...LeadStyles.textXl }, { fontWeight: "500" }]}>
                No leads found.
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
    height: "100%",
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
