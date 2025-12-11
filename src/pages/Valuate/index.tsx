import { Button, Card, Image, Text, View } from "@gluestack-ui/themed";
import { StyleSheet, ToastAndroid } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FullPageLoader, LocalStorage, toCamelCase } from "../../Utils";
import { useCallback, useEffect, useState } from "react";
import { LocalDataType } from "../../db/HandleStoreData";
import { QuestionsModal } from "../QuestionsModal";
import { TextType } from "@src/@types";
import { COLORS } from "@src/constants/Colors";
import useQuestions from "../../services/useQuestions";
import { ScrollView } from "@gluestack-ui/themed";
import { useCustomNavigation } from "@src/services/useCustomNavigation";
import { resetOrientation } from "@src/Utils/lockOrientation";
import useZustandStore from "@src/store/useZustandStore";
import useApiCall from "@src/services/useApiCall";
import { useAppStepList } from "@src/contexts";
import { Selector } from "@src/components";
import { AppStepListDataRecord } from "@src/@types/AppStepList";
import OptionalInfoModal from "@src/components/OptionalInfoModal";
import { getDataWithLeadId } from "@src/db/dbs";
import {
  getNotUploadedImageWithLeadId,
  getStatusWithLeadId,
  getStatusWithoutLeadId,
  insertImagesUploadedStatusDB,
  markLeadSideAsUploaded,
} from "@src/db/uploadStatusDb";
import { HandleValuationUpload } from "@src/services/Slices";
import AppErrorMessage from "@src/services/Slices/AppErrorMessage";
import { HandleSaveImage } from "@src/Utils/imageHandlers";

const ValuateCard = ({
  text,
  isDone,
  id,
  vehicleType,
  isClickable,
}: {
  text: TextType;
  id: string;
  vehicleType: string;
  isDone?: string | undefined;
  isClickable?: boolean;
}) => {
  const navigation = useNavigation();

  const { uploadingSides } = useZustandStore();

  const isUploading = uploadingSides[text];

  const HandleClick = () => {
    // if (isDone) return;

    if (!isClickable && isDone?.trim().length === 0) {
      ToastAndroid.show(
        "Please valuate previous side first",
        ToastAndroid.LONG
      );
      return;
    }

    // @ts-ignore
    navigation.navigate("Camera", {
      id: id,
      side: text,
      isDone,
      vehicleType,
    });
  };

  return (
    <Card
      onTouchEnd={HandleClick}
      hardShadow="3"
      h="auto"
      w="40%"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        position: "relative",
        backgroundColor: isDone ? "#ABEB94" : "white",
      }}
    >
      {/* <Image alt='text' source={Car} /> */}

      {isUploading ? (
        <Text
          style={{
            fontSize: 16,
            color: "#0E4DEF",
            textAlign: "center",
            paddingVertical: 20,
          }}
        >
          Uploading...
        </Text>
      ) : isDone ? (
        <Image
          alt="text"
          size="lg"
          aspectRatio="16/9"
          source={{ uri: isDone }}
        />
      ) : (
        <AntDesign name="car" size={40} color="black" />
      )}
      <Text textAlign="center" fontSize="$md" fontWeight="$semibold">
        {text}
      </Text>
    </Card>
  );
};

interface sidesDone {
  side: string;
  imgUrl: string;
}

interface ImageData {
  uri: string;
  id: string;
  step: string;
  latitude?: string;
  longitude?: string;
  lastValuated?: string;
}

/**
 * Route contains
 * @param id
 * @param vehicleType
 * @param imgUrl
 * @param side
 * @param showModal
 */
