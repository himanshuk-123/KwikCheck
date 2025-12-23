import * as FileSystem from "expo-file-system/legacy";

const deleteLocalFile = async (fileUri: string) => {
  try {
    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      console.log("File does not exist at provided URI");
      return;
    }

    // Delete the file
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export { deleteLocalFile };
