import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

// importing utility functions for saving/removing images
import {
  HandleSaveImage,
  removePictureToLocalStorage,
} from "../Utils/imageHandlers";
import { SideType } from "../@types/RealmSchemaTypes";
import { Image } from "@gluestack-ui/themed";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TextType } from "@src/@types";
import { processImage } from "@src/Utils/ProcessImage";

// orientation lock utilities
import {
  lockOrientationToLandscapeRight,
  resetOrientation,
} from "@src/Utils/lockOrientation";

// keep screen awake utilities
import {
  activateKeepAwakeAsync,
  deactivateKeepAwake,
  useKeepAwake,
} from "expo-keep-awake";
import { FullPageLoader, handleWithErrorReporting } from "@src/Utils";

import { useAutofocus } from "@src/services/useAutoFocus"; // custom hook for autofocus
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import AnimatedFocusSquare from "./VideoCamera/AnimatedFocusSquare";
import { useAppStepList } from "@src/contexts";
import { useGetLocationAndInsertInDB } from "@src/Utils/getLocationAndInsertInDb";

// to display the loader
import { ActivityIndicator } from "react-native";

import useZustandStore from "@src/store/useZustandStore";

export default function CustomCamera({
  id = "",
  side,
  isDone,
  vehicleType,
}: {
  id: string;
  side: string;
  isDone?: string;
  vehicleType: string;
}) {
  const { data } = useAppStepList();

  const { setUploadingSide } = useZustandStore.getState();

  const CameraRef = useRef<CameraView>(null); //ref to access the cameraView
  const navigation = useNavigation();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions({
    request: true,
  });
  const [preview, setPreview] = useState<string | undefined>("");
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // loading state
  const { isRefreshing, focusSquare, onTap } = useAutofocus();
  const tap = Gesture.Tap().onBegin(onTap); // gesture for tap to focus
  const { getLocationAndInsertInDB } = useGetLocationAndInsertInDB(); // get image location and insert in DB

  const [isProceeding, setIsProceeding] = useState(false);

  //  keep screen awake during camera open
  useKeepAwake();

  // decide whether to use front/back camera based on side name
  const decideCameraFacing = () => {
    if (side.toLowerCase().includes("selfie")) {
      setFacing("front");
    }
  };

  // for initial orientation and camera facing setup
  useEffect(() => {
    (async () => {
      if (preview) {
        await resetOrientation();
      } else {
        lockOrientationToLandscapeRight();
      }
    })();

    // reset orientation when leaving camera screen
    navigation.addListener("blur", (e) => {
      if (e.target?.includes("Camera-")) resetOrientation();
    });
    decideCameraFacing();
  }, [navigation, preview]);

  // show loader while initializing camera
  useEffect(() => {
    if (isInitialLoading)
      FullPageLoader.open({
        label: "Loading camera...",
      });
    else FullPageLoader.close();
  }, [isInitialLoading]);

  // keep screen awake using usefocusEffect
  useFocusEffect(
    useCallback(() => {
      const keepAwake = async () => {
        await activateKeepAwakeAsync();
      };
      keepAwake();

      return () => {
        deactivateKeepAwake();
      };
    }, [])
  );

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // async function takePicture() {
  // 	try {
  // 		const data = await Camera.current?.takePictureAsync();
  // 		if (data) {
  // 			console.log('DATA hERE: ', id, side);
  // 			await HandleSaveImage({ uri: data.uri, id, side });
  // 		}
  // 		// console.log(data);
  // 	} catch (error) {
  // 		console.log(error);
  // 	}
  // }

  // check if the current side has a question to show modal later
  const isQuestionForSide = () => {
    return data.find((item) => item.Name === side).Questions;
  };

  // proceed after taking picture
  // const handleProceed = async () => {
  //   if (preview) {
  //     // setPreview(undefined);
  //     setIsProceeding(true); // disable the button immediately when clicked
  //     try {
  //       const isQuestionToShowModal = !!isQuestionForSide();

  //       if (isDone) {
  //         await removePictureToLocalStorage(isDone);
  //       }
  //       await resetOrientation();

  //       if (!isQuestionToShowModal) {
  //         const updatedImg = await HandleSaveImage({
  //           uri: preview,
  //           id,
  //           side,
  //           removePreviousImage: Boolean(isDone),
  //         });

  //         await handleWithErrorReporting(
  //           async () =>
  //             await getLocationAndInsertInDB({ imgPath: updatedImg, side })
  //         );
  //       }
  //       // console.log("THIS IS APP STEP LIST -->", !!isQuestionForSide());
  //       // @ts-ignore

  //       // navigate to valuation screen after capturing
  //       navigation.navigate("Valuation", {
  //         id,
  //         imgUrl: preview,
  //         showModal: isQuestionToShowModal,
  //         side: side,
  //         vehicleType,
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       ToastAndroid.show(
  //         "Something went wrong. Please try again.",
  //         ToastAndroid.SHORT
  //       );
  //     } finally {
  //       setIsProceeding(false); // re-enable button after the task is done
  //     }
  //   }
  // };

  const handleProceed = async () => {
    if (!preview) return; // early exit if no preview available

    const isQuestionToShowModal = !!isQuestionForSide();
    setUploadingSide(side, true);

    //  fast navigation to next screen
    //@ts-ignore
    navigation.navigate("Valuation", {
      id,
      imgUrl: preview,
      showModal: isQuestionToShowModal,
      side,
      vehicleType,
    });

    if (isDone) {
      await removePictureToLocalStorage(isDone);
    }

    await resetOrientation();

    // Background upload with safe error handling
    setTimeout(() => {
      handleWithErrorReporting(async () => {
        const imgPath = await HandleSaveImage({
          uri: preview,
          id,
          side,
          removePreviousImage: Boolean(isDone),
        });

        if (!imgPath) {
          throw new Error("Image saving failed.");
        }

        await getLocationAndInsertInDB({ imgPath, side });
        useZustandStore.getState().setRefreshValuatePage(true);
        setUploadingSide(side, false);
      });
    }, 200);
    ToastAndroid.show("Uploading image in background...", ToastAndroid.SHORT);
  };

  // take picture and save in preview state
  async function handlePreview() {
    try {
      const data = await CameraRef.current?.takePictureAsync({
        quality: 0.5,
       skipProcessing: true,
      });

      // const img = await processImage(data?.uri || "");
      if (data?.uri) {
        setPreview(data?.uri);
      } else {
        ToastAndroid.show(
          "Failed to capture image. Please try again",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.log("Error taking picture : ", error);
      ToastAndroid.show(" Camera error. Please retry", ToastAndroid.SHORT);
    }
  }

  return (
    <GestureDetector gesture={tap}>
      <View style={{ flex: 1 }}>
        {preview ? (
          <View style={styles.previewContainer}>
            <Image
              style={styles.previewImg}
              source={{ uri: preview }}
              alt="preview"
            />
            <TouchableOpacity
              onPress={async () => {
                setPreview(undefined);
                await removePictureToLocalStorage(preview);
              }}
              style={{
                position: "absolute",
                top: 30,
                right: 10,
              }}
            >
              <AntDesign name="close" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleProceed}
              disabled={isProceeding}
              style={[
                styles.previewProceedBtn,
                isProceeding && { backgroundColor: "gray" },
              ]}
            >
              {isProceeding ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={{ color: "white", fontSize: 18 }}>Proceed</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.container}>
            <CameraView
              style={{
                ...styles.camera,
              }}
              facing={facing}
              onCameraReady={() => {
                setIsCameraDisabled(false);
                setIsInitialLoading(false);
              }}
              animateShutter
              autofocus={isRefreshing ? "off" : "on"}
              focusable
              zoom={0.3}
              ref={CameraRef}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handlePreview}
                  disabled={isCameraDisabled}
                >
                  <View style={styles.buttonBg}>
                    <AntDesign name="camera" size={30} color="white" />
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
								style={styles.button}
								onPress={() => setIsFlashOn(!isFlashOn)}>
								<View style={styles.buttonBg}>
									<MaterialIcons
										name={
											isFlashOn
												? 'flashlight-off'
												: 'flashlight-on'
										}
										size={24}
										color='white'
									/>
								</View>
							</TouchableOpacity> */}
              </View>
            </CameraView>
          </View>
        )}
        {!focusSquare.visible && !preview && (
          <AnimatedFocusSquare focusSquare={focusSquare} />
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    display: "flex",
    gap: 10,
    position: "relative",
  },
  previewImg: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    objectFit: "contain",
  },
  previewProceedBtn: {
    position: "absolute",
    bottom: 75,
    right: "30%",
    backgroundColor: "#1181B2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 40,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  camera: {
    flex: 1,
    zIndex: 100,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    margin: 64,
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  button: {
    // flex: 1,
    alignSelf: "flex-end",
    alignItems: "flex-end",
    justifyContent: "center",
    height: "100%",
    // backgroundColor: "red",
  },
  buttonBg: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
