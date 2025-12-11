import { Input, InputField } from "@gluestack-ui/themed";
import { COLORS } from "@src/constants/Colors";
import { ChangePass } from "@src/services/Slices/ChangePass";
import { useCustomNavigation } from "@src/services/useCustomNavigation";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const { replaceNavigation } = useCustomNavigation();
  const navigation = useNavigation();

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setErrorText("Passwords do not match");
    } else {
      if (errorText !== "") setErrorText("");
    }
  }, [newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmPassword) return;

      if (newPassword !== confirmPassword) {
        setErrorText("Passwords do not match");
        return;
      }

      const resp = await ChangePass({
        Password: newPassword,
        oldPassword,
      });

      console.log("resp", resp);

      if (!resp) {
        setErrorText("Something went wrong");
        return;
      }

      ToastAndroid.show("Password changed successfully", ToastAndroid.LONG);

      // @ts-expect-error it exists
      navigation.replace("Login");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        display: "flex",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <View>
        <Input
          variant="outline"
          style={{
            borderColor: COLORS.textSecondary,
            borderWidth: 1,
            height: 40,
            marginVertical: 7,
          }}
        >
          <InputField
            value={oldPassword}
            secureTextEntry
            placeholder={"Old Password*"}
            onChangeText={(text) => {
              if (text !== oldPassword) {
                setOldPassword(text);
              }
            }}
          />
        </Input>
        <Input
          variant="outline"
          style={{
            borderColor: COLORS.textSecondary,
            borderWidth: 1,
            height: 40,
            marginVertical: 7,
          }}
        >
          <InputField
            value={newPassword}
            placeholder={"New Password*"}
            autoCapitalize="none"
            secureTextEntry
            onChangeText={(text) => {
              if (text !== newPassword) {
                setNewPassword(text);
              }
            }}
          />
        </Input>
        <Input
          variant="outline"
          style={{
            borderColor: COLORS.textSecondary,
            borderWidth: 1,
            height: 40,
            marginVertical: 7,
          }}
        >
          <InputField
            value={confirmPassword}
            placeholder={"Confirm Password*"}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(text) => {
              if (text !== confirmPassword) {
                setConfirmPassword(text);
              }
            }}
          />
        </Input>
        {errorText && <Text style={styles.errorText}>{errorText}</Text>}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        enabled
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 50 })}
        style={{}}
      >
        <View
          style={{
            height: 50,
          }}
        >
          <TouchableOpacity
            onPress={handleChangePassword}
            style={[
              styles.btnContainer,
              { paddingTop: 0, backgroundColor: COLORS.AppTheme.primary },
            ]}
          >
            <Text style={styles.btnText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    textAlign: "center",
    borderRadius: 5,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: 14,
  },
  errorText: {
    color: "red",
  },
});
