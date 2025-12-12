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

      // console.log("userCredentials", userCredentials)
      // const resp = await axios.post(service, body, {
      // 	headers: {
      // 		'Content-Type': 'multipart/form-data',
      // 		"TokenID": "069e5ac1-9308-409f-b78d-7d0d35f3dee5",
      // 		'accept': '*',
      // 		...custheaders,
      // 	},
      // 	maxBodyLength: Infinity,

      // });

      // const resp = await fetch("https://inspection.kwikcheck.in/" + service, {
      //   method: "POST",
      //   body,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     TokenID: userCredentials?.TOKENID || "",
      //     ...custheaders,
      //   },
      // });

      const resp = await axios.post(service, body, {
        headers: {
          "Content-Type": "multipart/form-data",
          TokenID: userCredentials?.TOKENID || "",
          ...custheaders,
        },
      });

      // console.log(
      //   "STATUS:",
      //   resp.status,
      //   "\nCONTENT TYPE:",
      //   resp.headers.get("content-type")
      // );
      // console.log("RAW BODY:", await resp.text());

      return resp;
    } catch (error) {
      console.log(error);
    } finally {
      if (label) FullPageLoader.close();
    }
  };

  return { post, postWithFormData };
};

export default apiCallService;
