import { Device, DeviceInfo } from "@/src/types";
import { getDatabase } from "..";
import { downloadDeviceInfoCSV } from "../csvUtil";

class DatabaseService {
    async saveDevice(device: Device) {
        try {
          const database = await getDatabase();
          let deviceId = device.id;
          const existingDevice = await database.getFirstAsync<Device>(
            'SELECT * FROM devices WHERE id = ?',
            [deviceId]
          );
    
          if (existingDevice) {
            await database.runAsync(
              'UPDATE devices SET name = ? WHERE id = ?',
              [device.name, deviceId]
            );
            console.log("Device updated successfully");
          } else {
            await database.runAsync(
              'INSERT INTO devices (id, name) VALUES (?, ?)',  // Insert with device.id
              [deviceId, device.name]
            );
            console.log("Device added successfully");
          }
    
          await database.execAsync('BEGIN TRANSACTION;');
    
          try {
            await database.runAsync(
              'DELETE FROM device_info WHERE device_id = ?',
              [deviceId]
            );
    
            for (const info of device.deviceInfo) {
              const existingDeviceInfo = await database.getFirstAsync(
                'SELECT * FROM device_info WHERE id = ?',
                [info.id]
              );
    
              if (existingDeviceInfo) {
                await database.runAsync(
                  'UPDATE device_info SET device_id = ?, latitude = ?, longitude = ?, title = ?, details = ? WHERE id = ?',
                  [deviceId, info.latitude, info.longitude, info.title, JSON.stringify(info.details), info.id]
                );
                console.log(`Device info with id ${info.id} updated successfully`);
              } else {
                await database.runAsync(
                  'INSERT INTO device_info (device_id, latitude, longitude, title, details) VALUES (?, ?, ?, ?, ?)',
                  [deviceId, info.latitude, info.longitude, info.title, JSON.stringify(info.details)]
                );
                console.log(`Device info with id ${info.id} added successfully`);
              }
            }
    
            await database.execAsync('COMMIT;');
            console.log("Device info saved successfully");
          } catch (error) {
            await database.execAsync('ROLLBACK;');
            console.error("Transaction failed, rolled back:", error);
            throw error;
          }
    
          return deviceId; // Return the device ID
        } catch (error) {
          console.error("Error saving device:", error);
          throw error;
        }
      }
  async getAllDevices(): Promise<any[]> {
    try {
      const database = await getDatabase();
      const rows = await database.getAllAsync(`
        SELECT devices.id, devices.name, device_info.id AS device_info_id, device_info.latitude, 
               device_info.longitude, device_info.title, device_info.details
        FROM devices
        LEFT JOIN device_info ON devices.id = device_info.device_id
      `);

      const devicesMap = new Map<number, Device>();

      rows.forEach((row: any) => {
        const { id, name, device_info_id, latitude, longitude, title, details } = row;
        let device = devicesMap.get(id);

        if (!device) {
          device = {
            id,
            name,
            deviceInfo: []
          };
          devicesMap.set(id, device);
        }

        device.deviceInfo.push({
          id: device_info_id,
          latitude,
          longitude,
          title,
          details: JSON.parse(details)
        });
      });

      return Array.from(devicesMap.values());
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  }

  async getAllDevicesList(): Promise<Device[]> {
    return this.getAllDevices();
  }

  async downloadDeviceInfoCSVFile() {
    try {
      const database = await getDatabase();
      const path = await downloadDeviceInfoCSV(database);
      console.log("CSV file saved to:", path);
      return path;
    } catch (error) {
      console.error("Failed to download CSV:", error);
      throw error;
    }
  }
}

export default new DatabaseService();