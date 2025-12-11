import React, { useEffect, useRef, useState } from "react";
import { Camera, useCameraPermissions, CameraType, CameraView } from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  MAX_VIDEO_RECORDING_DURATION,
  MAX_VIDEO_RECORDING_DURATION_MS,
} from "@src/constants";
import { COLORS } from "@src/constants/Colors";
import VideoPreview from "./VideoPreview";
import { useCustomNavigation } from "@src/services/useCustomNavigation";
import {
  lockOrientationToLandscapeRight,
  resetOrientation,
} from "@src/Utils/lockOrientation";
import { useNavigation } from "@react-navigation/native";
import { FullPageLoader, deleteLocalFile } from "@src/Utils";
import { fetchAllVideoSyncQueueDB, insertVideoSyncQueueDB } from "@src/db/dbs";
import useZustandStore from "@src/store/useZustandStore";
import { DocumentUploadVideo } from "@src/services/Slices";
import { useAutofocus } from "@src/services/useAutoFocus";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import AnimatedFocusSquare from "./VideoCamera/AnimatedFocusSquare";
import { File, Paths } from 'expo-file-system';
import * as FileSystemLegacy from 'expo-file-system/legacy'; // used to copy the original URI into cache
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'; // if you use these

export default function VideoCamera() {
  const [type, setType] = useState<CameraType>('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [videoUri, setVideoUri] = useState("");
  const [timer, setTimer] = useState(MAX_VIDEO_RECORDING_DURATION);

  const { popNavigation } = useCustomNavigation();
  const navigation = useNavigation();
  const { myTaskValuate } = useZustandStore();
  const { isRefreshing, focusSquare, onTap } = useAutofocus();
  const tap = Gesture.Tap().onBegin(onTap);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      // stop the recording after MAX_VIDEO_RECORDING_DURATION_MS as a safety net
      maxTimeoutRef.current = setTimeout(() => {
        stopRecording().catch(() => {});
      }, MAX_VIDEO_RECORDING_DURATION_MS);
    } else {
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
        maxTimeoutRef.current = null;
      }
    }
    return () => {
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
        maxTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  useEffect(() => {
    // countdown timer using interval
    if (isRecording) {
      setTimer(MAX_VIDEO_RECORDING_DURATION);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // ensure stop
            stopRecording().catch(() => {});
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  useEffect(() => {
    (async () => {
      if (videoUri.length) {
        await resetOrientation();
      } else {
        lockOrientationToLandscapeRight();
      }
    })();
    const blurListener = navigation.addListener("blur", (e: any) => {
      if (e?.target?.includes && e.target?.includes("Camera-")) resetOrientation();
    });
    return () => {
      if (blurListener) blurListener();
    };
  }, [navigation, videoUri]);

  if (!permission) {
    // still loading
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

const startRecording = async () => {
  if (!cameraRef.current || !isCameraReady || isRecording) {
    ToastAndroid.show("Camera not ready", ToastAndroid.SHORT);
    return;
  }

  let tmpFilePath = null;
  try {
    setIsRecording(true);
    try { await activateKeepAwakeAsync("video"); } catch (e) { console.warn("activateKeepAwake failed", e); }

    const rec = await cameraRef.current.recordAsync({
      maxDuration: MAX_VIDEO_RECORDING_DURATION,
      // mute: true
    });

    if (!rec || !rec.uri) throw new Error("No recording URI produced");
    const uri = rec.uri;

    // Use the legacy string directory for the destination path
    const tmpFileName = `rn_recording_${Date.now()}.mp4`;
    tmpFilePath = FileSystemLegacy.cacheDirectory + tmpFileName; // <-- IMPORTANT: legacy string

    // copy original URI into app cache (works for content:// and file://)
    await FileSystemLegacy.copyAsync({ from: uri, to: tmpFilePath });

    // Use new File API on a Directory object (Paths.cache) + filename
    const file = new File(Paths.cache, tmpFileName);
    const fileInfo = await file.info();

    if (!fileInfo.exists || (fileInfo.size ?? 0) === 0) {
      ToastAndroid.show("Recording failed (zero-byte file).", ToastAndroid.LONG);
      await deleteLocalFile(uri);
      try { await FileSystemLegacy.deleteAsync(tmpFilePath, { idempotent: true }); } catch (e) {}
      return;
    }

    const sizeInMB = (fileInfo.size ?? 0) / (1024 * 1024);
    if (sizeInMB > 50) {
      alert(`Video is too large: ${sizeInMB.toFixed(2)} MB. Please record a shorter video.`);
      await deleteLocalFile(uri);
      try { await FileSystemLegacy.deleteAsync(tmpFilePath, { idempotent: true }); } catch (e) {}
      return;
    }

    // Use the cache-file for preview / uploads (safer than content:// on Android)
    setVideoUri(tmpFilePath);
    setShowVideoPreview(true);

  } catch (error) {
    console.log("ERROR RECORDING VIDEO", error);
    ToastAndroid.show("Video recording failed. Check logs.", ToastAndroid.SHORT);
  } finally {
    setIsRecording(false);
    try { await deactivateKeepAwake("video"); } catch (e) { console.warn("deactivateKeepAwake failed", e); }
  }
};

  const stopRecording = async () => {
    if (!cameraRef.current) return;
    try {
      cameraRef.current.stopRecording();
    } catch (e) {
      console.warn("stopRecording error:", e);
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);
    }
  };

  const handlePreviewClose = () => {
    setShowVideoPreview(false);
    if (videoUri) deleteLocalFile(videoUri);
    setVideoUri("");
    setTimer(MAX_VIDEO_RECORDING_DURATION);
  };

  const handleSubmitVideo = async () => {
    try {
      ToastAndroid.show("Uploading video in the background.", ToastAndroid.SHORT);
      popNavigation(1);
      await insertVideoSyncQueueDB(myTaskValuate.data.Id.toString(), videoUri);

      const uploadVideoToServerRes = await DocumentUploadVideo({
        LeadId: myTaskValuate.data.Id.toString(),
        videoUri,
      });
      if (uploadVideoToServerRes.MESSAGE === "Success") {
        console.log("✅ Upload successful");
      }
    } catch (error) {
      console.log("ERROR", error);
      ToastAndroid.show("Something went wrong while uploading the video. Please try again", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      {showVideoPreview ? (
        <VideoPreview uri={videoUri} onSubmit={handleSubmitVideo} onClose={handlePreviewClose} />
      ) : (
        <GestureDetector gesture={tap}>
          <View style={styles.container}>
            

            <CameraView
             mode="video"
              style={styles.camera}
             // ref={(r) => (cameraRef.current = r)}
              ref={cameraRef}
              ratio="16:9"
              facing={type}
              mute={true}
              videoQuality="480p"
              onCameraReady={() => setIsCameraReady(true)}
              onMountError={(err) => {
                console.error("Camera mount error:", err);
                setIsCameraReady(false);
              }}
              autofocus={isRefreshing ? "off" : "on"}
              flash={isFlashOn ? "on" : "off"}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setIsFlashOn((s) => !s);
                  }}
                >
                  <Ionicons style={styles.iconStyle} name="flashlight" size={28} color="white" />
                </TouchableOpacity>

                {isRecording && (
                  <Text
                    style={{
                      color: "white",
                      position: "absolute",
                      height: "90%",
                      right: 10,
                      fontSize: 20,
                    }}
                  >
                    {timer} sec remaining
                  </Text>
                )}

                <TouchableOpacity onPress={startRecording} disabled={isRecording} style={styles.button}>
                  <FontAwesome
                    name="video-camera"
                    style={{
                      ...styles.iconStyle,
                      opacity: isRecording ? 0.5 : 1,
                    }}
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>

                {isRecording && (
                  <TouchableOpacity onPress={stopRecording} style={[styles.button, { marginLeft: 10 }]}>
                    <Text style={{ color: "red", fontWeight: "bold" }}>STOP</Text>
                  </TouchableOpacity>
                )}
              </View>
            </CameraView>

            {isRecording && focusSquare.visible && <AnimatedFocusSquare focusSquare={focusSquare} />}
          </View>
        </GestureDetector>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  button: {
    marginBottom: 50,
    borderRadius: 1000,
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  iconStyle: {
    backgroundColor: COLORS.AppTheme.primaryBg,
    padding: 10,
    borderRadius: 400,
  },
  focusSquare: {
    position: "absolute",
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "white",
  },
});
