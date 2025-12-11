import { StyleSheet } from "react-native";
import React from "react";
import { Box, Button, Card, Text } from "@gluestack-ui/themed";
import { ValuationDataCardProps } from "@src/@types";

export default function ValuationDataCard(props: ValuationDataCardProps) {
  const {
    bottomLeftComponent,
    bottomRightComponent,
    topLeftComponent,
    topRightComponent,
    customStyle,
  } = props;

  return (
    <Card style={[{ minHeight: 160 }, customStyle]} maxHeight={"100%"}>
      <Box flex={4}>
        <Box flex={3} style={styles.topContainer} flexGrow={4}>
          <Box maxHeight={"$64"} overflow="hidden">
            {topLeftComponent}
          </Box>
          <Box style={styles.topRightComponent}>{topRightComponent}</Box>
        </Box>
        <Box
          flex={1}
          mb={"$2"}
          style={{
            ...styles.topContainer,
            alignItems: "center",
          }}
        >
          <Box position="absolute" left={0}>
            {bottomLeftComponent}
          </Box>
          <Box position="absolute" right={0}>
            {bottomRightComponent}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
  },
  topRightComponent: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    // paddingVertical: 5,
  },
});
