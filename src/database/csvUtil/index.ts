import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const downloadDeviceInfoCSV = async (database: any) => {
  try {
    const rows = await database.getAllAsync(`
      SELECT device_info.id, device_info.device_id, device_info.latitude, 
             device_info.longitude, device_info.title, device_info.details
      FROM device_info
    `);

    if (rows.length === 0) {
      console.log("No device info found.");
      return '';
    }

    const csvHeaders = ['Device Info ID', 'Device ID', 'Latitude', 'Longitude', 'Title', 'Details'];
    const csvRows = rows.map((row: any) => {
      return [
        row.id,
        row.device_id,
        row.latitude,
        row.longitude,
        row.title,
        JSON.parse(row.details).join(', ') 
      ];
    });

    const csvData = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');

    // Save the CSV file to the app's sandboxed directory
    const fileUri = FileSystem.documentDirectory + 'device_info.csv';
    await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });

    console.log(`CSV file saved to: ${fileUri}`);

    // Share the file so the user can open it with other apps (e.g., file manager, email)
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri);
    } else {
      console.log('Sharing is not available on this device');
    }

    return fileUri;
  } catch (error) {
    console.error("Error generating CSV:", error);
    throw error;
  }
};
