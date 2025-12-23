import * as FileSystem from "expo-file-system/legacy";

const readFileAsBase64 = async (fileUri: string) => {
  try {
    const base64Data = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64Data;
  } catch (error) {
    console.error("Error reading file as base64:", error);
    throw error;
  }
};

export { readFileAsBase64 };
