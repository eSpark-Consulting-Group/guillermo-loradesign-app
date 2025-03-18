import { DeviceInfo } from '@/src/types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import RNFS from "react-native-fs";

export const downloadDeviceInfoCSV = async (deviceInfo:DeviceInfo[]) => {
  if (!deviceInfo || deviceInfo.length === 0) return;
  
    const csvHeaders = ['Device ID', 'GNSS Location (Latitude, Longitude)', 'Date'];
    const currentDate = new Date().toISOString();
    const csvRows = deviceInfo.map((row) => [
      row.id,
      `${row.latitude}, ${row.longitude}`,
      currentDate,
    ]);
    const csvContent = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');

  const fileName = "device_info.csv";
  const downloadPath =
    Platform.OS === "android"
      ? `${RNFS.DownloadDirectoryPath}/${fileName}` 
      : `${RNFS.DocumentDirectoryPath}/${fileName}`;

  try {
    if (Platform.OS === "android" && Platform.Version < 29) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.error("Storage permission denied");
        return;
      }
    }

    await RNFS.writeFile(downloadPath, csvContent, "utf8");
    console.log("CSV saved to:", downloadPath);
  } catch (error) {
    console.error("Error saving CSV file:", error);
  }
};

// export const downloadDeviceInfoCSV = async (deviceInfo: DeviceInfo[]) => {
//   try {
//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission || !deviceInfo?.length) return;

//     const csvHeaders = ['Device ID', 'GNSS Location (Latitude, Longitude)', 'Date'];
//     const currentDate = new Date().toISOString();
//     const csvRows = deviceInfo.map((row) => [
//       row.id,
//       `${row.latitude}, ${row.longitude}`,
//       currentDate,
//     ]);

//     const csvData = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');

//     const fileName = `device_info_${Date.now()}.csv`;
//     let fileUri = `${FileSystem.cacheDirectory}${fileName}`; // Default location for older Android versions

//     if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
//       // API 33+ (Android 13+)
//       const permissions = await MediaLibrary.requestPermissionsAsync();
//       if (permissions.status !== 'granted') {
//         Alert.alert("Permission Denied", "Cannot save CSV without storage permission.");
//         return;
//       }

//       const dirUri = await FileSystem.StorageAccessFramework.getUriForDirectoryAsync("downloads");
//       if (!dirUri) {
//         Alert.alert("Error", "Could not get Downloads directory access.");
//         return;
//       }

//       const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(dirUri, fileName, "text/csv");
//       await FileSystem.writeAsStringAsync(newFileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });
//       fileUri = newFileUri; // Set final path
//     } else {
//       // API < 33
//       await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });
//       const asset = await MediaLibrary.createAssetAsync(fileUri);
//       await MediaLibrary.createAlbumAsync("Download", asset, false);
//     }

//     Alert.alert("Success", `CSV saved to: ${fileUri}`);

//     // Allow sharing
//     const canShare = await Sharing.isAvailableAsync();
//     if (canShare) {
//       await Sharing.shareAsync(fileUri);
//     }

//     return fileUri;
//   } catch (error) {
//     console.error("Error generating CSV:", error);
//     Alert.alert("Error", "Failed to generate CSV file.");
//     throw error;
//   }
// };

// export const requestStoragePermission = async (): Promise<boolean> => {
//   if (Platform.OS === 'android') {
//     if (Number(Platform.Version) < 33) {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           Alert.alert("Permission Denied", "Cannot save CSV without storage permission.");
//           return false;
//         }
//       } catch (error) {
//         console.error("Error requesting storage permission:", error);
//         return false;
//       }
//     } else {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert("Permission Denied", "Cannot save CSV without storage permission.");
//         return false;
//       }
//     }
//   }
//   return true;
// };