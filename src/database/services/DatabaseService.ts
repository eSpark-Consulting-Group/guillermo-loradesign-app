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
        let existingDevice = this.realm.objectForPrimaryKey("Device", device.id);
  
        if (existingDevice) {
          existingDevice.name = device.name;
          device.deviceInfo.forEach((info) => {
            let existingInfo = this.realm.objectForPrimaryKey("DeviceInfo", info.ids[0]);
            if (existingInfo) {
              existingInfo.latitude = info.latitude;
              existingInfo.longitude = info.longitude;
              existingInfo.timestamp = info.timestamp;
              existingInfo.id = info.ids[0];
              existingInfo.ids=info.ids
            } else {
              this.realm.create("DeviceInfo", info);
            }
          });
  
          existingDevice.deviceInfo = device.deviceInfo.map((info) =>
            this.realm.objectForPrimaryKey("DeviceInfo", info.ids[0])
          );
        } else {
          this.realm.create("Device", {
            id: device.id,
            name: device.name,
            deviceInfo: device.deviceInfo.map((info) => ({
              id: info.ids[0],
              latitude: info.latitude,
              longitude: info.longitude,
              timestamp: info.timestamp,
              ids:info.ids
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
    const results = this.realm.objects<DeviceSchema>("Device");
    return results.map((device) => ({
      id: device.id,
      name: device.name,
      deviceInfo: device.deviceInfo.map((info) => ({
        id: info.id,
        latitude: info.latitude,
        longitude: info.longitude,
        timestamp: info.timestamp,
        ids: info.ids, 
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
