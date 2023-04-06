import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/auth.slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "./services/authService";
import { loadingMiddleware } from "./utils/loadingMiddleware";
import spinningSlide from "./slice/spinningSlide";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    spinning: spinningSlide,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, loadingMiddleware]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
