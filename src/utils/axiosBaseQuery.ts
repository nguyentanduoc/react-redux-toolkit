import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type {
  AxiosError,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { RootState } from "../store";
import http from "./http";
import { setToken } from "../slice/auth.slice";

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
      const headers: RawAxiosRequestHeaders = {};
      const token = (api.getState() as RootState).auth.userToken;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      try {
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
        if (err.response?.status === 403) {

          //Call api refresh token
          const refreshToken = await http({
            url: '/auth/refresh-token',
            method: 'POST',
            headers: { ...headers, 'IsRefreshToken': "true" },
          });

          //set token mới
          api.dispatch(setToken(refreshToken.data.token));
          //Retry api
          const result = await http({
            url: baseUrl + url,
            method,
            data,
            params,
            headers: { 'Authorization': `Bearer ${refreshToken.data.token}` },
          });
          return { data: result.data };
        }
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };

export default axiosBaseQuery;
