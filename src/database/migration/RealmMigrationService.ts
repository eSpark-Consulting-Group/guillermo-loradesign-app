import Realm from "realm";
import { DeviceSchema } from "../models/schemas";

class RealmMigrationService {
  static handleMigration = (oldRealm: Realm, newRealm: Realm) => {
    if (oldRealm.schemaVersion < 1) {
      const oldDevices = oldRealm.objects<DeviceSchema>(
        "Device"
      ) as Realm.Results<DeviceSchema>;
      const newDevices = newRealm.objects<DeviceSchema>(
        "Device"
      ) as Realm.Results<DeviceSchema>;

      for (let i = 0; i < oldDevices.length; i++) {
        (newDevices[i] as any).name = (oldDevices[i] as any).name.toUpperCase();
      }
    }
  };
}

export default RealmMigrationService;
