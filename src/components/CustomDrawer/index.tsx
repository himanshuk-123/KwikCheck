import React from "react";
import { View, Text, Button } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Logout from "../Logout";

const CustomDrawer = (props) => {
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View
        style={{ position: "static", bottom: 10, padding: 20, width: "100%" }}
      >
        <Logout />
      </View>
    </View>
  );
};

export default CustomDrawer;
