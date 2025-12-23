import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";
// import { getInfoAsync } from "expo-file-system/legacy";
import * as FileSystem from "expo-file-system";
import {
  Button,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import {
  HandleSaveImage,
  removePictureToLocalStorage,
} from "../Utils/imageHandlers";

import { Image } from "@gluestack-ui/themed";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { processImage } from "@src/Utils/ProcessImage";

import {
  lockOrientationToLandscapeRight,
  resetOrientation,
} from "@src/Utils/lockOrientation";

import {
  activateKeepAwakeAsync,
  deactivateKeepAwake,
  useKeepAwake,
} from "expo-keep-awake";

import { FullPageLoader } from "@src/Utils";
import { useAutofocus } from "@src/services/useAutoFocus";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import AnimatedFocusSquare from "./VideoCamera/AnimatedFocusSquare";
import { useAppStepList } from "@src/contexts";
import useZustandStore from "@src/store/useZustandStore";
import uploadImageWithRetry from "@src/services/uploadWithRetry";
import * as Location from "expo-location";

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

  const CameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions({ request: true });
  const [preview, setPreview] = useState<string | undefined>();
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isProceeding, setIsProceeding] = useState(false);

  const { isRefreshing, focusSquare, onTap } = useAutofocus();
  const tap = Gesture.Tap().onBegin(onTap);

  useKeepAwake();

  const decideCameraFacing = () => {
    if (side.toLowerCase().includes("selfie")) {
      setFacing("front");
    }
  };

  useEffect(() => {
    (async () => {
      if (preview) {
        await resetOrientation();
      } else {
        lockOrientationToLandscapeRight();
      }
    })();

    const unsubscribe = navigation.addListener("blur", () => {
      resetOrientation();
    });

    decideCameraFacing();
    return unsubscribe;
  }, [navigation, preview]);

  useEffect(() => {
    if (isInitialLoading) {
      FullPageLoader.open({ label: "Loading camera..." });
    } else {
      FullPageLoader.close();
    }
  }, [isInitialLoading]);

  useFocusEffect(
    useCallback(() => {
      activateKeepAwakeAsync();
      return () => deactivateKeepAwake();
    }, [])
  );

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const isQuestionForSide = () => {
    return data.find((item) => item.Name === side)?.Questions;
  };

  // ---------- CAMERA CAPTURE ----------
async function handlePreview() {
  try {
    setIsCameraDisabled(true);

    const data = await CameraRef.current?.takePictureAsync({
      quality: 0.7,               // ✅ FULL camera quality
      skipProcessing: false,    // ✅ let camera finish its job
    });

    if (!data?.uri) {
      throw new Error("Camera returned empty URI");
    }

    // 🔥 ONE-TIME processing
    const processedUri = await processImage(data.uri);

    setPreview(processedUri);
  } catch (error) {
    console.error("Camera error:", error);
    setIsCameraDisabled(false);
  }
}


  // ---------- PROCEED ----------
const handleProceed = async () => {
  if (!preview) return;

  const isQuestionToShowModal = !!isQuestionForSide();
  setIsProceeding(true);

  try {
    // 1️⃣ Orientation reset (important before leaving camera)
    await resetOrientation();

    // 2️⃣ Save image locally (processed image)
    const imgPath = await HandleSaveImage({
      uri: preview,
      id,
      side,
      removePreviousImage: Boolean(isDone),
    });

    if (!imgPath) {
      throw new Error("Image save failed");
    }

    // 3️⃣ Navigate IMMEDIATELY (don't wait for upload)
    //@ts-ignore
    navigation.navigate("Valuation", {
      id,
      imgUrl: imgPath,
      showModal: isQuestionToShowModal,
      side,
      vehicleType,
    });

    // 4️⃣ Continue upload in BACKGROUND
    setUploadingSide(side, true);
    
    (async () => {
      try {
        // Get location with proper permission check
        let location;
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          
          if (status !== 'granted') {
            console.warn("[Location] Permission denied, using fallback (0,0)");
            location = { coords: { latitude: 0, longitude: 0 } } as any;
          } else {
            location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            console.log("[Location] Obtained:", {
              lat: location.coords.latitude,
              long: location.coords.longitude,
            });
          }
        } catch (err) {
          console.error("[Location] Error fetching location:", err);
          location = { coords: { latitude: 0, longitude: 0 } } as any;
        }

        // Get backend paramName
        const paramName =
          data.find((item) => item.Name === side)?.Appcolumn || "Other";

        // Get Lead details
        const myTaskValuate = useZustandStore.getState().myTaskValuate;
        const LeadId = myTaskValuate?.data?.Id?.toString();
        const VehicleTypeValue =
          myTaskValuate?.data?.VehicleTypeValue || vehicleType;

        if (!LeadId) {
          throw new Error("LeadId missing");
        }

        // 🔥 ACTUAL API CALL — IMAGE UPLOAD (WITH RETRY)
        await uploadImageWithRetry({
          base64String: imgPath,
          paramName,
          LeadId,
          VehicleTypeValue,
          geolocation: {
            lat: location.coords.latitude.toString(),
            long: location.coords.longitude.toString(),
            timeStamp: new Date().toISOString(),
          },
        });

        ToastAndroid.show("Image uploaded successfully", ToastAndroid.SHORT);
      } catch (error: any) {
        console.error("[Background Upload] Failed:", error);
        ToastAndroid.show(
          "Image upload failed. Will retry automatically.",
          ToastAndroid.LONG
        );
      } finally {
        setUploadingSide(side, false);
      }
    })();

  } catch (error: any) {
    console.error("handleProceed failed:", error);
    ToastAndroid.show(
      "Error saving image. Please retry.",
      ToastAndroid.LONG
    );
  } finally {
    setIsProceeding(false);
  }
};

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
              style={{ position: "absolute", top: 30, right: 10 }}
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
              style={styles.camera}
              facing={facing}
              ref={CameraRef}
              zoom={0.2}
              focusable
              autofocus={isRefreshing ? "off" : "on"}
              animateShutter
              onCameraReady={() => {
                setIsCameraDisabled(false);
                setIsInitialLoading(false);
              }}
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
    gap: 10,
    position: "relative",
  },
  previewImg: {
    flex: 1,
    width: "100%",
    objectFit: "cover",
  },
  previewProceedBtn: {
    position: "absolute",
    bottom: 75,
    right: "30%",
    backgroundColor: "#1181B2",
    width: 150,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
    alignSelf: "flex-end",
    justifyContent: "center",
    height: "100%",
  },
  buttonBg: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
