import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "../utils/http";

export interface AuthResponse {
  token: string;
}
export interface ILogin {
  username?: string;
  password?: string;
}

export const login = createAsyncThunk<AuthResponse, ILogin>(
  "/auth/login",
  async (data, thunkAPI) => {
    const response = await http.post<AuthResponse>("/auth/login", data, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);
