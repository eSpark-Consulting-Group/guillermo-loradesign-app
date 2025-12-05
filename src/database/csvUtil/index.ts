import { Platform, PermissionsAndroid, Share } from "react-native";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

import { GeoData, BleDevice } from "@/src/types";
import { formatDate } from "@/src/utils/DateFormat";
import { showToast } from "@/src/utils/showToast";

export const downloadDeviceInfoCSV = async (
  selectedDevice: BleDevice | null,
  geoData: GeoData[]
) => {
  if (!selectedDevice || !geoData || geoData.length === 0) return;

  const csvHeaders = [
    "Device ID",
    "GNSS Location (Latitude/Longitude/Altitude)",
    "Date",
  ];
  const csvRows = geoData.map((row) => [
    selectedDevice.id.trim(),
    `${row.latitude}/${row.longitude}/${row.altitude}`,
    formatDate(row.timestamp).trim(),
  ]);

  const csvContent = [csvHeaders, ...csvRows]
    .map((row) =>
      row.map((value) => `"${value.replace(/"/g, '""').trim()}"`).join(",")
    )
    .join("\n");
  console.log("csvContent " + JSON.stringify(csvContent));
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
    if (Platform.OS === "android") {
      await RNFS.writeFile(downloadPath, csvContent.trim(), "utf8"); // Trim final string to remove any extra new lines
      showToast("The CSV file has been saved successfully", "success");
      console.log("CSV saved to:", downloadPath);

      // Open the file after saving
      try {
        await FileViewer.open(downloadPath, {
          showOpenWithDialog: true,
        });
      } catch (error) {
        console.error("Error opening CSV file:", error);
        showToast("Could not open the CSV file", "error");
      }
    } else {
      await RNFS.writeFile(downloadPath, csvContent.trim(), "utf8");

      let options = {
        url: downloadPath,
        type: "text/csv",
      };
      const shared = await Share?.share(options);
      console.log("shared");
      if (shared.action == "sharedAction") {
        showToast("The CSV file has been saved successfully", "success");
        console.log("CSV saved in iOS");
      }
    }
  } catch (error) {
    console.error("Error saving CSV file:", error);
  }
};
