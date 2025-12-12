import {
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useState } from "react";
import {
  Button,
  ButtonText,
  Card,
  HStack,
  Image,
  Icon,
  PhoneIcon,
  VStack,
  Text,
} from "@gluestack-ui/themed";
import { COLORS_CONSTANTS } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { SingleCardType } from "../../@types";
import { Octicons, EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { HandHoldingImage } from "@src/assets";
import { COLORS } from "@src/constants/Colors";
import * as Linking from "expo-linking";
import useZustandStore from "@src/store/useZustandStore";
import { GetLeadRejectRemarkList } from "@src/services/Slices";
import LeadRejectRemarkListModal from "./LeadRejectRemarkListModal";
import { useRefreshMyTaskPage } from "@src/contexts";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import useApiCall from "@src/services/useApiCall";
import { MAX_LONG_PRESS_FOR_LEAD_REJECT } from "@src/constants/TIME_CONSTANTS";
import { LeadRejectRemarkListResponseDataRecord } from "@src/@types/LeadRejectRemarkListResponse";

type Props = {
  data: SingleCardType;
  vehicleType: string;
  onValuateClick: () => void;
};
type CardTileProps = { textPrimary: string; textSecondary: string };

const CardTile = ({ textPrimary, textSecondary }: CardTileProps) => {
  const RenderIcon = () => {
    switch (textPrimary) {
      case "Request Id":
        return <MaterialIcons name="list-alt" size={20} color="black" />;
      case "Chassis No.":
        return <MaterialIcons name="directions-car" size={20} color="black" />;
      case "Client":
        return <MaterialIcons name="contact-phone" size={20} color="black" />;
      case "Customer":
        return <MaterialIcons name="person" size={20} color="black" />;
      case "Location":
        return <EvilIcons name="location" size={22} color="black" />;
    }
  };
  return (
    <View style={cardTile.container}>
      {/* <MaterialIcons name='contact-phone' size={20} color='black' /> */}
      <RenderIcon />
      <Text style={cardTile.textPrimary}>{textPrimary}</Text>
      <Text
        style={[
          cardTile.textSecondary,
          {
            maxWidth: "60%",
          },
        ]}
      >
        {textSecondary}
      </Text>
    </View>
  );
};

const SingleCard = (props: Props) => {
  const navigation = useNavigation();
  const { setRefresh } = useRefreshMyTaskPage();
  const { setMyTaskValuate } = useZustandStore();
  const [showLeadRejectRemarkList, setShowLeadRejectRemarkList] = useState<{
    open: boolean;
    type: "Reject" | "Remark";
    rejectRemarkList: LeadRejectRemarkListResponseDataRecord[];
  }>({
    open: false,
    type: "Reject",
    rejectRemarkList: [],
  });
  const { LeadAppointmentDate } = useApiCall();
  const isRepoCase = props.data.leadType?.toLowerCase() === "repo";
  // console.log("isRepo", isRepoCase);
  const HandleOpenDialer = async () => {
    if (!props.data.mobileNumber) {
      ToastAndroid.show(
        "Customer mobile number not provided",
        ToastAndroid.LONG
      );
      return;
    }
    const url = `tel:+91 ${props.data.mobileNumber}`;
    await Linking.openURL(url);
  };

  const HandleOpenLeadRejectRemarkList = async (
    type: "Reject" | "Remark" = "Reject"
  ) => {
    if (!props.data.leadId) return;

    const response = await GetLeadRejectRemarkList({
      LeadId: props.data.leadId.toString(),
    });
    setShowLeadRejectRemarkList({
      open: true,
      type,
      rejectRemarkList: response ?? [],
    });
  };

  // console.log("item.Vehicle", props.data, isRepoCase);

  return (
    <>
      <Card
        variant="elevated"
        shadowOpacity={0.5}
        shadowOffset={{ width: 20, height: 10 }}
        style={cardTile.card}
      >
        <TouchableWithoutFeedback
          delayLongPress={MAX_LONG_PRESS_FOR_LEAD_REJECT}
          onLongPress={() => HandleOpenLeadRejectRemarkList("Reject")}
        >
          <View style={styles.topContainer}>
            <Text style={styles.topLeftContainer}>{props.data.regNo}</Text>
            <Text
              style={{
                paddingVertical: 5,
              }}
            >
              {props.data.vehicleName}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          delayLongPress={MAX_LONG_PRESS_FOR_LEAD_REJECT}
          onLongPress={() => HandleOpenLeadRejectRemarkList("Reject")}
        >
          <View style={{ paddingVertical: 10 }}>
            <View style={cardTile.body}>
              <CardTile
                textPrimary="Request Id"
                textSecondary={props.data.requestId}
              />
              <CardTile
                textPrimary="Client"
                textSecondary={
                  isRepoCase ? props.data.client : props.data.companyName
                }
              />

              {isRepoCase ? (
                <CardTile
                  textPrimary="Chassis No."
                  textSecondary={props.data.chassisNo}
                />
              ) : (
                <CardTile
                  textPrimary="Customer"
                  textSecondary={props.data.client}
                />
              )}

              {isRepoCase ? (
                <CardTile
                  textPrimary="Location"
                  textSecondary={props.data.location}
                />
              ) : (
                <CardTile
                  textPrimary="Location"
                  textSecondary={props.data.location}
                />
              )}
            </View>

            <View style={styles.footer}>
              <Button
                size="sm"
                variant="outline"
                borderColor={COLORS_CONSTANTS.secondary}
                // width="$32"
                onPress={() => {
                  DateTimePickerAndroid.open({
                    value: new Date(),
                    timeZoneName: "Asia/Kolkata",
                    display: "clock",
                    minimumDate: new Date(),
                    onChange: (e, date) => {
                      if (e.type === "dismissed") {
                        return;
                      }

                      LeadAppointmentDate({
                        LeadId: props.data.leadId,
                        AppointmentDate: date,
                      });
                    },
                  });
                }}
                action="secondary"
              >
                <ButtonText>Appointment</ButtonText>
              </Button>
              <Button size="sm" variant="solid" action="primary">
                <ButtonText
                  onPress={() => {
                    // setMyTaskValuate({
                    //   data: props.data,
                    //   vehicleType: props.vehicleType,
                    // });

                    console.log("props.data", props.data);
                    props?.onValuateClick?.();

                    // @ts-expect-error
                    navigation.navigate("Valuation", {
                      id: props.data.id,
                      vehicleType: props.vehicleType,
                    });
                  }}
                >
                  Valuate
                </ButtonText>
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          delayLongPress={MAX_LONG_PRESS_FOR_LEAD_REJECT}
          onLongPress={() => HandleOpenLeadRejectRemarkList("Reject")}
        >
          <View style={cardTile.status}>
            <View style={cardTile.statusInner} />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.iconContainer}>
          <VStack space="md">
            <TouchableOpacity onPress={HandleOpenDialer}>
              <Icon as={PhoneIcon} fill={"black"}></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                HandleOpenLeadRejectRemarkList("Remark");
              }}
            >
              <Octicons name="note" size={24} color="black" />
            </TouchableOpacity>
          </VStack>
        </View>

        {props.data.isCash && (
          <View style={styles.iconTextContainer}>
            <VStack space="sm" justifyContent="center">
              <HStack space="lg" alignItems="center">
                <Text fontSize={"$2xl"} fontWeight={"bold"}>
                  ₹ {props.data.cashToBeCollected}
                </Text>
                <Image
                  alt="hand_holding_money"
                  width={25}
                  height={25}
                  source={HandHoldingImage}
                />
              </HStack>
              <Text
                fontSize={"$sm"}
                fontWeight={"$bold"}
                color={COLORS.AppTheme.success}
              >
                Cash to be collected
              </Text>
            </VStack>
          </View>
        )}
      </Card>

      {showLeadRejectRemarkList && (
        <LeadRejectRemarkListModal
          open={showLeadRejectRemarkList.open}
          type={showLeadRejectRemarkList.type}
          onClose={({ isSubmitted }) => {
            setShowLeadRejectRemarkList({
              ...showLeadRejectRemarkList,
              open: false,
              rejectRemarkList: [],
            });
            // Just refresh only when user rejects lead not when user clicks on backdrop and close modal
            if (isSubmitted) {
              setRefresh(true);
            }
          }}
          leadId={props.data.leadId.toString()}
          rejectRemarkList={showLeadRejectRemarkList.rejectRemarkList}
        />
      )}
    </>
  );
};

export default SingleCard;

const styles = StyleSheet.create({
  topContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 20,
  },
  iconTextContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
  },
  topLeftContainer: {
    backgroundColor: "#f0f0f0",
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 5,
    minWidth: "10%",
    maxWidth: "60%",
    paddingLeft: 15,
    paddingRight: 10,
    paddingVertical: 5,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    padding: 10,
  },
});

const cardTile = StyleSheet.create({
  card: {
    padding: 0,
    minHeight: 50,
    marginBottom: 20,
    position: "relative",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  body: {
    display: "flex",
    gap: 10,
    paddingVertical: 15,
    paddingLeft: 20,
  },
  textPrimary: {
    fontWeight: "600",
    color: COLORS_CONSTANTS.primary,
    minWidth: 85,
    maxWidth: 105,
  },
  textSecondary: {
    color: "black",
    fontWeight: "bold",
  },
  status: {
    width: 5,
    height: "100%",
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 75,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  statusInner: {
    backgroundColor: "red",
    width: 5,
    height: "90%",
    position: "absolute",
    top: 13,
    right: 0,
    borderRadius: 75,
  },
});
