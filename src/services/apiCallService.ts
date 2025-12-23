import { FullPageLoader, LocalStorage } from "@src/Utils";
import Axios from "axios";

const axios = Axios.create({
  // @ts-ignore
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URI || "https://inspection.kwikcheck.in/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(function (request) {
  // console.log();
  // console.log(`==== REQUEST TO ${request.url} ====`);
  // console.log(JSON.stringify(request.data, null, 2));
  // console.log(`========`);
  // console.log();
  return request;
});

axios.interceptors.response.use(function (response) {
  // console.log();
  // console.log(`==== RESPONSE FROM ${response.request._url} ====`);
  // console.log(JSON.stringify(response.data, null, 2));
  // console.log(`========`);
  // console.log();
  return response;
});

interface ApiCallType {
  service: string;
  body?: Record<any, any>;
  headers?: Record<string, string>;
  label?: string;
}

interface ApiCallTypeFormData {
  service: string;
  body?: any;
  headers?: Record<string, string>;
  label?: string;
}

/**
 * Summarize FormData for console debugging
 */
const summarizeFormData = (fd: any) => {
  try {
    const parts = fd && Array.isArray((fd as any)._parts) ? (fd as any)._parts : null;
    if (!parts) return;
    
    const summary = parts.map(([key, value]: [string, any]) => {
      if (typeof value === "string") {
        return `  ${key}: "${value.substring(0, 40)}..."`;
      }
      return `  ${key}: [File] ${value?.name} (${value?.type})`;
    });
    console.log("[FormData Parts]\n" + summary.join("\n"));
  } catch (e) {
    console.log("[FormData] Unable to summarize:", e);
  }
};

const apiCallService = () => {
  const post = async ({
    service,
    body,
    headers: custheaders,
    label,
  }: ApiCallType) => {
    try {
      console.log("custheaders", custheaders);
      const userCredentials = await LocalStorage.get("user_credentials");
      console.log({ userCredentials });
      if (label)
        FullPageLoader.open({
          label: label,
        });

      const defaultHeaders = {
        headers: {
          "Content-Type": "application/json",
          TokenID: userCredentials?.TOKENID || "",
          accept: "application/json",
          Version: "2",
          "accept-encoding": "application/json",
          ...custheaders,
        },
      };

      console.log("service", service);
      // console.log("body", body);
      console.log("defaultHeaders", defaultHeaders);
      const resp = await axios.post(service, body, defaultHeaders);

      return resp.data;
    } catch (error) {
      console.log(error);
    } finally {
      if (label) FullPageLoader.close();
    }
  };

  const postWithFormData = async ({
    service,
    body,
    headers: custheaders,
    label,
  }: ApiCallTypeFormData) => {
    try {
      const userCredentials = await LocalStorage.get("user_credentials");
      if (label)
        FullPageLoader.open({
          label: label,
        });

      console.log(`[API] POST multipart to: ${service}`);
      console.log(`[API] Headers:`, { TokenID: userCredentials?.TOKENID ? "[SET]" : "[MISSING]", ...custheaders });
      summarizeFormData(body);

      const resp = await axios.post(service, body, {
        headers: {
          "Content-Type": "multipart/form-data",
          TokenID: userCredentials?.TOKENID || "",
          ...custheaders,
        },
        timeout: 30000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      console.log(`[API] ✅ Response status: ${resp.status}`);
      console.log(`[API] Response data:`, resp.data);

      return resp;
    } catch (error: any) {
      console.error(`[API] ❌ Error:`, {
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      throw error;
    } finally {
      if (label) FullPageLoader.close();
    }
  };

  return { post, postWithFormData };
};

export default apiCallService;
