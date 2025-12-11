import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import React from "react";
import { Button } from "@gluestack-ui/themed";
import useZustandStore from "@src/store/useZustandStore";
import { LocalStorage } from "@src/Utils";
import { LocalDataType } from "@src/db/HandleStoreData";
import { useCustomNavigation } from "@src/services/useCustomNavigation";
import { TokenLogout } from "@src/services/Slices";

export default function Logout(args: any) {
  const { replaceNavigation } = useCustomNavigation();

  const HandleLogout = async () => {
    const data: LocalDataType[] = await LocalStorage.get("sync_queue");
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].side.length < data[i].totalLength) {
          ToastAndroid.show(
            "Please valuate all the leads to logout",
            ToastAndroid.LONG
          );
          return;
        }
      }
    }

    const response = await TokenLogout();
    if (response) {
      replaceNavigation("Login");
      await LocalStorage.clear();
      console.log("LocalDataType", data);
    }
  };

  return (
    <Button onPress={HandleLogout}>
      <Text style={{ color: "white" }}>Logout</Text>
    </Button>
  );
}

const styles = StyleSheet.create({});
