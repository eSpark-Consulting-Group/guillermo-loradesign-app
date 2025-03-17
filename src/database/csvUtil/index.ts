import RNFS from 'react-native-fs';

export const downloadDeviceInfoCSV = async (database: any): Promise<string> => {
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
        JSON.parse(row.details).join(', ') // Assuming 'details' is a JSON array
      ];
    });

    const csvData = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');

    const path = RNFS.DocumentDirectoryPath + '/device_info.csv';
    await RNFS.writeFile(path, csvData, 'utf8');

    console.log(`CSV file saved to: ${path}`);
    return path;
  } catch (error) {
    console.error("Error generating CSV:", error);
    throw error;
  }
};
