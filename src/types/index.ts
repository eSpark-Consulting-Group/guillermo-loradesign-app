export interface Device {
  id: number;
  name: string;
  deviceInfo: DeviceInfo[];
}

export interface DeviceInfo {
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  title: string;
  details: string[];
}
