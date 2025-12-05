import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BleDevice } from "../../types";
import { storage } from "../../store/mmkv";
import { Device } from "react-native-ble-plx";

const DEVICE_STORAGE_KEY = "selectedDevice";

const getInitialDevice = (): BleDevice | null => {
  const storedDevice = storage.getString(DEVICE_STORAGE_KEY);
  return storedDevice ? JSON.parse(storedDevice) : null;
};

interface DeviceState {
  selectedDevice: BleDevice | null;
  selectedBleDevice: Device | null;
}

const initialState: DeviceState = {
  selectedDevice: getInitialDevice(),
  selectedBleDevice: null,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    selectDevice: (state, action: PayloadAction<BleDevice>) => {
      state.selectedDevice = action.payload;
      storage.set(DEVICE_STORAGE_KEY, JSON.stringify(action.payload));
    },
    selectBleDevice: (state, action: PayloadAction<Device>) => {
      state.selectedBleDevice = action.payload;
    },
  },
});

export const { selectDevice, selectBleDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
