import {
  StyleSheet,
  ToastAndroid,
  View,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  FlatList,
  Text,
  Box,
  Button,
  HStack,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { HorizontalBreak, Selector } from "@src/components";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { RCVahan } from "@src/@types/FetchVahanApiData";
import GetFetchVahan from "@src/services/Slices/GetFetchVahan";
import { EMPTY_FETCH_VAHAN_DATA } from "@src/constants";
import { useCustomNavigation } from "@src/services/useCustomNavigation";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
// !important TODO: Remove this package
// import DateTimePicker from "@react-native-community/datetimepicker";
import CarMMV from "@src/services/Slices/CarMMV";
import useZustandStore from "@src/store/useZustandStore";
import DropDownListType from "@src/services/Slices/DropDownListType";
import { FullPageLoader, LocalStorage } from "@src/Utils";
import LeadReportDataCreateEdit from "@src/services/Slices/LeadReportDataCreateEdit";
import { LeadReportDataCreateedit } from "@src/@types/LeadReportDataCreateEdit";
import { insertLeadsValuated } from "@src/db/uploadStatusDb";

type Props = {};

interface CarData {
  registrationId: string;
  vehicleType: string;
  yearOfManufacture: string;
  make: string;
  model: string;
  variant: string;
  vehicleFuelType: string;
  location: string;
  color: string;
  odometerReading: string;
  ownerName: string;
  HPAStatus: string;
  HPABank: string;
  summary: string;
  chassisNumber: string;
  engineNumber: string;
  customerName: string;
  ownerSerial: string;
  repoDate: any;
  remarks: string;
}

type CarDataKeys =
  | "registrationId"
  | "vehicleType"
  | "yearOfManufacture"
  | "make"
  | "model"
  | "variant"
  | "vehicleFuelType"
  | "location"
  | "color"
  | "odometerReading"
  | "ownerName"
  | "HPAStatus"
  | "HPABank"
  | "chassisNumber"
  | "engineNumber"
  | "customerName"
  | "ownerSerial"
  | "repoDate"
  | "remarks"
  | "summary";

interface setDataType {
  key: CarDataKeys;
  value: string;
}
const DetailsList = ({ first, second }: { first: string; second: string }) => {
  return (
    <HStack justifyContent="space-around" alignItems="center" px={"$2"}>
      <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          minHeight: 50,
        }}
      >
        <Text fontSize={"$lg"} fontWeight={"$bold"}>
          {first}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          borderWidth: 1,
          minHeight: 50,
        }}
      >
        <Text pl={"$2"} fontSize={"$lg"}>
          {second}
        </Text>
      </View>
    </HStack>
  );
};

const InputComponent = ({
  placeholder,
  parameter,
  onChangeText,
  value,
  disabled = false,
}: {
  parameter: string;
  placeholder: string;
  value: string;
  onChangeText: (data: string) => void;
  disabled?: boolean;
}) => {
  return (
    <View
      style={{
        marginVertical: 7,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        // alignItems: 'center',
      }}
    >
      <Input
        variant="outline"
        style={{
          backgroundColor: COLORS.Dashboard.bg.Grey,
          borderWidth: 0,
          height: 50,
        }}
      >
        <InputField
          textTransform="uppercase"
          autoCapitalize="none"
          secureTextEntry={true}
          keyboardType={"visible-password"}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={!disabled}
          style={{ fontWeight: "bold" }}
          value={value}
        />
      </Input>
    </View>
  );
};

/**
 *
 * registration id
 * year of manufacturing
 * fuel type
 * mode
 * variant
 * owner name
 * chassis number
 * engine number
 * owner serial
 * ownership type
 * vehicle summary
 * Color
 * location
 * request id
 * HPA Status
 * HPA Bank
 * @returns
 */
interface ColorType {
  id: number;
  name: string;
}

interface VehicleType extends ColorType {
  category: string;
}

