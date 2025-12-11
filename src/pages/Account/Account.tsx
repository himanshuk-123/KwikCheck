import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { Avatar, Button, Image, Input, InputField } from "@gluestack-ui/themed";
import { AvatarFallbackText } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { AvatarImage } from "@gluestack-ui/themed";
import { DocumentUploadOtherImageApp } from "@src/services/Slices/DocumentUploadOtherImageApp";
import { LocalStorage } from "@src/Utils";
import { ProfileInterface } from "@src/@types/UserProfile";
import { EMPTY_PROFILE_DATA } from "@src/constants/Empty";
import { useCustomNavigation } from "@src/services/useCustomNavigation";

type Props = {};

const Account = (props: Props) => {
  const [image, setImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileInterface>(EMPTY_PROFILE_DATA);
  const { pushNavigation } = useCustomNavigation();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log(result);

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].uri);
      await DocumentUploadOtherImageApp({
        base64String: result.assets[0].base64.toString(),
        paramName: "Profile",
        // LeadId: "",
        // VehicleTypeValue: "",
      });
    } else {
      //   if (!result.assets.[0].uri) return;
    }
  };

  useEffect(() => {
    (async () => {
      const userCredentials = await LocalStorage.get("user_credentials");
      setProfile(userCredentials);
      setImage(userCredentials.ProfileImage);
    })();
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <View>
          <View style={styles.imageContainer}>
            <Avatar
              style={styles.avatar}
              size="2xl"
              bgColor="$coolGray500"
              onTouchEnd={pickImage}
            >
              {/* <AvatarFallbackText>Neeraj Dave</AvatarFallbackText> */}
              {image ? (
                <AvatarImage
                  alt="Profile"
                  source={{ uri: `https://inspection.kwikcheck.in${image}` }}
                />
              ) : (
                <Feather name="camera" size={40} color="white" />
              )}
            </Avatar>
            <Text style={styles.imageContainerText}>{profile.SHOPNAME}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.fwBold}>User Name</Text>
            <Input variant="outline">
              <InputField
                placeholder="john@doe.com"
                onChangeText={(e) => {
                  return;
                }}
                value={profile.LoginUserId}
              />
            </Input>
            <Text style={styles.fwBold}>Email ID</Text>
            <Input variant="outline">
              <InputField
                placeholder="john@doe.com"
                onChangeText={(e) => {
                  setProfile((profile) => ({ ...profile, EMAIL: e }));
                }}
                value={profile.EMAIL}
              />
            </Input>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          enabled
          keyboardVerticalOffset={Platform.select({ ios: 80, android: 50 })}
          style={{}}
        >
          <View
            style={{
              height: 150,
            }}
          >
            <TouchableOpacity style={[styles.flexAndCenter]}>
              <Button variant="outline" w="$full">
                <Text>Help</Text>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.flexAndCenter, { paddingTop: 0 }]}>
              <Button
                bgColor={COLORS.AppTheme.primary}
                w="$full"
                onPress={() => {
                  pushNavigation("ChangePassword");
                }}
              >
                <Text style={{ color: "white" }}>Change Password</Text>
              </Button>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    position: "relative",
  },
  imageContainerText: {
    fontWeight: "bold",
    paddingTop: 10,
    fontSize: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fwBold: {
    fontWeight: "bold",
  },
  detailContainer: {
    padding: 20,
    display: "flex",
    gap: 10,
  },
  flexAndCenter: {
    display: "flex",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
