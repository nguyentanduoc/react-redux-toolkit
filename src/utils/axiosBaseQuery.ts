import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type {
  AxiosError,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { RootState } from "../store";
import http from "./http";

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }, api) => {
    try {
      const headers: RawAxiosRequestHeaders = {};
      const token = (api.getState() as RootState).auth.userToken;
      console.log(token);

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const result = await http({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
