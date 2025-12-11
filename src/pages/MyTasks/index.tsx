import {
  Image, ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { SingleCard } from "../../components";
// import { init } from '../../db';
import { Badge, HStack, VStack } from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import { LeadListStatuswiseRespDataRecord } from "@src/@types";
import useApiCall from "@src/services/useApiCall";
import { VEHICLE_TYPE_LIST_MAPPING } from "@src/constants";
import { VehicleCE } from "@src/assets";
import useZustandStore from "@src/store/useZustandStore";
import { useFocusEffect } from "@react-navigation/native";
import { useRefreshMyTaskPage } from "@src/contexts";

type Props = {};

const DisplayIcons = [
  {
    vehicleType: "2W",
    icon: ({ color }: { color: string }) => (
      <Text
        style={{
          fontSize: 23,
          // height: 24,
        }}
      >
        🏍️
      </Text>
      // <FontAwesome6 name='motorcycle' size={24} color={color} />
    ),
  },
  {
    vehicleType: "3W",
    icon: ({ color }: { color: string }) => (
      <Text style={{ fontSize: 24 }}>🛺</Text>
    ),
  },
  {
    vehicleType: "4W",
    icon: ({ color }: { color: string }) => (
      // <MaterialCommunityIcons name='car-side' size={28} color={color} />
      <Text style={{ fontSize: 24, height: 24 }}>🚗</Text>
    ),
  },
  {
    vehicleType: "FE",
    icon: ({ color }: { color: string }) => (
      <Text style={{ fontSize: 24, height: 24 }}>🚜</Text>
    ),
  },
  {
    vehicleType: "CV",
    icon: ({ color }: { color: string }) => (
      <Text style={{ fontSize: 24, height: 24 }}>🚚</Text>
      // <Feather name='truck' size={24} color={color} />
    ),
  },
  {
    vehicleType: "CE",
    icon: ({ color }: { color: string }) => (
      // <MaterialIcons name={'directions-car'} size={24} color={color} />
      <Image
        style={{
          width: 30,
          height: 20,
        }}
        source={VehicleCE}
      />
    ),
  },
];

const MyTasksPage = (props: Props) => {
  const { refresh, setRefresh } = useRefreshMyTaskPage();
  const { setMyTaskValuate } = useZustandStore();
  const [myTasks, setMyTasks] = useState<LeadListStatuswiseRespDataRecord[]>(
    []
  );
  const [countForVehicleTypes, setCountForVehicleTypes] = useState<any>({});
  const searchRef = useRef<any>();
  const [searchText, setSearchText] = useState<string>("");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("2W");
  const { GetLeadListStatuswise } = useApiCall();

  const setCounter = (data: any[]) => {
    let count: any = {};
    data.map((item: any) => {
      // @ts-ignore
      const vehicleType = VEHICLE_TYPE_LIST_MAPPING[item.VehicleType];

      if (count[vehicleType]) {
        count[vehicleType] = count[vehicleType] + 1;
      } else {
        count[vehicleType] = 1;
      }
    });

    console.log("setCountForVehicleTypes", count);
    setCountForVehicleTypes(count);
  };

  const fetchData = async () => {
    const resp = await GetLeadListStatuswise("AssignedLeads");
    setMyTasks(resp);
    setCounter(resp);
  };

  useFocusEffect(
    useCallback(() => {
      setRefresh(false);
      fetchData();
    }, [refresh])
  );

  useEffect(() => {
    setCounter(myTasks?.filter(searchFilter));
  }, [searchText]);

  const vehicleTypeFilter = (item: any) => {
    return (
      item.VehicleType ===
        // @ts-ignore
        VEHICLE_TYPE_LIST_MAPPING[selectedVehicleType.toUpperCase()] ||
      item.VehicleTypeValue ===
        // @ts-ignore
        VEHICLE_TYPE_LIST_MAPPING[selectedVehicleType.toUpperCase()]
    );
  };

  const searchFilter = (item) => {
    if (!searchText || searchText.trim() == "") {
      return true;
    }

    return (
      item.LeadUId?.trim()
        .toLowerCase()
        .includes(searchText.trim().toLowerCase()) ||
      item.CustomerName?.trim()
        .toLowerCase()
        .includes(searchText.trim().toLowerCase()) ||
      item.ChassisNo?.trim()
        .toLowerCase()
        .includes(searchText.trim().toLowerCase())
    );
  };

  const isBillingAllowed = (item: LeadListStatuswiseRespDataRecord) => {
    let isBillingAllowed = false;
    if (!item.LeadTypeName) return isBillingAllowed;

    switch (item.LeadTypeName?.toLowerCase()) {
      case "retail":
        isBillingAllowed = parseInt(item.RetailBillType) === 2;
        break;
      case "repo":
        isBillingAllowed = parseInt(item.RepoBillType) === 2;
        break;
      case "cando":
        isBillingAllowed = parseInt(item.CandoBillType) === 2;
        break;
      case "asset":
        isBillingAllowed = parseInt(item.AssetBillType) === 2;
        break;
    }
    console.log("==== isBillingAllowed", isBillingAllowed);
    return isBillingAllowed;
  };

  return (
    <View style={styles.body}>
      <ScrollView
        style={{
          marginTop: 10,
          width: "100%",
          height: 40,
          display: "flex",
        }}
      >
        <HStack
          space="lg"
          justifyContent="center"
          alignItems="center"
          height={"100%"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          paddingHorizontal={"$10"}
        >
          {DisplayIcons.map((item, index) => (
            <VStack key={index}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    selectedVehicleType === item.vehicleType
                      ? COLORS.AppTheme.success
                      : "white",
                  padding: 5,
                  borderRadius: 50,
                  minWidth: 40,
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setSelectedVehicleType(item.vehicleType);
                }}
              >
                <Badge
                  borderRadius="$full"
                  mb={-14}
                  mr={-18}
                  zIndex={1}
                  variant="solid"
                  bgColor="$red300"
                  alignSelf="flex-end"
                >
                  <Text style={{ fontSize: 14 }}>
                    {countForVehicleTypes[item.vehicleType] || 0}
                  </Text>
                </Badge>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlignVertical: "center",
                    }}
                  >
                    <item.icon
                      color={
                        selectedVehicleType === item.vehicleType
                          ? COLORS.secondary
                          : "black"
                      }
                    />
                  </Text>
                </View>
              </TouchableOpacity>
            </VStack>
          ))}
        </HStack>
      </ScrollView>
      <ScrollView
        style={{
          marginVertical: 5,
          height: "auto",
          marginBottom: 50,
        }}
      >
        <TouchableWithoutFeedback
          style={styles.inputContainer}
          onPress={() => searchRef.current.blur()}
        >
          <View
            style={{
              height: "100%",
            }}
          >
            <View style={styles.rowContainer}>
              <TextInput
                ref={searchRef}
                onChangeText={(txt) => setSearchText(txt)}
                style={styles.input}
                placeholder="Search"
                enabled={false}
              />
              <Feather
                onPress={() => searchRef.current.focus()}
                name="search"
                size={24}
                color="black"
              />
            </View>
            {myTasks?.filter(searchFilter)?.filter(vehicleTypeFilter).length ==
              0 && (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No Data Found..</Text>
              </View>
            )}
            <View>
              {myTasks
                ?.filter(searchFilter)
                ?.filter(vehicleTypeFilter)
                .map((item, index) => {
                  console.log("ITEM ------", item);
                  const isRepoCase =
                    item.LeadTypeName?.toLowerCase() === "repo";

                  return (
                    <View key={index}>
                      <SingleCard
                        onValuateClick={() => {
                          setMyTaskValuate({
                            data: item,
                            vehicleType: selectedVehicleType,
                          });
                        }}
                        data={{
                          id: item.LeadUId.toUpperCase(),
                          regNo: item.RegNo.toUpperCase(),
                          vehicleName: item.Vehicle,
                          chassisNo: item.ChassisNo || "NA",
                          client: isRepoCase
                            ? item.companyname
                            : item.CustomerName,
                          isCash: isBillingAllowed(item),
                          location: isRepoCase ? item.YardName : item.cityname,
                          requestId: item.LeadUId.toUpperCase(),
                          vehicleStatus: "",
                          cashToBeCollected: isRepoCase
                            ? item.RepoFeesAmount
                            : item.RetailFeesAmount,
                          engineNo: item.EngineNo,
                          HPAStatus: "",
                          make: item.Vehicle,
                          model: item.Vehicle,
                          ownershipType: "",
                          mode: "",
                          vehicleType: item.VehicleType.toString(),
                          vehicleFuelType: "",
                          mobileNumber: item.CustomerMobileNo,
                          leadType: item.LeadTypeName,
                          leadId: item.Id,
                          companyName: item.companyname,
                        }}
                        vehicleType={selectedVehicleType}
                      />
                    </View>
                  );
                })}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

export default MyTasksPage;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    // height: '100%',
    // flex: 1,
  },
  container: {
    display: "flex",
    width: "100%",
    // justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "tomato",
    height: 40,
    flexDirection: "row",
  },
  inputContainer: {
    width: "auto",
    height: "100%",
    display: "flex",
    // backgroundColor: '#f9f9f9',
  },
  input: {
    // marginHorizontal: 20,
    width: "80%",
    paddingVertical: 10,
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // backgroundColor: '#f9f9f9',
    backgroundColor: "#fff",
    borderRadius: 9,
    marginBottom: 20,
    fontWeight: "500",
  },
  noDataContainer: {
    marginVertical: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
