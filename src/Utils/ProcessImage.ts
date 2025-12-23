import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const processImage = async (imageUri: string): Promise<string> => {
  const manipResult = await manipulateAsync(
    imageUri,
    [
      { resize: { width: 1024, } },
      { rotate: -90 },
    ],
    { 
      compress: 0.75,
      format: SaveFormat.JPEG 
    }
  );
  return manipResult.uri;
};
export {processImage};