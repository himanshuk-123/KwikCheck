import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

const AnimatedFocusSquare = ({ focusSquare }) => {
  const sizeAnim = useRef(new Animated.Value(50)).current; // Initial size of the square

  useEffect(() => {
    Animated.timing(sizeAnim, {
      toValue: 35,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.focusSquare,
        {
          top: focusSquare.y - 25,
          left: focusSquare.x - 25,
          width: sizeAnim,
          height: sizeAnim, // Both width and height are animated
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  focusSquare: {
    position: "absolute",
    // width: 75,
    // height: 75,
    // backgroundColor: "rgba(0, 150, 255, 0.5)", // Example styling, adjust as needed
    borderWidth: 1,
    borderColor: "white",
  },
});

export default AnimatedFocusSquare;
