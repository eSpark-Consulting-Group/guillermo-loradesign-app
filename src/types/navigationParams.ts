import { Device } from ".";

export type RootStackParamList = {
  BaseStationSelection: undefined;
  BottomTabs: { device: Device };
};

export type BottomTabParamList = {
  Map: { device?: Device, fromTable?:boolean };
  Settings: { device?: Device };
  Table: { device?: Device };
};
