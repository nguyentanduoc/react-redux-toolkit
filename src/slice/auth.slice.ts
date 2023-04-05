import { createSlice } from "@reduxjs/toolkit";
import { login } from "../actions/authActions";
import { RootState } from "../store";

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
  reducers: {},
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
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const selectToken = (state: RootState) => state.auth.userToken;

export default authSlice.reducer;
