import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const processImage = async (uri: string): Promise<string> => {
  const result = await manipulateAsync(
    uri,
    [
      {
        resize: { width: 1200 }, // 👈 NOT 1600
      },
    ],
    {
      compress: 0.75,           // 👈 better quality
      format: SaveFormat.JPEG,
    }
  );

  return result.uri;
};
