export interface BleDevice {
  id: string;
  name: string;
  geoData: GeoData[];
}

export interface GeoData {
  ids: number[];
  timestamp: Timestamp;
  latitude: number;
  longitude: number;
}

export interface Timestamp {
  hour: number;
  minute: number;
  second: number;
}