import { BleDevice, GeoData } from ".";
// import { Device } from "react-native-ble-plx";

export type RootStackParamList = {
  BaseStationSelection: undefined;
  BottomTabs: { device: BleDevice };
  // BottomTabs: { device?: Device; geoData?: GeoData };
};

export type BottomTabParamList = {
  Map: { device?: BleDevice};
  Settings: { device?: BleDevice };
  Table: { device?: BleDevice };
};
