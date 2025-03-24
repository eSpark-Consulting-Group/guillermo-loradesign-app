import { GeoData,BleDevice } from "@/src/types";
import { formatDate } from "@/src/utils/DateFormat";
import { showToast } from "@/src/utils/showToast";
import { Platform, PermissionsAndroid } from "react-native";
import RNFS from "react-native-fs";

export const downloadDeviceInfoCSV = async (selectedDevice: BleDevice | null, geoData: GeoData[]) => {
  if (!selectedDevice || !geoData || geoData.length === 0) return;

  const csvHeaders = ["Device ID", "GNSS Location (Latitude/Longitude)", "Date"];
  const csvRows = geoData.map((row) => [
    selectedDevice.id.trim(),
    `${row.latitude}/${row.longitude}`,
    formatDate(row.timestamp).trim(),
  ]);

  const csvContent = [csvHeaders, ...csvRows]
    .map((row) => row.map(value => `"${value.replace(/"/g, '""').trim()}"`).join(","))
    .join("\n");
  console.log("csvContent "+JSON.stringify(csvContent))
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const fileName = `device_data_${randomNum}.csv`;
  let downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  if (Platform.OS === "android") {
    if (Platform.Version >= 29) {
      downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        showToast("Storage permission is required to save the file.", "error");
        return;
      }

      downloadPath = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;
    }
  }

  try {
    await RNFS.writeFile(downloadPath, csvContent.trim(), "utf8"); // Trim final string to remove any extra new lines
    console.log("CSV saved to:", downloadPath);
  } catch (error) {
    console.error("Error saving CSV file:", error);
  }
};
