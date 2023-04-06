import { createSlice } from "@reduxjs/toolkit";
import { login } from "../actions/authActions";
import { RootState } from "../store";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface AuthSliceType {
  loading: boolean;
  userInfo?: any;
  userToken?: string;
  error?: string;
  success: boolean;
}
const initialState: AuthSliceType = {
  loading: false,
  userInfo: {}, // for user object
  userToken: "", // for storing the JWT
  error: "",
  success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.userToken = action.payload;
    },
    logout: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userToken = action.payload?.token;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const selectToken = (state: RootState) => state.auth.userToken;
export const { setToken, logout } = authSlice.actions;
export const authReducer = persistReducer(
  {
    key: "rtk:auth",
    storage,
    whitelist: ["userToken"],
  },
  authSlice.reducer
);
export default authSlice;
