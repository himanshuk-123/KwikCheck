import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  ButtonText,
  Button,
} from "@gluestack-ui/themed";
import { useState } from "react";
import { COLORS } from "@src/constants/Colors";
import { HStack } from "@gluestack-ui/themed";
import LeadReportDataCreateEdit from "@src/services/Slices/LeadReportDataCreateEdit";
import { MAPPING_FOR_OPTIONAL_QUESTIONS } from "@src/constants";
import useZustandStore from "@src/store/useZustandStore";
import { LeadReportDataCreateedit } from "@src/@types/LeadReportDataCreateEdit";

export default function OptionalInfoModal({
  open,
  Questions,
  Answers,
  closeModal,
  onSubmit,
}) {
  const { myTaskValuate } = useZustandStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const handleSubmit = async () => {
    console.log("IN SUBMIT", Questions.toLowerCase());
    if (!selectedAnswer) return;

    let request: LeadReportDataCreateedit = {
      LeadId: myTaskValuate.data.Id,
    };

    switch (MAPPING_FOR_OPTIONAL_QUESTIONS[Questions?.toLowerCase()]) {
      case "BatteryCondition":
        request = {
          ...request,
          LeadFeature: {
            Battery: selectedAnswer,
          },
        };
        break;
      case "VehicleCondition":
        request = {
          ...request,
          LeadFeature: {
            VehicleCondition: selectedAnswer,
          },
        };
        break;
      case "PaintCondition":
        request = {
          LeadHighlight: { ...request, Chassis: selectedAnswer },
        };
        break;
    }

    LeadReportDataCreateEdit(request);
    onSubmit(selectedAnswer);
  };

  return (
    <Modal isOpen={open} ref={null} closeOnOverlayClick>
      <ModalBackdrop />
      <ModalContent>
        <ModalBody scrollEnabled={false}>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textTransform: "capitalize",
                textAlign: "auto",
                paddingVertical: 10,
              }}
            >
              {Questions}
            </Text>
          </View>
          <View>
            {Answers.split("/").map((item) => (
              <TouchableOpacity
                onPressIn={() => {
                  console.log("CURRENT ITEM", item);
                  if (selectedAnswer !== item) {
                    setSelectedAnswer(item);
                  }
                }}
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      selectedAnswer == item
                        ? COLORS.AppTheme.success
                        : "white",
                  },
                ]}
              >
                {item.split("/").map((currItem, index) => (
                  <Text
                    key={currItem + index}
                    style={[
                      styles.itemText,
                      {
                        color: selectedAnswer == currItem ? "white" : "black",
                      },
                    ]}
                  >
                    {currItem}
                  </Text>
                ))}
              </TouchableOpacity>
            ))}
          </View>
          <HStack py={"$3"} px={"$2"} justifyContent={"center"} width={"100%"}>
            <TouchableOpacity onPress={() => {}}>
              <Button
                size="sm"
                width={"100%"}
                backgroundColor={COLORS.AppTheme.primary}
                // style={{ width: "100%" }}
                borderWidth="$0"
                onPress={handleSubmit}
              >
                <ButtonText>Submit</ButtonText>
              </Button>
            </TouchableOpacity>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 5,
    borderRadius: 5,
    height: 35,
  },
  itemText: {
    fontWeight: "bold",
  },
});
