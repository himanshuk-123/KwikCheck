import {
  BackHandler,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CustomInput, Layout, Selector } from "@src/components";
import {
  Box,
  Button,
  Divider,
  Input,
  InputField,
  Text,
} from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import {
  AreaDataRecord,
  CircleList,
  CityListDataRecord,
  ClientCompanyList,
} from "@src/@types/ClientCompanyList";
import useApiCall from "@src/services/useApiCall";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FlatList } from "@gluestack-ui/themed";
import { STATE_CITY_LIST } from "@src/constants";
import {
  GetCityAreaList,
  GetClientCompanyListWithCompanyId,
  YardNameStateWise,
} from "@src/services/Slices";
import { useCustomNavigation } from "@src/services/useCustomNavigation";
import { GetClientCompanyListResponseDataRecord } from "@src/@types/GetClientCompanyListResponse";

type Props = {};

interface setDataType {
  key:
    | "clientName"
    | "vehicleType"
    | "vehicleCategory"
    | "clientCity"
    | "registrationNumber"
    | "propspectNumber"
    | "customerName"
    | "customerMobile"
    | "customerState"
    | "customerCity"
    | "customerArea"
    | "customerPin"
    | "yardName"
    | "chassisNo"
    | "customerAddress";
  value: string;
}

const CreateLeads = (props: Props) => {
  const [companyData, setCompanyData] = useState<ClientCompanyList>();
  const { popNavigation } = useCustomNavigation();
  const [bottomSheetModalState, setBottomSheetModalState] = useState(-1);
  const [data, setData] = useState({
    clientName: "",
    vehicleType: "",
    vehicleCategory: "",
    clientCity: "",
    registrationNumber: "",
    propspectNumber: "",
    customerName: "",
    customerMobile: "",
    customerState: "",
    customerCity: "",
    customerArea: "",
    customerPin: "",
    customerAddress: "",
    yardName: "",
    chassisNo: "",
  });
  const { GetClientCompanyList, HandleSaveCustomerData } = useApiCall();
  const [bottomSheetData, setBottomSheetData] = useState<{
    key:
      | "clientName"
      | "vehicleType"
      | "vehicleCategory"
      | "clientCity"
      | "registrationNumber"
      | "propspectNumber"
      | "customerName"
      | "customerMobile"
      | "customerState"
      | "customerCity"
      | "customerArea"
      | "customerPin"
      | "yardName"
      | "chassisNo"
      | "customerAddress";
    value: string[];
  }>();
  const [apiData, setApiData] = useState<{
    cityData: CityListDataRecord[];
    clientNameData: string[];
    stateNameData: string[];
    areaData: AreaDataRecord[];
  }>({
    cityData: [],
    clientNameData: [],
    stateNameData: [],
    areaData: [],
  });
  const [filterData, setFilterData] = useState<string>("");
  const [yardData, setYardData] = useState<CircleList[]>([]);
  const [vehicleType, setVehicleType] = useState<
    GetClientCompanyListResponseDataRecord[]
  >([]);
  // const vehileTypes = ['Retail', 'Repo'];
  const vehileCategory = ["2w", "3W", "4W", "FE", "CV", "CE"];

  const HandleSubmit = async () => {
    const isRetail = data.vehicleType === "Retail";
    const isRepo = data.vehicleType.toLowerCase() === "repo";

    if (isRetail) {
      if (
        !data.clientName ||
        !data.vehicleType ||
        !data.vehicleCategory ||
        !data.clientCity ||
        !data.registrationNumber ||
        !data.propspectNumber ||
        !data.customerName ||
        !data.customerMobile ||
        !data.customerPin
      ) {
        console.log(
          "#####1",
          !data.clientName,
          !data.vehicleType,
          !data.vehicleCategory,
          !data.clientCity,
          !data.registrationNumber,
          !data.propspectNumber,
          !data.customerName,
          !data.customerMobile,
          !data.customerPin
        );

        ToastAndroid.show(
          "Please fill all the mandatory detail",
          ToastAndroid.LONG
        );
        return;
      }
      if (!data.customerState || !data.customerCity || !data.customerArea) {
        console.log("#####2");
        ToastAndroid.show(
          "Please fill all the mandatory detail",
          ToastAndroid.LONG
        );
        return;
      }
    } else if (data.vehicleType.toLowerCase() == "repo") {
      console.log("#####3");
      if (!data.yardName || !data.chassisNo) {
        ToastAndroid.show(
          "Please fill all the mandatory detail",
          ToastAndroid.LONG
        );
        return;
      }
    }

    const findCityId = (city: string | undefined) => {
      return apiData.cityData?.find((item) => item.name === city)?.id || 0;
    };

    const findAreaId = (area: string | undefined) => {
      return apiData.areaData?.find((item) => item.name === area)?.id || 0;
    };

    const findStateId = (state: string | undefined) => {
      return (
        STATE_CITY_LIST.STATE_LIST.CircleList.find(
          (item) => item.name === state
        )?.id || 0
      );
    };

    const findYardId = (state: string | undefined) => {
      return yardData?.find((item) => item.name === state)?.id || 0;
    };

    const clientCompanyName = companyData?.DataRecord.find(
      (item) => item.name === data.clientName
    );
    const vehicleCategoryId = vehicleType?.find(
      (item) => item.name === data.vehicleType
    );

    const reqObj = {
      // @ts-ignore
      // Id: parseInt(Math.random() * 100),
      CompanyId: clientCompanyName?.id,
      RegNo: data.registrationNumber.toUpperCase(),
      ProspectNo: data.propspectNumber.toUpperCase(),
      CustomerName: data.customerName.toUpperCase(),
      CustomerMobileNo: data.customerMobile,
      Vehicle: data.vehicleCategory.toUpperCase(),
      StateId: findStateId(data.customerState),
      City: !isRepo ? findCityId(data.customerCity) : "",
      Area: isRetail ? findAreaId(data.customerArea) : "",
      Pincode: data.customerPin,
      ManufactureDate: "",
      ChassisNo: isRetail ? "" : data.chassisNo.toUpperCase(),
      EngineNo: "",
      StatusId: 1,
      ClientCityId: !isRepo ? findCityId(data.clientCity) : "",
      VehicleType: vehicleCategoryId?.id,
      vehicleCategoryId: vehicleCategoryId?.id,
      VehicleTypeValue: data.vehicleCategory.toUpperCase(),
      YardId: isRepo ? findYardId(data.yardName) : 0,
      autoAssign: 1,
      version: "2",
    };

    console.log("CREATELEADS", reqObj);

    const resp = await HandleSaveCustomerData(reqObj);
    if (resp.ERROR === "0") {
      console.log("OK TILL HERE");
      popNavigation();
    }
  };

  useEffect(() => {
    (async () => {
      const {
        clientCompanyList: apiDataRes,
        cityList,
        stateList,
      } = await GetClientCompanyList();

      if (apiDataRes?.Error === "0") {
        // const cityData =
        // 	apiDataRes?.DataRecord?.map((item) => item.CityName) || [];
        const clientNameData =
          apiDataRes?.DataRecord?.map((item) => item.name) || [];
        const stateNameData = new Set(
          stateList?.CircleList.map((item) => item.name)
        );

        setCompanyData(apiDataRes);

        setApiData({
          cityData: cityList?.DataRecord || [],
          clientNameData,
          stateNameData: [...stateNameData],
          areaData: [],
        });
      }
    })();
  }, []);

  const handleSetData = (key: setDataType["key"], value: any) => {
    console.log("handleSetData", key, value);
    setData({ ...data, [key]: value });
  };

  useEffect(() => {
    handleSetData("customerArea", "");
    handleSetData("customerPin", "");
    handleSetData("customerAddress", "");
  }, [data.vehicleType]);

  useEffect(() => {
    const getYardName = async () => {
      if (data.vehicleType.toLowerCase() !== "repo") {
        return;
      }

      const customerStateId =
        STATE_CITY_LIST.STATE_LIST.CircleList.find(
          (item) => item.name === data.customerState
        )?.id || 0;
      const yardNameData = await YardNameStateWise(customerStateId.toString());
      if (yardNameData.Error !== "0") {
        return;
      }
      setYardData(yardNameData.DataRecord);
    };

    getYardName();
  }, [data.vehicleType, data.customerState]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["50%", "100%"], []);

  /**
   * Hides/Shows Modal
   */
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
    bottomSheetModalRef.current?.present();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    const currentStateId = STATE_CITY_LIST.STATE_LIST.CircleList.find(
      (item) => item.name === data.customerState
    )?.id;
    const currentCityList = STATE_CITY_LIST.CITY_LIST.DataRecord.filter(
      (item) => item.stateid === currentStateId
    );

    setApiData({
      ...apiData,
      cityData: currentCityList,
    });
    setData({
      ...data,
      customerCity: "",
      customerArea: "",
      customerPin: "",
    });
  }, [data.customerState]);

  useEffect(() => {
    // Api call to get Area data and setapiData with it.
    const getCityAreaFn = async (currentCityId: string) => {
      const areaList = await GetCityAreaList(currentCityId);
      setApiData({
        ...apiData,
        areaData: areaList.length ? areaList : [],
      });
    };

    if (data.customerCity) {
      const currentCityId = STATE_CITY_LIST.CITY_LIST.DataRecord.find(
        (item) => item.name === data.customerCity
      )?.id;

      console.log("CURRENTCITYID", data.customerCity, currentCityId);
      getCityAreaFn(currentCityId?.toString() || "");
    }

    setData({
      ...data,
      customerArea: "",
      customerPin: "",
    });
  }, [data.customerCity]);

  useEffect(() => {
    if (data.customerArea) {
      const currentAreaId = apiData?.areaData?.find(
        (item) => item.name === data.customerArea
      )?.pincode;
      setData({
        ...data,
        customerPin: currentAreaId?.toString() || "",
      });
    }
  }, [data.customerArea]);

  useEffect(() => {
    console.log("customerNameId", data);

    const fetchData = async () => {
      const clientCompanyName = companyData?.DataRecord.find(
        (item) => item.name === data.clientName
      );

      console.log("customerNameId", clientCompanyName);

      const resp = await GetClientCompanyListWithCompanyId(
        clientCompanyName?.id || 0
      );

      setVehicleType(resp.DataRecord);
    };

    fetchData();
  }, [data.clientName]);

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

  return (
    <>
      <Layout
        style={{
          display: "flex",
          gap: 10,
          backgroundColor: "white",
          position: "relative",
        }}
      >
        <Selector
          keyText="Client Name"
          valueText={data.clientName}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "clientName",
              value: apiData?.clientNameData || [],
            });
          }}
        />
        <Divider my="$2" />
        <Selector
          keyText="Vehicle Type"
          valueText={data.vehicleType}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "vehicleType",
              value: vehicleType?.length
                ? vehicleType.map((item) => item.name)
                : [],
            });
          }}

          // data={data.vehicleType}
        />
        <Divider my="$2" />
        <Selector
          keyText="Vehicle Category"
          valueText={data.vehicleCategory}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "vehicleCategory",
              value: vehileCategory.length ? vehileCategory : [],
            });
          }}
        />
        <Divider my="$2" />
        <Selector
          keyText="Client City"
          valueText={data.clientCity}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "clientCity",
              value: apiData?.cityData.map((item) => item.name) ?? [],
            });
          }}
        />
        <Divider my="$2" />
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
            value={data.registrationNumber}
            maxLength={11}
            onChangeText={(value) => {
              if (value.length > 11) return;

              handleSetData("registrationNumber", value);
            }}
            placeholder="Registration Number"
          />
        </Input>
        {data.vehicleType.toLowerCase() == "repo" && (
          <>
            <Box my={"$2"} />
            <Input
              variant="outline"
              style={{
                backgroundColor: COLORS.Dashboard.bg.Grey,
                borderWidth: 0,
                height: 50,
              }}
            >
              <InputField
                autoCapitalize="none"
                secureTextEntry={true}
                keyboardType={"visible-password"}
                value={data.chassisNo}
                textTransform="uppercase"
                onChangeText={(value) => handleSetData("chassisNo", value)}
                placeholder="Chassis Number"
              />
            </Input>
          </>
        )}
        <Box my={"$2"} />
        <Input
          variant="outline"
          style={{
            backgroundColor: COLORS.Dashboard.bg.Grey,
            borderWidth: 0,
            height: 50,
          }}
        >
          <InputField
            autoCapitalize="none"
            secureTextEntry={true}
            keyboardType={"visible-password"}
            value={data.propspectNumber}
            textTransform="uppercase"
            onChangeText={(value) => handleSetData("propspectNumber", value)}
            placeholder="Prospect Number"
          />
        </Input>
        <Box my={"$2"} />
        <Input
          variant="outline"
          style={{
            backgroundColor: COLORS.Dashboard.bg.Grey,
            borderWidth: 0,
            height: 50,
          }}
        >
          <InputField
            autoCapitalize="none"
            secureTextEntry={true}
            keyboardType={"visible-password"}
            textTransform="uppercase"
            value={data.customerName}
            onChangeText={(value) => {
              const filteredText = value.replace(/[^a-zA-Z\s]/g, "");
              handleSetData("customerName", filteredText);
            }}
            placeholder="Customer Name"
          />
        </Input>
        <Box my={"$2"} />
        <CustomInput
          isNumeric
          maxLength={10}
          placeholder="Customer Mobile Number"
          value={data.customerMobile.toString().slice(0, 10)}
          onChangeText={(value) => {
            if (value.length > 10) {
              return;
            }
            handleSetData("customerMobile", value);
          }}
        />
        {/* <Input
					variant='outline'
					style={{
						backgroundColor: COLORS.Dashboard.bg.Grey,
						borderWidth: 0,
						height: 50,
					}}>
					<InputField
						autoCapitalize='none'
						secureTextEntry={true}
						keyboardType='numeric'
						value={data.customerMobile.toString().slice(0, 10)}
						onChangeText={(value) => {
							if (value.length > 10) {
								return;
							}
							handleSetData('customerMobile', value);
						}}
						placeholder='Customer Mobile Number'
					/>
				</Input> */}
        <Box my={"$2"} />
        <Selector
          keyText="Customer State"
          valueText={data.customerState}
          onPress={() => {
            handlePresentModalPress();
            setBottomSheetData({
              key: "customerState",
              value: apiData?.stateNameData || [],
            });
          }}
        />
        <Divider my="$2" />
        <Selector
          keyText={data.vehicleType == "Repo" ? "Yard Name" : "Customer City"}
          valueText={
            data.vehicleType == "Repo" ? data.yardName : data.customerCity
          }
          onPress={() => {
            if (!data.customerState) {
              ToastAndroid.show(
                "Please Select Customer State",
                ToastAndroid.LONG
              );
              return;
            }

            handlePresentModalPress();
            if (data.vehicleType == "Repo") {
              setBottomSheetData({
                key: "yardName",
                value: yardData?.map((item) => item.name) || [],
              });
            } else {
              setBottomSheetData({
                key: "customerCity",
                value: apiData?.cityData.map((item) => item.name) || [],
              });
            }
          }}
        />
        {data.vehicleType !== "Repo" && (
          <>
            <Divider my="$2" />
            <Selector
              keyText={"Customer Area"}
              valueText={data.customerArea}
              onPress={() => {
                if (!data.customerCity) {
                  ToastAndroid.show(
                    "Please Select Customer City",
                    ToastAndroid.LONG
                  );
                  return;
                }

                handlePresentModalPress();
                setBottomSheetData({
                  key: "customerArea",
                  value: apiData.areaData.map((item) => item.name.toString()),
                });
              }}
            />
            <Divider my="$2" />
            <CustomInput
              isNumeric
              maxLength={6}
              placeholder="Customer Pincode"
              value={data.customerPin}
              onChangeText={(value) => handleSetData("customerPin", value)}
            />
            {/* <Input
							variant='outline'
							style={{
								backgroundColor: COLORS.Dashboard.bg.Grey,
								borderWidth: 0,
								height: 50,
							}}>
							<InputField
								autoCapitalize='none'
								secureTextEntry={true}
								placeholder='Pincode'
								caretHidden={false}
								maxLength={6}
								value={data.customerPin}
								onChangeText={(value) =>
									handleSetData('customerPin', value)
								}
							/>
						</Input> */}
            <Box my={"$2"} />
            <Input
              variant="outline"
              style={{
                backgroundColor: COLORS.Dashboard.bg.Grey,
                borderWidth: 0,
                height: 100,
              }}
            >
              <InputField
                autoCapitalize="none"
                secureTextEntry={true}
                keyboardType={"visible-password"}
                multiline
                placeholder="Customer Address"
                onChangeText={(value) =>
                  handleSetData("customerAddress", value)
                }
              />
            </Input>
          </>
        )}
        <Box my={"$2"} />
        <Button onPress={HandleSubmit}>
          <Text fontSize={"$lg"} color="white" fontWeight={"$semibold"}>
            Submit
          </Text>
        </Button>
      </Layout>
      <Box w={"100%"} h={"100%"} style={styles.bottomSheetContainer}>
        <BottomSheetModalProvider>
          <View style={styles.bottomSheetContainer}>
            <BottomSheetModal
              onChange={(e) => {
                if (e !== bottomSheetModalState) {
                  setBottomSheetModalState(e);
                }
              }}
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
              // onChange={handleSheetChanges}
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
    </>
  );
};

/**
 * <Button
							onPress={handlePresentModalPress}
							title='Present Modal'
							color='black'
						/>
 */

export default CreateLeads;

const styles = StyleSheet.create({
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
});
