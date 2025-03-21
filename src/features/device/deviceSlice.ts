import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BleDevice } from "../../types";
import { storage } from "../../store/mmkv";

const DEVICE_STORAGE_KEY = "selectedDevice";

const getInitialDevice = (): BleDevice | null => {
  const storedDevice = storage.getString(DEVICE_STORAGE_KEY);
  return storedDevice ? JSON.parse(storedDevice) : null;
};

interface DeviceState {
  selectedDevice: BleDevice | null;
}

const initialState: DeviceState = {
  selectedDevice: getInitialDevice(),
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    selectDevice: (state, action: PayloadAction<BleDevice>) => {
      state.selectedDevice = action.payload;
      storage.set(DEVICE_STORAGE_KEY, JSON.stringify(action.payload));
    },
  },
});

export const { selectDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
