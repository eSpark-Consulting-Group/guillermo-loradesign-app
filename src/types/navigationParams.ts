import { Device } from ".";

export type RootStackParamList = {
  BaseStationSelection: undefined;
  BottomTabs: { device: Device };
};

export type BottomTabParamList = {
  Map: { device?: Device };
  Settings: { device?: Device };
  Table: { device?: Device };
};
