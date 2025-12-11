import { Share, ToastAndroid } from "react-native";

export const share = async (url: string) => {
  try {
    console.log("url", url);
    const result = await Share.share({
      message: `Checkout this lead!\n${url}`,
      url,
      title: "Share",
    });
  } catch (error) {}
};
