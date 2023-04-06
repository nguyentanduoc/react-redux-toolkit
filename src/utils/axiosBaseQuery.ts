import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type {
  AxiosError,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { logout, setToken } from "../slice/auth.slice";
import { RootState } from "../store";
import http from "./http";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

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
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    const headers: RawAxiosRequestHeaders = {};
    const token = (api.getState() as RootState).auth.userToken;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const configAxios: AxiosRequestConfig<any> = {
      url: baseUrl + url,
      method,
      data,
      params,
      headers,
    };
    try {
      const result = await http(configAxios);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (!mutex.isLocked()) {
        // checking whether the mutex is locked
        const release = await mutex.acquire();
        if (err.response?.status === 403) {
          try {
            //Call api refresh token
            const refreshToken = await http.post(
              "/auth/refresh-token",
              {},
              { headers: { ...headers, IsRefreshToken: "true" } }
            );
            if (refreshToken.data.token) {
              //set token mới
              api.dispatch(setToken(refreshToken.data.token));
              // retry the initial query
              const result = await http({
                ...configAxios,
                headers: {
                  ...configAxios.headers,
                  Authorization: `Bearer ${refreshToken.data.token}`,
                },
              });
              return { data: result.data };
            } else {
              api.dispatch(logout());
              return { data: null };
            }
          } catch (axiosError2) {
            const err2 = axiosError2 as AxiosError;
            return {
              error: {
                status: err2.response?.status,
                data: err2.response?.data || err2.message,
              },
            };
          } finally {
            // release must be called once the mutex should be released again.
            release();
          }
        }
      } else {
        // wait until the mutex is available without locking it
        await mutex.waitForUnlock();
        const result = await http(configAxios);
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
