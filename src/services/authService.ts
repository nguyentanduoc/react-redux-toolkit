import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../utils/axiosBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => ({
        url: "/employee/getAll",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllUserQuery } = authApi;
