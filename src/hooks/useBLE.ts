import { useState, useEffect, useRef } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { Buffer } from "buffer";
import { Platform, PermissionsAndroid } from "react-native";
import { GeoData, BleDevice } from "../types";
import { useDispatch, useSelector } from "react-redux";
import DatabaseService from "../database/services/DatabaseService";
import { RootState } from "../store";
import { selectDevice } from "../features/device/deviceSlice";

const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const TX_CHARACTERISTIC_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

export const useBLE = () => {
  const bleManager = useRef(new BleManager()).current;
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<Device[]>([]);
  const [deviceData, setDeviceData] = useState<BleDevice | null>(null);
  const dispatch = useDispatch();
  const selectedDevice = useSelector(
    (state: RootState) => state.device.selectedDevice
  );

  useEffect(() => {
    if (deviceData) {
      dispatch(selectDevice(deviceData));
      console.log("saving redux")
    }
  }, [deviceData, dispatch]);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  //scans for available devices
  const startScan = async () => {
    await requestPermissions();
    setIsScanning(true);
    setScannedDevices([]); // Clear previous scan results
    console.log("Scanning...");

    const foundDevices = new Map(); // Track unique devices

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        setIsScanning(false);
        return;
      }
      // console.log(device?.name, device?.id, device?.serviceUUIDs);

      // Ensure the device has a name and advertises the UART service
      if ((device?.id, device?.name)) {
        console.log("UART device:", device.name, device.id);
        foundDevices.set(device.id, device);
        setScannedDevices(Array.from(foundDevices.values())); // Convert Map to array
        console.log("Found UART device:", device.name, device.id);
      }
    });

    setTimeout(() => {
      stopScan();
    }, 7000); // Stop scanning after 7s
  };

  const stopScan = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  };
  //tries to connect to a BLE
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

  //enables receiving updates from the BLE through notification meth
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
            setDeviceData((prev) => {
              if (!parsedData) {
                return prev;
              }
              const updatedGeoData = prev?.geoData?.map((info) => {
                if (info.ids[0] === parsedData?.ids[0]) {
                  return { ...info, ...parsedData }; 
                }
                return info;
              }) || [];
            
              const exists = updatedGeoData.some(
                (info) => JSON.stringify(info) === JSON.stringify(parsedData)
              );
            
              if (!exists) {
                updatedGeoData.push(parsedData);
              }
            
              const updatedDeviceData: BleDevice = {
                id: prev?.id ?? device.id,
                name: prev?.name ?? device.name ?? "",
                geoData: updatedGeoData,
              };
              DatabaseService.saveDevice(updatedDeviceData);
              return updatedDeviceData;
            });
            console.log("Parsed Data:", parsedData);
          }
        }
      );

      console.log("Notifications enabled on TX Characteristic");
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    }
  };

  //parses raw binary data
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

  // might be needed
  const disconnect = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
      setIsConnected(false);
      console.log("Disconnected from device");
    }
  };

  //tells whether the stored device is connected or not
  const connectionStatus = async () => {
    const status = bleManager.isDeviceConnected(selectedDevice?.id!);
    if ((await status) === true) {
      return true;
    } else {
      return false;
    }
  };

  //updated connection Status after 2s (tested and verified on status screen)
  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await connectionStatus();
      setIsConnected(status);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  //Reconnection logic upon pressing Bluetooth Status Button on settings screen(tested and verified)
  const reconnect = async () => {
    try {
      let device: Device | null = null;

      if (selectedDevice) {
        console.log(
          "Reconnecting to previously selected device:",
          selectedDevice.name
        );
        device = await bleManager.connectToDevice(selectedDevice.id);
      } else {
        console.warn("No device available for reconnection.");
        return;
      }
      if (!device) {
        console.error("Failed to reconnect: No valid device instance.");
        return;
      }

      const mtu = await device.requestMTU(64);
      const discovered = await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(discovered);
      setIsConnected(true);

      console.log("Reconnection successful!");

      // Ensure the device is set before enabling notifications!
      await enableNotifications(discovered);
    } catch (error) {
      console.error("Reconnection failed:", error);
      setIsConnected(false);
    }
  };

  return {
    startScan,
    isScanning,
    scannedDevices,
    connectToDevice,
    connectedDevice,
    deviceData,
    geoData,
    disconnect,
    connectionStatus,
    reconnect,
  };
};
