import { useState, useEffect, useRef } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { Buffer } from "buffer";
import { Platform, PermissionsAndroid } from "react-native";

const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const TX_CHARACTERISTIC_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

export interface GeoData {
  ids: number[];
  timestamp: { hour: number; minute: number; second: number };
  latitude: number;
  longitude: number;
}

export const useBLE = () => {
  const bleManager = useRef(new BleManager()).current;
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<Device[]>([]);

  useEffect(() => {
    return () => {
      bleManager.destroy();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  const startScan = async () => {
    await requestPermissions();
    setIsScanning(true);
    setScannedDevices([]); // Clear previous scan results
    console.log("Scanning...");

    const foundDevices = new Map(); // Track unique devices

    bleManager.startDeviceScan([UART_SERVICE_UUID], null, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        setIsScanning(false);
        return;
      }

      // Ensure the device has a name and advertises the UART service
      if (device?.id && device?.name && !foundDevices.has(device.id)) {
        foundDevices.set(device.id, device);
        setScannedDevices(Array.from(foundDevices.values())); // Convert Map to array
        console.log("Found UART device:", device.name, device.id);
      }
    });

    setTimeout(() => {
      stopScan();
    }, 50000); // Stop scanning after 7s
  };

  const stopScan = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  };

  const connectToDevice = async (device: Device) => {
    try {
      const connected = await device.connect();
      const mtu = await device.requestMTU(64);
      console.log("MTU set to:", mtu);
      const discovered =
        await connected.discoverAllServicesAndCharacteristics();

      setConnectedDevice(discovered);
      setIsConnected(true);
      console.log("Connected to:", device.name);

      enableNotifications(discovered);
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
    }
  };

  const enableNotifications = async (device: Device) => {
    try {
      const characteristic = await device.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        TX_CHARACTERISTIC_UUID,
        (error, char) => {
          if (error) {
            console.error("Notification error:", error);
            return;
          }

          if (char?.value) {
            const parsedData = parseGeolocationData(char.value);
            setGeoData(parsedData);
            console.log("Parsed Data:", parsedData);
          }
        }
      );

      console.log("Notifications enabled on TX Characteristic");
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    }
  };

  const parseGeolocationData = (base64Data: string): GeoData | null => {
    try {
      const buffer = Buffer.from(base64Data, "base64");
      //   console.log("Base64 Data:", base64Data);
      //   console.log("Decoded Buffer Length:", buffer.length);
      //   console.log("Decoded Buffer:", buffer.toString("hex"));

      if (buffer.length < 32) {
        console.error(
          `Invalid data length: Expected 32, but got ${buffer.length}`
        );
        return null;
      }

      return {
        ids: [
          buffer.readUInt32LE(0x00),
          buffer.readUInt32LE(0x04),
          buffer.readUInt32LE(0x08),
        ],
        timestamp: {
          hour: buffer.readUInt8(0x0c),
          minute: buffer.readUInt8(0x0d),
          second: buffer.readUInt8(0x0e),
        },
        latitude: buffer.readDoubleLE(0x10),
        longitude: buffer.readDoubleLE(0x18),
      };
    } catch (error) {
      console.error("Error parsing geolocation data:", error);
      return null;
    }
  };

  const disconnect = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
      setIsConnected(false);
      console.log("Disconnected from device");
    }
  };

  return {
    isScanning,
    isConnected,
    geoData,
    scannedDevices,
    startScan,
    connectToDevice,
    disconnect,
  };
};
