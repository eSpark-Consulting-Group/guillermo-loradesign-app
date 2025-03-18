import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "../../types"; 
import { storage } from "../../store/mmkv"

const DEVICE_STORAGE_KEY = "selectedDevice";
const DEVICES_STORAGE_KEY = "allDevices";

const getInitialDevice = (): Device | null => {
  const storedDevice = storage.getString(DEVICE_STORAGE_KEY);
  return storedDevice ? JSON.parse(storedDevice) : null;
};

const getInitialDevices = (): Device[] => {
  const storedDevices = storage.getString(DEVICES_STORAGE_KEY);
  return storedDevices ? JSON.parse(storedDevices) : [];
};

interface DeviceState {
  selectedDevice: Device | null;
  allDevices: Device[];
}

const initialState: DeviceState = {
  selectedDevice: getInitialDevice(),
  allDevices: getInitialDevices(),
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.allDevices = action.payload;
      storage.set(DEVICES_STORAGE_KEY, JSON.stringify(action.payload));
    },
    selectDevice: (state, action: PayloadAction<Device>) => {
      state.selectedDevice = action.payload;
      storage.set(DEVICE_STORAGE_KEY, JSON.stringify(action.payload));
    },
  },
});

export const { setDevices, selectDevice } = deviceSlice.actions;
export default deviceSlice.reducer;