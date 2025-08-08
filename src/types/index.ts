export interface BleDevice {
  id: string;
  name: string;
  geoData: GeoData[] | null;
}

export interface GeoData {
  id: number | string;
  timestamp: Timestamp;
  latitude: number;
  longitude: number;
}

export interface Timestamp {
  hour: number;
  minute: number;
  second: number;
}