const ValuatePage = ({ route }: { route: any }) => {
  // console.log(route.params.id);

  const refreshValuatePage = useZustandStore(
    (state) => state.refreshValuatePage
  );
  const setRefreshValuatePage = useZustandStore(
    (state) => state.setRefreshValuatePage
  );

  useEffect(() => {
    if (refreshValuatePage) {
      fetchData();
      setRefreshValuatePage(false);
    }
  }, [refreshValuatePage]);

  const carId = route.params?.id;
  const vehicleType = route.params?.vehicleType;
  const imgUrl = route.params?.imgUrl;
  const { pushNavigation } = useCustomNavigation();
  const [showModal, setShowModal] = useState(route.params?.showModal || false);
  const side = route.params?.side;
  const [sidesDone, setSidesDone] = useState<sidesDone[]>([]);
  const navigation = useNavigation();
  const { AppStepList } = useApiCall();
  const { data: AppStepListState, setData } = useAppStepList();
  const [clickableImageSides, setClickableImageSides] = useState<string[]>([]);
  const [informationRecordSides, setInformationRecordSides] = useState<
    AppStepListDataRecord[]
  >([]);
  const [OptionalInfoModalState, setOptionalInfoModalState] = useState({
    open: false,
    Questions: "",
    Answer: "",
  });
  const [OptionalInfoQuestionAnswer, setOptionalInfoQuestionAnswer] =
    useState<Record<string, string>>();
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const { getSides } = useQuestions();
  const { myTaskValuate } = useZustandStore();
  const fetchClickableSides = async () => {
    try {
      FullPageLoader.open({
        label: "Loading details...",
      });

      const data = await AppStepList({
        LeadId: myTaskValuate.data.Id.toString(),
      });

      // console.log("AppStepList", data);
      setData(data);

      const infoSides = data.filter((item) => item.Images === false);

      setInformationRecordSides(infoSides);
      const sidesHere = getSides(data, vehicleType);

      for (const side of sidesHere) {
        await insertImagesUploadedStatusDB({
          leadUId: myTaskValuate.data.LeadUId?.toString(),
          leadId: myTaskValuate.data.Id?.toString(),
          uri: "",
          step: toCamelCase(side),
          lastValuated: new Date().toString(),
          prospectNo: myTaskValuate.data.ProspectNo,
          regNo: myTaskValuate.data.RegNo,
          side,
          vehicleType: myTaskValuate.vehicleType,
        });
      }
      setClickableImageSides(sidesHere);
      console.log("getStatusWithLeadId", await getStatusWithLeadId(carId));
    } catch (error) {
      console.log(error);
    } finally {
      FullPageLoader.close();
    }
  };

  const fetchData = async () => {
    try {
      const data: LocalDataType[] = await LocalStorage.get("sync_queue");
      // console.log(data[0].side);
      let ids: string[] = [];
      if (data && data.length) {
        console.log(data);
        ids = data?.map((item: any) => item.id) || [];
      }
      if (ids.includes(carId)) {
        const tempDoneSides = data.find((item: any) => item.id === carId);
        const final = tempDoneSides?.side?.map((item) => {
          console.log(item);
          return {
            imgUrl: item.img,
            side: item.type,
          };
        });

        console.log("tempDoneSides", tempDoneSides);
        // for (const data of final) {
        //   console.log("INSIDE markLeadSideAsUploaded", myTaskValuate);
        //   await markLeadSideAsUploaded({
        //     leadId: myTaskValuate.data.LeadUId.toString(),
        //     step: toCamelCase(data.side),
        //     uri: data.imgUrl,
        //     leadUId: myTaskValuate.data.LeadUId.toString(),
        //   });
        // }
        console.log("FINAL", final);
        if (final) setSidesDone([...final]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const getIsVideoRecorded = async () => {
    try {
      console.log("INSIDE getIsVideoRecorded");
      const resp: any = await getDataWithLeadId(
        myTaskValuate.data.Id.toString()
      );
      if (resp) {
        console.log("getIsVideoRecorded", resp);
        setIsVideoRecorded(resp.video_uri ? true : false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      getIsVideoRecorded();
    }, [route, showModal])
  );

  // useEffect(() => {
  //   // ()();
  // }, [route, showModal]);

  const ClickedSideImage = (side: string) => {
    const index = sidesDone.findIndex((item) => item.side === side);
    console.log("SIDE INDEX", side, index);
    if (index !== -1) {
      return sidesDone[index].imgUrl;
    } else {
      return "";
    }
  };

  const isDisabled = () => {
    const optionalImagesLength = AppStepListState.filter(
      (item) =>
        item.Name.toLowerCase().includes("optional") && item.Images == true
    ).length;

    const mandatoryImagesLength = AppStepListState.filter(
      (item) => item.Images == true
    );

    return (
      sidesDone.length >= mandatoryImagesLength.length - optionalImagesLength
    );
  };
  // const TEXT_SIDES: TextType[] = [
  // 	'Front Side',
  // 	'Right Side',
  // 	'Chassis Imprint',
  // 	'Back Side',
  // 	'Left Side',
  // 	'Chassis Number',

  // ];

  // log('asd');

  useEffect(() => {
    if (route.params?.showModal) setShowModal(true);
    fetchClickableSides();
  }, [route]);

  const HandleVideoNavigation = () => {
    pushNavigation("VideoCamera", {
      id: carId,
      side: "Video",
      vehicleType,
    });
  };

  const handleNextClick = async () => {
    if (!isDisabled()) {
      ToastAndroid.show("Please upload all the images.", ToastAndroid.SHORT);
      return;
    }

    try {
      const notUploadedImages = getNotUploadedImageWithLeadId({
        leadId: myTaskValuate.data.LeadId?.toString(),
      });
      const allImgs = await getStatusWithoutLeadId();
      FullPageLoader.open({
        label: "Uploading Images",
      });
      console.log("NOT UPLOADED IMAGES: ", allImgs);

      // return
      await Promise.all(
        notUploadedImages.map((lead) =>
          HandleValuationUpload({
            base64String: lead.uri,
            paramName: AppStepListState.find(
              (item) => toCamelCase(item.Name) === lead.step
            ).Appcolumn,
            LeadId: myTaskValuate.data.Id.toString(),
            VehicleTypeValue: myTaskValuate.data.VehicleTypeValue,
            geolocation: {
              lat: lead.latitude?.toString(),
              long: lead.longitude?.toString(),
              timeStamp: lead.lastValuated?.toString(),
            },
          })
        )
      );
      // return
      // @ts-ignore
      navigation.navigate("VehicleDetails", {
        carId: carId,
      });
    } catch (error: any) {
      console.log("ERROR IN UPLOADING IMAGES", error);
      AppErrorMessage({ message: error.message.toString() });
    } finally {
      FullPageLoader.close();
    }
  };

  // const handleNextClick = async () => {
  //   if (!isDisabled()) {
  //     ToastAndroid.show("Please upload all the images.", ToastAndroid.SHORT);
  //     return;
  //   }

  //   try {
  //     // get images that haven't been uploaded yet
  //     const notUploadedImages = getNotUploadedImageWithLeadId({
  //       leadId: myTaskValuate.data.LeadId?.toString(),
  //     });

  //     // get all images, including the preview(ensure preview is part of this)
  //     const allImgs = getStatusWithoutLeadId();
  //     console.log("NOT UPLOADED IMAGES: ", allImgs);

  //     //@ts-ignore
  //     const imgToStore: ImageData[] = allImgs.response || [];
  //     FullPageLoader.open({
  //       label: "Uploading Images",
  //     });

  //     // store images to local DB
  //     await Promise.all(
  //       imgToStore.map(async (lead) => {
  //         await HandleSaveImage({
  //           uri: lead.uri,
  //           id: lead.id,
  //           side: lead.step,
  //           removePreviousImage: true,
  //         });
  //       })
  //     );

  //     // return
  //     await Promise.all(
  //       notUploadedImages.map((lead) =>
  //         HandleValuationUpload({
  //           base64String: lead.uri,
  //           paramName: AppStepListState.find(
  //             (item) => toCamelCase(item.Name) === lead.step
  //           ).Appcolumn,
  //           LeadId: myTaskValuate.data.Id.toString(),
  //           VehicleTypeValue: myTaskValuate.data.VehicleTypeValue,
  //           geolocation: {
  //             lat: lead.latitude?.toString(),
  //             long: lead.longitude?.toString(),
  //             timeStamp: lead.lastValuated?.toString(),
  //           },
  //         })
  //       )
  //     );
  //     // return
  //     // @ts-ignore
  //     navigation.navigate("VehicleDetails", {
  //       carId: carId,
  //     });
  //   } catch (error: any) {
  //     console.log("ERROR IN UPLOADING IMAGES", error);
  //     AppErrorMessage({ message: error.message.toString() });
  //   } finally {
  //     FullPageLoader.close();
  //   }
  // };

  return (
    <>
      {clickableImageSides.length ? (
        <View
          backgroundColor="white"
          h="$full"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              height: "90%",
            }}
          >
            {/* TODO: Add Cards for different sides of vehicle */}
            <View>
              <ScrollView>
                <View display="flex" alignItems="center">
                  <Text fontSize="$2xl" fontWeight="$semibold" paddingTop="$5">
                    {carId}
                  </Text>
                </View>

                <View>
                  <View style={styles.videoContainer}>
                    <Card
                      style={{
                        width: "89%",
                        backgroundColor: isVideoRecorded ? "#ABEB94" : "white",
                      }}
                    >
                      <Text
                        // disabled={isVideoRecorded}
                        onPress={HandleVideoNavigation}
                        textAlign="center"
                        fontSize="$md"
                        fontWeight="$semibold"
                      >
                        Record Video
                      </Text>
                    </Card>
                  </View>
                  <View style={styles.cardContainer}>
                    {!clickableImageSides.length && (
                      <Text fontSize="$2xl" fontWeight={"$semibold"}>
                        No Data Found
                      </Text>
                    )}
                    {clickableImageSides?.map((side, index: number) => {
                      return (
                        <ValuateCard
                          key={side + index}
                          id={carId}
                          isDone={ClickedSideImage(side)}
                          isClickable={
                            true ||
                            (index === 0 && isVideoRecorded) ||
                            !!ClickedSideImage(clickableImageSides[index - 1])
                          }
                          vehicleType={vehicleType}
                          // @ts-ignore ignore following string error as it is invalid
                          text={side}
                        />
                      );
                    })}
                    <View style={styles.infoRecordContainer}>
                      <Text
                        pl={"$2"}
                        pb={"$2"}
                        fontSize={"$lg"}
                        fontWeight={"$semibold"}
                      >
                        Optional Information Record
                      </Text>
                      {informationRecordSides.map((item, index) => {
                        return (
                          <Selector
                            key={index + item.Questions}
                            keyText={item.Questions}
                            valueText={
                              OptionalInfoQuestionAnswer?.[item.Questions] || ""
                            }
                            onPress={() => {
                              setOptionalInfoModalState({
                                open: true,
                                Questions: item.Questions,
                                Answer: item.Answer,
                              });
                            }}
                          />
                        );
                      })}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
          <View w="$full" h="$20" style={[styles.nextBtnContainer]}>
            <Button
              onTouchEnd={handleNextClick}
              style={[
                styles.nextBtn,
                {
                  backgroundColor: !isDisabled()
                    ? "darkblue"
                    : COLORS.AppTheme.primary,
                  opacity: isDisabled() ? 1 : 0.5,
                },
              ]}
              disabled={!isDisabled()}
            >
              <Text color="white" fontWeight="$semibold">
                Next
              </Text>
            </Button>
          </View>
          {showModal && (
            <QuestionsModal
              side={side}
              carId={carId}
              imgUrl={imgUrl}
              showModal={showModal}
              setShowModal={setShowModal}
              isDone={!!ClickedSideImage(side)}
              vehicleType={vehicleType}
            />
          )}
          {OptionalInfoModalState.open && (
            <OptionalInfoModal
              open={OptionalInfoModalState.open}
              closeModal={() =>
                setOptionalInfoModalState({
                  ...OptionalInfoModalState,
                  open: false,
                })
              }
              Questions={OptionalInfoModalState.Questions}
              Answers={OptionalInfoModalState.Answer}
              onSubmit={(selectedAnswer) => {
                setOptionalInfoModalState({
                  ...OptionalInfoModalState,
                  open: false,
                });
                setOptionalInfoQuestionAnswer({
                  ...OptionalInfoQuestionAnswer,
                  [OptionalInfoModalState.Questions]: selectedAnswer,
                });
              }}
            />
          )}
        </View>
      ) : (
        <View
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={"80%"}
        >
          <Text fontSize={"$2xl"}>No Data Found</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },
  nextBtnContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtn: {
    width: "70%",
    color: "white",
    backgroundColor: "darkblue",
  },
  infoRecordContainer: {
    paddingHorizontal: 25,
  },
});

export default ValuatePage;
