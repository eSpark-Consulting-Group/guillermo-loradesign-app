import { Device } from ".";
// import { Device } from "react-native-ble-plx";
import { GeoData } from "../hooks/useBLE";

export type RootStackParamList = {
  BaseStationSelection: undefined;
  // BottomTabs: { device: Device };
  // BottomTabs: { device?: Device; geoData?: GeoData };
};

export type BottomTabParamList = {
  Map: { device?: Device; fromCoordRedirect?: boolean };
  // Map: { device?: Device; geoData?: GeoData; fromCoordRedirect?: boolean };
  Settings: { device?: Device };
  Table: { device?: Device };
};
