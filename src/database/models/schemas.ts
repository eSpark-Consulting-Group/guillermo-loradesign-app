import Realm from 'realm';

export class TimestampSchema extends Realm.Object<TimestampSchema> {
  hour!: number;
  minute!: number;
  second!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Timestamp',
    properties: {
      hour: 'int',
      minute: 'int',
      second: 'int'
    }
  };
}

export class GeoDataSchema extends Realm.Object<GeoDataSchema> {
  ids!: number[];
  timestamp!: TimestampSchema;
  latitude!: number;
  longitude!: number;

  static schema: Realm.ObjectSchema = {
    name: 'GeoData',
    properties: {
      ids: 'int[]',
      timestamp: 'Timestamp',
      latitude: 'double',
      longitude: 'double'
    }
  };
}

export class BleDeviceSchema extends Realm.Object<BleDeviceSchema> {
  id!: string;
  name!: string;
  geoData!: GeoDataSchema[];

  static schema: Realm.ObjectSchema = {
    name: 'BleDevice',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      geoData: 'GeoData[]'
    }
  };
}