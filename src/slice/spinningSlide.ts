import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ISpinning {
  spinning: boolean;
  requestIds: string[];
}

const initialState: ISpinning = {
  spinning: false,
  requestIds: [],
}

const spinningSlice = createSlice({
  name: 'spinning',
  initialState,
  reducers: {
    addRequest: (state, action) => {
      state.requestIds.push(action.payload)
    },
    removeRequest: (state) => {
      state.requestIds.pop()
    }
  }
})
export default spinningSlice.reducer;
export const { addRequest, removeRequest } = spinningSlice.actions;
export const selectRequestId = (state: RootState) => state.spinning.requestIds;