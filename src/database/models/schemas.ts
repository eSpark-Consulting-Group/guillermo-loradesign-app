import Realm from "realm";

export class DeviceInfoSchema extends Realm.Object<DeviceInfoSchema> {
  id!: number;
  latitude!: number;
  longitude!: number;
  title!: string;
  details!: string[];

  static schema = {
    name: "DeviceInfo",
    primaryKey: "id",
    properties: {
      id: "int",
      latitude: "double",
      longitude: "double",
      title: "string",
      details: "string[]",
    },
  };
}

export class DeviceSchema extends Realm.Object<DeviceSchema> {
  id!: number;
  name!: string;
  deviceInfo!: Realm.List<DeviceInfoSchema>;

  static schema = {
    name: "Device",
    primaryKey: "id",
    properties: {
      id: "int",
      name: "string",
      deviceInfo: "DeviceInfo[]",
    },
  };
}