const VehicleDetails = ({ route }: { route: any }) => {
  const { carId } = route.params;
  const insets = useSafeAreaInsets();
  const { popNavigation, replaceNavigation } = useCustomNavigation();
  const [filterData, setFilterData] = useState<string>("");
  const [colorType, setColorType] = useState<ColorType[]>([]);
  const [carData, setCarData] = useState<CarData>({
    registrationId: carId,
    vehicleType: "",
    yearOfManufacture: "",
    make: "",
    model: "",
    variant: "",
    vehicleFuelType: "",
    location: "",
    color: "",
    odometerReading: "",
    ownerName: "Neeraj Dave",
    HPAStatus: "",
    HPABank: "",
    summary: "",
    chassisNumber: "",
    customerName: "",
    engineNumber: "",
    ownerSerial: "",
    repoDate: "",
    remarks: "",
  });
  const [bottomSheetData, setBottomSheetData] = useState<{
    key: CarDataKeys;
    value: string[];
  }>();
  const [fetchVahanApiData, setFetchVahanApiData] = useState<RCVahan>(
    EMPTY_FETCH_VAHAN_DATA
  );
  const { myTaskValuate } = useZustandStore();
  const [MakeType, setMakeType] = useState<string[]>([]);
  const [ModelType, setModelType] = useState<string[]>([]);
  const [VairantType, setVariantType] = useState<string[]>([]);
  const [vehicleFuelType, setVehicleFuelType] = useState<ColorType[]>([]);
  const [vehicleOwnershipType, setvehicleOwnershipType] = useState<
    VehicleType[]
  >([]);
  const [bottomSheetModalState, setBottomSheetModalState] = useState(-1);

  // variables
  const snapPoints = useMemo(() => ["50%", "100%"], []);
  // const MakeType = ["Maruti Suzuki"];
  // const VairantType = ["VDI"];
  // const vehicleOwnershipType = ["Private", "taxi"];
  // const ModelType = ["WagonR", "Swift", "Baleno", "Ertiga"];
  // const vehicleFuelType = ["Petrol", "Diesel", "CNG", "Electric"];
  const HPAStatusData = ["Yes", "No"];
  const HPABankData = ["Kotak"];

  // useEffect(() => {
  // 	(() => {
  // 		const data = VECHICLE_DATA.find((item) => item.id === carId);
  // 		if (data) setCarData(data);
  // 	})();
  // }, []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const setParam = async (param: CarDataKeys, data: string) => {
    await setCarData({
      ...carData,
      [param]: data.toUpperCase(),
    });
  };

  const FetchVahan = async () => {
    const data = await GetFetchVahan(carData.registrationId);
    if (data) {
      setCarData({
        ...carData,
        yearOfManufacture: data.Manufacturedate || "",
      });
      setFetchVahanApiData(data);
      // setCarData({
      //   vehicleType: "",
      //   yearOfManufacture: "",
      //   make: "",
      //   model: "",
      //   variant: "",
      //   vehicleFuelType: "",
      //   location: "",
      //   color: "",
      //   odometerReading: "",
      //   ownerName: "Neeraj Dave",
      //   HPAStatus: "",
      //   HPABank: "",
      //   summary: "",
      //   chassisNumber: "",
      //   customerName: "",
      //   engineNumber: "",
      //   ownerSerial: "",
      //   repoDate: "",
      //   remarks: "",
      // });
    }
  };

  const handleSetData = (key: setDataType["key"], value: any) => {
    // setData({ ...data, [key]: value });
    setCarData({ ...carData, [key]: value });
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const doesExist = (data: string) => {
    return data.length !== 0;
  };

  const getColor = async () => {
    try {
      const resp = await DropDownListType(
        "ColorsType",
        myTaskValuate.vehicleType
      );
      if (resp) setColorType(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const getVehicleType = async () => {
    try {
      const resp = await DropDownListType(
        "VehicleTypeMode",
        myTaskValuate.vehicleType
      );
      if (resp) setvehicleOwnershipType(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const getVehicleFuelType = async () => {
    try {
      const resp = await DropDownListType(
        "FuelType",
        myTaskValuate.vehicleType
      );
      if (resp) setVehicleFuelType(resp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getColor();
    getVehicleType();
    getVehicleFuelType();
  }, []);

  // use effect for selecting year from dropdown
  useEffect(() => {
    const fetchData = async () => {
      if (!carData.yearOfManufacture) {
        return;
      }

      const resp = await CarMMV({
        Make: "",
        Model: "",
        Variant: "",
        Year: carData.yearOfManufacture.split("/")[1],
        ActionType: "YEAR",
        Version: "2",
        LeadId: myTaskValuate.data.Id,
      });

      console.log(
        "RESPPPPP",
        resp.map((item) => item.name)
      );
      if (resp?.length != 0) setMakeType(resp.map((item) => item.name));
    };

    fetchData();
  }, [carData.yearOfManufacture, fetchVahanApiData.Manufacturedate]);

  // use effect for selecting make
  useEffect(() => {
    const fetchData = async () => {
      if (!carData.make) {
        return;
      }

      const resp = await CarMMV({
        Year: carData.yearOfManufacture.split("/")[1],
        Make: carData.make,
        Model: "",
        ActionType: "Make", // Gives Model
        Variant: "",
        Version: "2",
        LeadId: myTaskValuate.data.Id,
      });

      if (resp?.length != 0) setModelType(resp.map((item) => item.name));
    };

    fetchData();
  }, [carData.make]);

  // use effect for selecting make
  useEffect(() => {
    const fetchData = async () => {
      if (!carData.model) {
        return;
      }

      const resp = await CarMMV({
        Year: carData.yearOfManufacture.split("/")[1],
        Make: carData.make,
        Model: carData.model,
        ActionType: "Model", // Gives Varient
        Variant: "",
        Version: "2",
        LeadId: myTaskValuate.data.Id,
      });

      if (resp?.length != 0) setVariantType(resp.map((item) => item.name));
    };

    fetchData();
  }, [carData.model]);

  useEffect(() => {
    const backAction = () => {
      if (bottomSheetModalState == 1) {
        handleCloseModalPress();
      } else {
        return false;
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [bottomSheetModalState]);

  const HandleSubmit = async () => {
    try {
      if (
        (!carData.color && !fetchVahanApiData.color) ||
        !carData.vehicleType ||
        !carData.vehicleFuelType ||
        (!carData.customerName && !fetchVahanApiData.OwnerName) ||
        (!carData.yearOfManufacture && !fetchVahanApiData.Manufacturedate) ||
        !carData.make ||
        !carData.model ||
        !carData.variant ||
        (!carData.chassisNumber && !fetchVahanApiData.chassinumber) ||
        (!carData.engineNumber && !fetchVahanApiData.Enginenumber) ||
        (!carData.ownerSerial && !fetchVahanApiData.RCOwnerSR)
      ) {
        ToastAndroid.show("Please fill all the fields", ToastAndroid.LONG);

        return;
      }
      FullPageLoader.open({
        label: "Please wait...",
      });
      // const data = (await LocalStorage.get("sync_queue"))?.find(
      //   (item) => item.id === carId
      // )?.side;

      const colorId = colorType.find((item) => item.name === carData.color)?.id;
      const fuelTypeId = vehicleFuelType.find(
        (item) => item.name === carData.vehicleFuelType
      )?.id;

      const VehicleTypeModeId = vehicleOwnershipType.find(
        (item) => item.name === carData.vehicleType
      )?.id;

      const request: LeadReportDataCreateedit = {
        Id: 1,
        LeadId: myTaskValuate.data.Id,
        FuelTypeId: fuelTypeId,
        ColorsTypeId: colorId,
        VehicleTypeModeId,
        Summary: carData.remarks,
        LeadList: {
          ProspectNo: myTaskValuate.data.ProspectNo,
          CustomerName: carData.customerName,
          CustomerMobileNo: myTaskValuate.data.CustomerMobileNo,
          Vehicle: myTaskValuate.data.VehicleType,
          ManufactureDate: carData.yearOfManufacture,
          ChassisNo: carData.chassisNumber,
          EngineNo: carData.engineNumber,
        },
        MMVTable: {
          ProspectNo: myTaskValuate.data.ProspectNo,
          CustomerName: carData.customerName,
          OwnerName: carData.customerName,
          CustomerMobileNo: myTaskValuate.data.CustomerMobileNo,
          MobileNo: myTaskValuate.data.CustomerMobileNo,
          Vehicle: myTaskValuate.data.VehicleType,
          VehicleCategory: myTaskValuate.data.VehicleType,
          ManufactureDate: carData.yearOfManufacture,
          Manufacturedate: carData.yearOfManufacture,
          ChassisNo: carData.chassisNumber,
          chassinumber: carData.chassisNumber,
          EngineNo: carData.engineNumber,
          Enginenumber: carData.engineNumber,
          MakeCompany: carData.make,
          VehicleModel: `${carData.model} ${carData.variant}`,
        },
        LeadStatus: "5", // 5 -> RCConfirmationLead
      };

      console.log("LeadReportDataCreateEdit", request);

      const response = await LeadReportDataCreateEdit(request);
      if (response.ERROR == "0") {
        ToastAndroid.show("Saved successfully", ToastAndroid.LONG);
        insertLeadsValuated({
          leadId: myTaskValuate.data.LeadUId.toString(),
        });
        popNavigation(2);
      }
    } catch (error) {
      console.log(error);
    } finally {
      FullPageLoader.close();
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.AppTheme.primaryBg,
      }}
    >
      {/* Content */}
      <ScrollView
        style={{
          //   paddingTop: 10,
          backgroundColor: "white",
        }}
      >
        <Box
          px={"$5"}
          py={"$5"}
          style={{
            paddingVertical: 10,
            backgroundColor: COLORS.AppTheme.primaryBg,
            position: "relative",
          }}
        >
          <HStack justifyContent="space-between" alignItems="center">
            <HStack gap={20} alignItems="center">
              <TouchableOpacity onPress={() => popNavigation(1)}>
                <FontAwesome6 name="arrow-left" size={20} color={"white"} />
              </TouchableOpacity>
              <Text color={"white"} style={{ fontSize: 20 }}>
                Vehicle Details
              </Text>
            </HStack>
            <TouchableOpacity style={styles.fetchVahanBtn} onPress={FetchVahan}>
              <Text color={"black"} style={{ fontSize: 15 }}>
                Fetch vahan
              </Text>
            </TouchableOpacity>
          </HStack>
        </Box>
        <Box px={"$5"} py={"$5"}>
          <InputComponent
            parameter="registrationId"
            placeholder="Registration Number"
            disabled
            onChangeText={async (text) =>
              await setParam("registrationId", text)
            }
            value={carData["registrationId"]}
          />

          <Selector
            keyText="Year of Manufacturing"
            valueText={
              fetchVahanApiData.Manufacturedate
                ? fetchVahanApiData.Manufacturedate
                : carData.yearOfManufacture
            }
            disabled={doesExist(fetchVahanApiData.Manufacturedate)}
            onPress={() => {
              DateTimePickerAndroid.open({
                value: new Date(),
                onChange: (e, date) => {
                  if (e.type !== "dismissed") {
                    setParam(
                      "yearOfManufacture",
                      date
                        ?.toLocaleDateString("en-IN", {
                          month: "2-digit",
                          year: "numeric",
                        })
                        .toString()
                    );
                  }
                },
                mode: "date",
                timeZoneName: "Asia/Kolkata",
                display: "spinner",
              });
            }}
          />
          <HorizontalBreak />
          {fetchVahanApiData.VehicleModel && (
            <>
              <InputComponent
                parameter="chassisNumber"
                disabled
                value={fetchVahanApiData.VehicleModel}
                onChangeText={(e) => {}}
                placeholder=""
              />
              <HorizontalBreak />
            </>
          )}
          <Selector
            keyText="Make"
            valueText={carData.make}
            onPress={() => {
              handlePresentModalPress();
              setBottomSheetData({
                key: "make",
                value: MakeType,
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Model"
            valueText={carData.model}
            onPress={() => {
              if (!carData.make) {
                ToastAndroid.show("Please select Make", ToastAndroid.LONG);
                return;
              }
              handlePresentModalPress();
              setBottomSheetData({
                key: "model",
                value: ModelType || [],
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Variant"
            valueText={carData.variant}
            onPress={() => {
              if (!carData.model) {
                ToastAndroid.show("Please select Model", ToastAndroid.LONG);
                return;
              }
              handlePresentModalPress();
              setBottomSheetData({
                key: "variant",
                value: VairantType || [],
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Vehicle Type"
            valueText={carData.vehicleType}
            onPress={() => {
              if (!carData.variant) {
                ToastAndroid.show("Please select Varient", ToastAndroid.LONG);
                return;
              }
              handlePresentModalPress();
              setBottomSheetData({
                key: "vehicleType",
                value: vehicleOwnershipType.map((item) => item.name) || [],
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Fuel Type"
            valueText={carData.vehicleFuelType}
            onPress={() => {
              if (!carData.vehicleType) {
                ToastAndroid.show(
                  "Please select Vehicle Type",
                  ToastAndroid.LONG
                );
                return;
              }
              handlePresentModalPress();
              setBottomSheetData({
                key: "vehicleFuelType",
                value: vehicleFuelType.map((item) => item.name) || [],
              });
            }}
          />

          <HorizontalBreak />
          <InputComponent
            parameter="chassisNumber"
            disabled={doesExist(fetchVahanApiData.chassinumber)}
            placeholder="Chassis Number"
            onChangeText={(text) => setParam("chassisNumber", text)}
            value={
              fetchVahanApiData.chassinumber
                ? fetchVahanApiData.chassinumber
                : carData["chassisNumber"]
            }
          />

          <InputComponent
            parameter="engineNumber"
            disabled={doesExist(fetchVahanApiData.Enginenumber)}
            placeholder="Engine Number"
            onChangeText={(text) => setParam("engineNumber", text)}
            value={
              fetchVahanApiData.Enginenumber
                ? fetchVahanApiData.Enginenumber
                : carData["engineNumber"]
            }
          />

          <InputComponent
            parameter="customerName"
            disabled={doesExist(fetchVahanApiData.OwnerName)}
            placeholder="Customer Name"
            onChangeText={async (text) => await setParam("customerName", text)}
            value={
              fetchVahanApiData.OwnerName
                ? fetchVahanApiData.OwnerName
                : carData["customerName"]
            }
          />

          <Selector
            keyText="Owner Serial"
            disabled={doesExist(fetchVahanApiData.RCOwnerSR)}
            valueText={
              fetchVahanApiData.RCOwnerSR
                ? fetchVahanApiData.RCOwnerSR
                : carData.ownerSerial
            }
            onPress={() => {
              handlePresentModalPress();
              setBottomSheetData({
                key: "ownerSerial",
                value:
                  [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                  ] || [],
              });
            }}
          />

          <HorizontalBreak />
          <Selector
            keyText="Color"
            disabled={doesExist(fetchVahanApiData.color)}
            valueText={
              fetchVahanApiData.color ? fetchVahanApiData.color : carData.color
            }
            onPress={() => {
              handlePresentModalPress();
              setBottomSheetData({
                key: "color",
                value: colorType.map((item) => item.name) || [],
              });
            }}
          />
          <HorizontalBreak />

          {(carData.vehicleType.toLowerCase() === "repo" ||
            // !carData.vehicleType ||
            myTaskValuate.data.LeadTypeName.toLowerCase() === "repo") && (
            <>
              <Selector
                keyText="Repo Date"
                valueText={carData.repoDate}
                onPress={() => {
                  // handlePresentModalPress();
                  DateTimePickerAndroid.open({
                    value: new Date(),
                    minimumDate: new Date(),
                    onChange: (event, date) => {
                      if (event.type === "dismissed") {
                        setParam("repoDate", "");
                        return;
                      }
                      setParam(
                        "repoDate",
                        date
                          ?.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(/\//g, "-")!
                      );
                    },
                    mode: "date",
                    timeZoneName: "Asia/Kolkata",
                    display: "spinner",
                  });
                }}
              />
              <HorizontalBreak />
            </>
          )}

          <View
            style={{
              marginVertical: 7,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              // alignItems: 'center',
            }}
          >
            <Input
              variant="outline"
              minHeight={100}
              maxHeight={100}
              style={{
                backgroundColor: COLORS.Dashboard.bg.Grey,
                borderWidth: 0,
                // height: 50,
              }}
            >
              <InputField
                autoCapitalize="none"
                secureTextEntry={true}
                keyboardType={"visible-password"}
                multiline
                placeholder={"Remarks"}
                onChangeText={(e) => {
                  setParam("remarks", e);
                }}
              />
            </Input>
          </View>

          <Button onPress={HandleSubmit} style={{ marginTop: 20 }}>
            <Text style={{ color: "white" }}>Submit</Text>
          </Button>
        </Box>
      </ScrollView>
      <Box
        w={"100%"}
        h={"100%"}
        style={{ ...styles.bottomSheetContainer, marginTop: insets.top + 5 }}
      >
        <BottomSheetModalProvider>
          <View style={styles.bottomSheetContainer}>
            <BottomSheetModal
              enablePanDownToClose
              enableDismissOnClose
              onDismiss={handleCloseModalPress}
              ref={bottomSheetModalRef}
              index={1}
              enableOverDrag={false}
              enableDynamicSizing={false}
              enableContentPanningGesture={false}
              // enableHandlePanningGesture={false}
              snapPoints={snapPoints}
              onChange={(e) => {
                if (e !== bottomSheetModalState) {
                  setBottomSheetModalState(e);
                }
              }}
            >
              <BottomSheetView style={styles.contentContainer}>
                <Input
                  mx={"$5"}
                  my={"$3"}
                  mb={"$5"}
                  variant="outline"
                  style={{
                    backgroundColor: COLORS.Dashboard.bg.Grey,
                    borderWidth: 0,
                    height: 50,
                  }}
                >
                  <InputField
                    placeholder="Search"
                    type="text"
                    // autoFocus
                    maxLength={6}
                    onChangeText={(value) => setFilterData(value)}
                  />
                </Input>

                <FlatList
                  initialNumToRender={5}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  removeClippedSubviews
                  w={"100%"}
                  data={bottomSheetData?.value.filter((item) =>
                    item?.toLowerCase()?.includes(filterData.toLowerCase())
                  )}
                  renderItem={({ item }: any) => (
                    <TouchableOpacity
                      style={{
                        padding: 10,
                      }}
                      onPress={() => {
                        if (!bottomSheetData?.key) {
                          ToastAndroid.show(
                            "Something went wrong while saving data",
                            ToastAndroid.SHORT
                          );
                          return;
                        }
                        handleSetData(bottomSheetData?.key, item);
                        handleCloseModalPress();
                        setFilterData("");
                      }}
                    >
                      <Text textAlign="center" textTransform="capitalize">
                        {item.replaceAll("(Client)", "")}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </Box>
    </SafeAreaView>
  );
};

export default VehicleDetails;
const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
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
  bottomSheetContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    position: "absolute",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  fetchVahanBtn: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
  },
});
