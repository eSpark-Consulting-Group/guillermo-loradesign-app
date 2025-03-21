import { BleDevice } from ".";
// import { Device } from "react-native-ble-plx";

export type RootStackParamList = {
  BaseStationSelection: undefined;
  BottomTabs: { device: BleDevice };
  // BottomTabs: { device?: Device; geoData?: GeoData };
};

export type BottomTabParamList = {
  Map: { device?: BleDevice; fromCoordRedirect?: boolean };
  // Map: { device?: Device; geoData?: GeoData; fromCoordRedirect?: boolean };
  Settings: { device?: BleDevice };
  Table: { device?: BleDevice };
};
