import Realm from "realm";
import { DeviceSchema, DeviceInfoSchema } from "../models/schemas";
import RealmMigrationService from "../migration/RealmMigrationService";
import { Device } from "@/src/types";

class DatabaseService {
  private static instance: DatabaseService;
  private realm: Realm;

  private constructor() {
    this.realm = new Realm({
      schema: [DeviceSchema, DeviceInfoSchema],
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

  saveDevice(device: Device): void {
    try {
      this.realm.write(() => {
        let existingDevice = this.realm.objectForPrimaryKey("Device", device.id);
  
        if (existingDevice) {
          existingDevice.name = device.name;
          device.deviceInfo.forEach((info) => {
            let existingInfo = this.realm.objectForPrimaryKey("DeviceInfo", info.id);
            if (existingInfo) {
              existingInfo.latitude = info.latitude;
              existingInfo.longitude = info.longitude;
              existingInfo.title = info.title;
              existingInfo.details = info.details;
            } else {
              this.realm.create("DeviceInfo", info);
            }
          });
  
          existingDevice.deviceInfo = device.deviceInfo.map((info) =>
            this.realm.objectForPrimaryKey("DeviceInfo", info.id)
          );
        } else {
          this.realm.create("Device", {
            id: device.id,
            name: device.name,
            deviceInfo: device.deviceInfo.map((info) => ({
              id: info.id,
              latitude: info.latitude,
              longitude: info.longitude,
              title: info.title,
              details: info.details,
            })),
          });
        }
      });
      console.log("Device saved successfully!");
    } catch (error) {
      console.error("Error saving to Realm:", error);
    }
  }
  
  getAllDevices(): Device[] {
    const results = this.realm.objects<DeviceSchema>("Device");
    return results.map((device) => ({
      id: device.id,
      name: device.name,
      deviceInfo: device.deviceInfo.map((info) => ({
        id: info.id,
        latitude: info.latitude,
        longitude: info.longitude,
        title: info.title,
        details: info.details,
      })),
    }));
  }

  getDeviceById(id: number): Device | undefined {
    const device = this.realm.objectForPrimaryKey<DeviceSchema>("Device", id);
    return device
      ? {
          id: device.id,
          name: device.name,
          deviceInfo: device.deviceInfo.map((info) => ({
            id: info.id,
            latitude: info.latitude,
            longitude: info.longitude,
            title: info.title,
            details: info.details,
          })),
        }
      : undefined;
  }

  closeRealm(): void {
    if (!this.realm.isClosed) {
      this.realm.close();
    }
  }
}

export default DatabaseService.getInstance();
