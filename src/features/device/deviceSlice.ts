import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "../../types";

export interface DeviceState {
  selectedDevice: Device | null;
}

const initialState: DeviceState = {
  selectedDevice: null,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    selectDevice: (state, action: PayloadAction<Device>) => {
      state.selectedDevice = action.payload;
    },
    clearDevice: (state) => {
      state.selectedDevice = null;
    },
  },
});

export const { selectDevice, clearDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
