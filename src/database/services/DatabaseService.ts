import Realm from "realm";
import { BleDeviceSchema, GeoDataSchema, TimestampSchema } from "../models/schemas";
import RealmMigrationService from "../migration/RealmMigrationService";
import { BleDevice } from "@/src/types";

class DatabaseService {
  private static instance: DatabaseService;
  private realm: Realm;

  private constructor() {
    this.realm = new Realm({
      schema: [BleDeviceSchema, GeoDataSchema, TimestampSchema],
      schemaVersion: 1,
      onMigration: RealmMigrationService.handleMigration,
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  saveDevice(device: BleDevice): void {
    try {
      this.realm.write(() => {
        let existingDevice = this.realm.objectForPrimaryKey<BleDeviceSchema>("BleDevice", device.id);

        if (existingDevice) {
          existingDevice.name = device.name;
          device.geoData.forEach((info) => {
            let existingInfo = existingDevice.geoData.find((d) => d.ids[0] === info.ids[0]);
            const newTimestamp = this.realm.create<InstanceType<typeof TimestampSchema>>("Timestamp", {
              hour: info.timestamp.hour,
              minute: info.timestamp.minute,
              second: info.timestamp.second,
            });
            if (existingInfo) {
              existingInfo.ids = info.ids;
              existingInfo.timestamp = newTimestamp;
              existingInfo.latitude = info.latitude;
              existingInfo.longitude = info.longitude;
            } else {
              const newGeoData = this.realm.create<GeoDataSchema>("GeoData", {
                ids: info.ids,
                timestamp: newTimestamp,
                latitude: info.latitude,
                longitude: info.longitude,
              });
              existingDevice.geoData.push(newGeoData);
            }
          });
        } else {
          this.realm.create("BleDevice", {
            id: device.id,
            name: device.name,
            geoData: device.geoData.map((info) => ({
              ids: info.ids,
              timestamp: info.timestamp,
              latitude: info.latitude,
              longitude: info.longitude,
            })),
          });
        }
      });
      console.log("Device saved successfully!");
    } catch (error) {
      console.error("Error saving to Realm:", error);
    }
  }

  getAllDevices(): BleDevice[] {
    const results = this.realm.objects<BleDeviceSchema>("BleDevice");
    return results.map((device) => ({
      id: device.id,
      name: device.name,
      geoData: device.geoData.map((info) => ({
        ids: info.ids,
        latitude: info.latitude,
        longitude: info.longitude,
        timestamp: info.timestamp,
      })),
    }));
  }

  closeRealm(): void {
    if (!this.realm.isClosed) {
      this.realm.close();
    }
  }
}

export default DatabaseService.getInstance();
