import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import deviceReducer from "../features/device/deviceSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedDeviceReducer = persistReducer(persistConfig, deviceReducer);

export const store = configureStore({
  reducer: {
    device: persistedDeviceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
