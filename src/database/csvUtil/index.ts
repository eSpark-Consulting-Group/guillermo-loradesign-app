import { DeviceInfo } from "@/src/types";
import { Platform, PermissionsAndroid, Alert } from "react-native";
import RNFS from "react-native-fs";

export const downloadDeviceInfoCSV = async (deviceInfo: DeviceInfo[]) => {
  if (!deviceInfo || deviceInfo.length === 0) return;

  const csvHeaders = ["Device ID", "GNSS Location (Latitude, Longitude)", "Date"];
  const currentDate = new Date().toISOString();
  const csvRows = deviceInfo.map((row) => [
    row.id,
    `${row.latitude}, ${row.longitude}`,
    currentDate,
  ]);
  const csvContent = [csvHeaders, ...csvRows].map((row) => row.join(",")).join("\n");

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const fileName = `device_info_${randomNum}.csv`;
  let downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  if (Platform.OS === "android") {
    if (Platform.Version >= 29) {
      downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Denied", "Storage permission is required to save the file.");
        return;
      }

      downloadPath = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
    }
  }

  try {
    await RNFS.writeFile(downloadPath, csvContent, "utf8");
    console.log("CSV saved to:", downloadPath);
  } catch (error) {
    console.error("Error saving CSV file:", error);
  }
};