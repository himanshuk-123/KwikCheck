import { Keyboard, Linking, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Icon,
  Input,
  InputField,
  InputSlot,
  Text,
} from "@gluestack-ui/themed";
import { LoginData } from "../../@types";
import useApiCall from "../../services/useApiCall";
import { Image } from "@gluestack-ui/themed";
import {
  InputIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  LockIcon,
} from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import { HeroImg } from "@src/assets";
import { useKeyboardService } from "@src/services/useKeyboardService";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {};

const LoginPage = (props: Props) => {
  const { Login } = useApiCall();
  const marginTop = useSharedValue(0);
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<any>();
  const { isKeyboardVisible } = useKeyboardService();
  const HandleLogin = async () => await Login(loginData);

  const HandleNativeClick = (type: "tel" | "mail") => {
    switch (type) {
      case "tel":
        // Linking.openURL("tel:+(919988336677)");
        break;
      case "mail":
        Linking.openURL("mailto:support@kwikcheck.in");
      default:
        break;
    }
  };
  const marginTopStyle = useAnimatedStyle(() => ({
    marginTop: marginTop.value,
  }));

  useEffect(() => {
    if (isKeyboardVisible) {
      marginTop.value = withTiming(100, { duration: 100 });
    } else {
      marginTop.value = withTiming(0, { duration: 100 });
    }
  }, [isKeyboardVisible]);

  return (
    <View>
      <View style={[styles.flexCenter, { maxHeight: "80%" }]}>
        <View
          onTouchEnd={() => {
            Keyboard.dismiss();
          }}
          style={[StyleSheet.absoluteFillObject]}
        />
        <View
          style={{
            display: "flex",
            width: "80%",
            gap: 24,
          }}
        >
          <View style={[styles.flexCenter, { height: "auto" }]}>
            <Text fontSize={"$3xl"} fontWeight={"bold"}>
              <Text
                fontSize={"$4xl"}
                fontWeight={"bold"}
                color={COLORS.AppTheme.primary}
              >
                K
              </Text>
              wik
              <Text
                fontSize={"$4xl"}
                fontWeight={"bold"}
                color={COLORS.AppTheme.primary}
              >
                C
              </Text>
              heck
            </Text>
            <Text
              fontSize={"$md"}
              textTransform="uppercase"
              fontWeight={"bold"}
              color={COLORS.textSecondary}
            >
              {`The raise and price of \t
						your wheels`}
            </Text>
          </View>
          <Box pb={"$8"} display="flex" flexWrap="wrap" height={"$48"}>
            <Image
              source={HeroImg}
              alt="hero"
              objectFit="contain"
              width={300}
              height={160}
            />
          </Box>
          <Input>
            <InputSlot pl={"$4"}>
              <InputIcon as={MailIcon}></InputIcon>
            </InputSlot>

            <InputField
              placeholder="Enter UserName"
              value={loginData?.username}
              onChangeText={(text) => {
                setLoginData({ ...loginData, username: text });
              }}
            />
          </Input>
          <Input>
            <InputSlot pl={"$4"}>
              <InputIcon as={LockIcon}></InputIcon>
            </InputSlot>
            <InputField
              ref={passwordRef}
              placeholder="Enter Pass"
              type={showPassword ? "text" : "password"}
              value={loginData?.password}
              onSubmitEditing={HandleLogin}
              onChangeText={(text) => {
                setLoginData({ ...loginData, password: text });
              }}
            />

            <InputSlot pr={"$4"} onPress={() => setShowPassword(!showPassword)}>
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon}></InputIcon>
            </InputSlot>
          </Input>
          <Box display="flex" alignItems="flex-end">
            <Text>Forgot Password ?</Text>
          </Box>
          <Button onPress={HandleLogin}>
            <Text color="white">Login</Text>
          </Button>
        </View>
      </View>
      <Animated.View style={[styles.footerText, marginTopStyle]}>
        <Text color={COLORS.AppTheme.primary} fontWeight={"bold"}>
          For any issues contact{" "}
        </Text>
        <Text
          fontWeight={"bold"}
          color={COLORS.textSecondary}
          // style={{ marginTop: isKeyboardVisible ? 120 : 0 }}
          onPress={() => HandleNativeClick("tel")}
        >
          0000000000
        </Text>
        <Text
          fontWeight={"bold"}
          color={COLORS.textSecondary}
          onPress={() => HandleNativeClick("mail")}
        >
          support@kwikcheck.in
        </Text>
      </Animated.View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90%",
    position: "relative",
  },
  footerText: {
    textAlign: "center",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 6,
  },
});
