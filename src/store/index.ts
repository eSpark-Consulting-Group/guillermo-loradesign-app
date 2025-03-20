import { configureStore } from "@reduxjs/toolkit";
import deviceReducer from "../features/device/deviceSlice";

export const store = configureStore({
  reducer: {
    device: deviceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['device/setDevices'],
        ignoredActionPaths: ['meta.arg', 'payload'],
        ignoredPaths: ['device.allDevices'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;