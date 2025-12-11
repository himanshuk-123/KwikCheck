import { Data, HandleSaveImageTypes } from "../@types";
import useDBServices from "../db";
import { saveImage } from "../services/fs";
import { FullPageLoader } from "./FullpageLoader";
import * as FileSystem from 'expo-file-system/legacy';
import { HandleStoreDataToAsyncStore } from "../db/HandleStoreData";

const HandleSaveImage = async ({
  uri,
  side,
  id,
  answer,
  removePreviousImage,
  totalLength,
}: HandleSaveImageTypes) => {
  try {
    FullPageLoader.open({
      label: "Saving image...",
    });

    console.log("IN HANDLESAVEIMG", uri, removePreviousImage);
    const imgUrl = await savePictureToLocalStorage(uri);
    await HandleStoreDataToAsyncStore({
      imgUrl,
      side,
      id,
      answer,
      totalLength,
    });
    return imgUrl;
  } catch (error) {
    console.log(error);
  } finally {
    FullPageLoader.close();
  }
};

export const removePictureToLocalStorage = async (uri: string) => {
  try {
    const filePath = `${FileSystem.documentDirectory}photos/`;
    await FileSystem.deleteAsync(uri, { idempotent: true });
    console.log(`Photo removed from ${filePath}`);
  } catch (error) {
    console.log("ERROR IN REMOVING IMAGE", error);
  }
};

const savePictureToLocalStorage = async (uri: string) => {

  try {
    
    const dir = FileSystem.documentDirectory + 'photos/';
    // create folder if needed
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => { /* ignore if exists */ });

    const fileName = `${Date.now()}.jpg`;
    const dest = dir + fileName;
    // move (works for file:// and content:// when using legacy helpers)
    await FileSystem.copyAsync({ from: uri, to: dest });

    console.log(`Photo saved to ${dest}`);
    return dest;
  } catch (err) {
    console.error('savePictureToLocalStorage error', err);
    throw err;
  }
};

export { HandleSaveImage, savePictureToLocalStorage };
