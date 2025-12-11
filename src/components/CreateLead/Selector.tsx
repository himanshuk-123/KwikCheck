import { Box, HStack, Text, View } from "@gluestack-ui/themed";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { COLORS } from "@src/constants/Colors";
type Props = {
  keyText: string;
  valueText: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

const Selector = ({ disabled = false, ...props }: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={(e) => {
        props?.onPress?.(e);
      }}
    >
      <View style={styles.container} pl={"$3"} alignItems="center">
        <Box>
          <Text fontWeight={"$bold"}>{props.keyText}</Text>
        </Box>
        <Box maxWidth={"100%"}>
          <Box style={styles.dropdownButtonStyle}>
            {/* <Text>{props.valueText || 'Select'}</Text> */}
            {props.valueText ? (
              <Text style={styles.valueText}>{props.valueText}</Text>
            ) : (
              <HStack
                alignItems="center"
                width={"100%"}
                justifyContent="flex-end"
              >
                <Text
                  color={COLORS.textSecondary}
                  style={styles.dropdownSelect}
                >
                  Select
                </Text>
                <FontAwesome6
                  name="arrow-right"
                  size={20}
                  color={COLORS.textSecondary}
                />
              </HStack>
            )}
          </Box>
        </Box>
      </View>
    </TouchableOpacity>
  );
};

export default Selector;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    width: "100%",
  },

  dropdownButtonStyle: {
    width: 170,
    height: 50,
    // backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownSelect: {
    fontSize: 16,
    paddingRight: 10,
    fontWeight: "700",
  },
  valueText: {
    fontWeight: "700",
    color: COLORS.textSecondary,
    justifyContent: "flex-end",
    textAlign: "right",
    width: "100%",
  },
});
