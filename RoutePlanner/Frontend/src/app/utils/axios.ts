import defautlAxios, { AxiosRequestConfig } from "axios";

const axiosConfig: AxiosRequestConfig = {
  baseURL: process.env.BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json"
  },
};

const axios = defautlAxios.create(axiosConfig);

export { axios };