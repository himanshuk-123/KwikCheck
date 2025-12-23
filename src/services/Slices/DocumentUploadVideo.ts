import { FullPageLoader, LocalStorage } from "@src/Utils";
import { ToastAndroid } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import axios from "axios";

import { Video } from "react-native-compressor";

// 🔧 Compress the video using ffmpeg

const DocumentUploadVideo = async ({
  videoUri,
  LeadId,
}: {
  videoUri: string;
  LeadId: string;
}) => {
  try {
    const userCredentials = await LocalStorage.get("user_credentials");
    const formData = new FormData();

    const { uri } = await FileSystem.getInfoAsync(videoUri);
    // console.log("📦 Compressing video...");
    // const compressedUri = await Video.compress(uri, {
    //   compressionMethod: "auto", // or 'manual'
    //   minimumFileSizeForCompress: 5 * 1024 * 1024, // Compress if > 5MB
    // });

    formData.append("LeadId", LeadId);
    formData.append("Video1", Date.now().toString());
    formData.append("TokenID", userCredentials?.TokenID?.toString());
    formData.append("Version", "2");
    formData.append("Video1", {
      name: "Video.mp4",
      type: "video/mp4",
      uri: uri,
    } as any);
    const response = await axios.post(
      process.env.EXPO_PUBLIC_API_BASE_URI +
        "/App/webservice/DocumentUploadVideo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "*/*",
          TokenID: userCredentials?.TOKENID,
          Version: "2",
        },
      }
    );
    // console.log("DocumentUploadVideo Upload Status:", response.data);

    return response.data;
  } catch (error) {
    console.log(error);

    ToastAndroid.show(
      "Something went wrong while uploading the video.",
      ToastAndroid.LONG
    );
  } finally {
    FullPageLoader.close();
  }
};

export default DocumentUploadVideo;

// const DocumentUploadVideo = async ({ videoUri, LeadId }) => {
//   try {
//     const userCredentials = await LocalStorage.get("user_credentials");
//     const fileInfo = await FileSystem.getInfoAsync(videoUri);
//     console.log("📂 File Info:", fileInfo);
//     const { uri } = fileInfo;

//     if (!fileInfo.exists) {
//       throw new Error("Video file does not exist at provided path");
//     }

//     const formData = new FormData();
//     formData.append("LeadId", LeadId);
//     formData.append("Video1", Date.now().toString()); // May not be needed
//     formData.append("TokenID", userCredentials?.TokenID?.toString());
//     formData.append("Version", "2");
//     formData.append("Video1", {
//       name: "Video.mp4",
//       type: "video/mp4",
//       uri: uri,
//     } as any);

//     const response = await axios.post(
//       process.env.EXPO_PUBLIC_API_BASE_URI +
//         "/App/webservice/DocumentUploadVideo",
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Accept: "*/*",
//           TokenID: userCredentials?.TOKENID,
//           Version: "2",
//         },
//       }
//     );
//     console.log("✅ Upload Success:", response.data);
//     return response.data;
//   } catch (error: any) {
//     console.log("❌ Upload Failed:", error?.message);
//     if (axios.isAxiosError(error)) {
//       console.log("❌ Axios Error Data:", error.response?.data);
//       console.log("❌ Axios Error Status:", error.response?.status);
//     }
//     ToastAndroid.show(
//       "Upload failed: " + (error?.message || "Unknown error"),
//       ToastAndroid.LONG
//     );
//     throw error; // Important to rethrow if you want ErrorBoundary to catch it
//   } finally {
//     FullPageLoader.close();
//   }
// };

// export default DocumentUploadVideo;
