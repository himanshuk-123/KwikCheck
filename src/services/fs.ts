import * as FileSystem from 'expo-file-system';
const saveImage = async (imageBase64: string) => {
    try {
        console.log('saving image...');
        const fileName = `${FileSystem.documentDirectory}image_${Date.now()}.jpg`;
        const data = await FileSystem.writeAsStringAsync(fileName, imageBase64, {
            encoding: FileSystem.EncodingType.Base64,
        });
        console.log('saved image...', fileName, "data:", data);
        return fileName;
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        // FullPageLoader.close()
    }
};

export { saveImage }