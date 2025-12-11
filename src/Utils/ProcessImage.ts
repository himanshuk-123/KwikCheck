import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Marker } from 'react-native-svg';

const processImage = async (imageUri: string) => {
    const manipResult = await manipulateAsync(
        imageUri,
        [{ rotate: -90 },],
        { format: SaveFormat.PNG }
    );

    return manipResult.uri
};

export { processImage }