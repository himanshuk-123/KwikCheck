import * as WebBrowser from "expo-web-browser";

export const openUrlInBrowser = (url: string) => {
  WebBrowser.openBrowserAsync(url);
};
