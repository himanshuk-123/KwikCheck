import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useLayoutEffect } from "react";
import { LeadRejectRemarkListResponseDataRecord } from "@src/@types/LeadRejectRemarkListResponse";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  ButtonText,
  Button,
  HStack,
} from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import { LeadStatusChange } from "@src/services/Slices";
import CustomInput from "../CustomInput";
import { SHOW_TEXT_INPUT_FOR_LEAD_REJECT_MODAL } from "@src/constants";

interface Props {
  leadId: string;
  open: boolean;
  type: "Remark" | "Reject";
  rejectRemarkList: LeadRejectRemarkListResponseDataRecord[];
  onClose: ({ isSubmitted }: { isSubmitted: boolean }) => void;
}

/** Used in
 *  @module SingleCard
 * */
export default function LeadRejectRemarkListModal({
  leadId,
  open,
  type,
  rejectRemarkList,
  onClose,
}: Props) {
  const [selectedAnswer, setSelectedAnswer] =
    useState<LeadRejectRemarkListResponseDataRecord | null>(null);
  const [otherRemark, setOtherRemark] = useState<string>("");

  const HandleSubmit = async () => {
    if (
      selectedAnswer &&
      SHOW_TEXT_INPUT_FOR_LEAD_REJECT_MODAL.includes(selectedAnswer.id) &&
      !otherRemark
    )
      return;

    const request = {
      LeadId: leadId,
      RemarkId: selectedAnswer?.id,
      RemarkMessage: otherRemark.toUpperCase(),
      type,
    };
    // console.log("request to LeadStatusChange", request);
    const leadStatusChanged = await LeadStatusChange(request);

    setSelectedAnswer(null);
    setOtherRemark("");
    onClose({ isSubmitted: true });
  };

  return (
    <Modal isOpen={open} ref={null} closeOnOverlayClick={true}>
      <ModalBackdrop
        onPress={() => {
          setSelectedAnswer(null);
          setOtherRemark("");
          onClose({ isSubmitted: false });
        }}
      />
      <ModalContent>
        <ModalBody scrollEnabled={true} maxHeight={400}>
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
              Lead {type}
            </Text>

            {rejectRemarkList.map((item) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    // console.log("CURRENT ITEM", item);
                    if (selectedAnswer?.name !== item.name) {
                      setSelectedAnswer(item);
                    }
                  }}
                  style={[
                    styles.item,
                    {
                      backgroundColor:
                        selectedAnswer?.name === item.name
                          ? COLORS.AppTheme.success
                          : "white",
                    },
                  ]}
                >
                  {/* {item.split("/").map((currItem, index) => ( */}
                  <Text
                    key={item.id}
                    style={[
                      styles.itemText,
                      {
                        color:
                          selectedAnswer?.name === item.name
                            ? "white"
                            : "black",
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  {/* ))} */}
                </TouchableOpacity>
              );
            })}

            {SHOW_TEXT_INPUT_FOR_LEAD_REJECT_MODAL.includes(
              selectedAnswer?.id
            ) && (
              <CustomInput
                onChangeText={(txt) => {
                  if (txt !== otherRemark) {
                    setOtherRemark(txt);
                  }
                }}
                placeholder="Remarks"
                value={otherRemark}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={() => {}}
            style={{ paddingTop: 10, padding: 10 }}
          >
            <Button
              size="sm"
              width={"100%"}
              backgroundColor={COLORS.AppTheme.primary}
              borderWidth="$0"
              onPress={HandleSubmit}
            >
              <ButtonText>Submit</ButtonText>
            </Button>
          </TouchableOpacity>
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
    padding: 5,
    borderRadius: 5,
    minHeight: 35,
  },
  itemText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
