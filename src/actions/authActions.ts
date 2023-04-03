import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/http";

export interface AuthResponse {
  token: string;
}
export interface ILogin {
  username?: string;
  password?: string;
}

export const login = createAsyncThunk("/auth/login", async (_, thunkAPI) => {
  const response = await http.post<AuthResponse>(
    "/auth/login",
    { username: "admin", password: "admin" },
    {
      signal: thunkAPI.signal,
    }
  );
  console.log(response.data);
  localStorage.setItem("token", response.data.token);
  return response.data;
});
