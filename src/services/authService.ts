import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../utils/axiosBaseQuery";

interface IUser {
  id: string;
  username: string;
}
export const AUTH_API_REDUCER_KEY = "authApi";

export const authApi = createApi({
  reducerPath: AUTH_API_REDUCER_KEY,
  baseQuery: axiosBaseQuery({ baseUrl: "/employee" }),
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => ({
        url: "/getAll",
        method: "GET",
      }),
    }),
    getById: builder.mutation<IUser, string>({
      query: (id: string) => ({ url: `/${id}`, method: "GET" }),
    }),
  }),
});

export const { useGetAllUserQuery, useGetByIdMutation } = authApi;
