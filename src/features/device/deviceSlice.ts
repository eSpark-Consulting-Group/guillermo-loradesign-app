import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "../../types"; 
import { storage } from "../../store/mmkv"

const DEVICE_STORAGE_KEY = "selectedDevice";

const getInitialDevice = (): Device | null => {
  const storedDevice = storage.getString(DEVICE_STORAGE_KEY);
  return storedDevice ? JSON.parse(storedDevice) : null;
};

interface DeviceState {
  selectedDevice: Device | null;
}

const initialState: DeviceState = {
  selectedDevice: getInitialDevice(),
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    selectDevice: (state, action: PayloadAction<Device>) => {
      state.selectedDevice = action.payload;
      storage.set(DEVICE_STORAGE_KEY, JSON.stringify(action.payload));
    },
  },
});

export const { selectDevice } = deviceSlice.actions;
export default deviceSlice.reducer;