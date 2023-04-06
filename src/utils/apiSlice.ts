import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080',
  credentials: 'include',
})