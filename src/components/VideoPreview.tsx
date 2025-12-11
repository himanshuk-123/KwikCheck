import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
// import Slider from '@react-native-community/slider';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Slider from "@react-native-community/slider";
import { AntDesign } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { Button } from "@gluestack-ui/themed";

export default function VideoPreview({
  uri,
  onSubmit,
  onClose,
}: {
  uri: string;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  const onPlaybackStatusUpdate = (status: any) => {
    setPlaybackPosition(status.positionMillis);
    setPlaybackDuration(status.durationMillis);
    setIsPlaying(status.isPlaying);
  };

  const handlePlayPause = () => {
    if (videoRef && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
    }
  };

  const handleSliderChange = (value: any) => {
    videoRef?.current?.setPositionAsync(value);
  };

  return (
    <SafeAreaView style={{ position: "relative", height: "100%" }}>
      <View
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          height: "100%",
          paddingBottom: 50,
          gap: 10,
          position: "relative",
          // backgroundColor: "black",
        }}
      >
        <Video
          ref={videoRef}
          useNativeControls={false} // Disable default controls
          resizeMode={ResizeMode.CONTAIN}
          usePoster
          source={{
            uri,
          }}
          isMuted
          style={[
            { ...StyleSheet.absoluteFillObject },
            { aspectRatio: "9/16" },
          ]}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />

        <View>
          <View style={styles.controls}>
            {/* <Button title={isPlaying ? "Pause" : "Play"} /> */}
            <TouchableOpacity onPress={handlePlayPause}>
              <FontAwesome5
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={24}
                color="black"
              />
            </TouchableOpacity>

            <Slider
              style={styles.slider}
              value={playbackPosition}
              minimumValue={0}
              maximumValue={playbackDuration}
              onValueChange={handleSliderChange}
            />
          </View>
          <Button onPress={onSubmit}>
            <Text style={{ color: "white", fontSize: 18 }}>Submit</Text>
          </Button>
        </View>
        {/* ))} */}
      </View>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 30,
          right: 10,
        }}
        onPress={onClose}
      >
        <Feather name="x" size={30} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    position: "relative",
  },
  video: {
    width: "100%",
    height: 300,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  slider: {
    width: 200,
    height: 40,
  },
});
