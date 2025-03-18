import { Device } from ".";

export type RootStackParamList = {
  BaseStationSelection: undefined;
  BottomTabs: { device: Device };
};

export type BottomTabParamList = {
  Map: { device?: Device, fromCoordRedirect?:boolean };
  Settings: { device?: Device };
  Table: { device?: Device };
};
