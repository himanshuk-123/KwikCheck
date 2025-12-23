import { Image as ImageCompressor } from 'react-native-compressor';

const processImage = async (uri: string): Promise<string> => {
  try {
    const result = await ImageCompressor.compress(uri, {
      compressionMethod: 'manual', // ❗ auto nahi
      maxWidth: 1024,              // 🔑 size control
      quality: 0.55,               // 🔑 below this blur
      returnableOutputType: 'uri',
    });

    return result;
  } catch (error) {
    console.error("Compression failed:", error);
    return uri;
  }
};

export { processImage };
