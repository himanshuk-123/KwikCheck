import * as FileSystem from "expo-file-system/legacy";

// Assuming `fileUri` is the URI of the video you want to convert to a Blob
async function convertFileToBlob(fileUri: string) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.uri) return;

    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", fileInfo.uri, true);
      xhr.send(null);
    });

    return blob;
  } catch (error) {
    console.error("Error reading video file:", error);
  }
}

// Helper function to convert a base64 string to a Blob
async function base64ToBlob(
  base64: string,
  contentType: string = "video/mp4",
  sliceSize = 512
) {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export { convertFileToBlob, base64ToBlob };
