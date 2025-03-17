import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import TableComponent from "../components/TableComponent";
import { deviceList } from "../constants";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { primaryColor } from "../constants/Colors";

type TableDetailsProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "Map"
>;

const TableDetails = () => {
  const navigation = useNavigation<TableDetailsProps["navigation"]>();

  const exportCSV = async () => {
    //temporary logic
    // try {
    //   // Create CSV content with headers
    //   let csvContent =
    //     "Device ID,GNSS Location (Latitude,Longitude),Altitude,Date\n";
    //   // Get current date
    //   const currentDate = new Date().toISOString();
    //   // Loop through device list
    //   deviceList.forEach((device) => {
    //     device.deviceInfo.forEach((info) => {
    //       csvContent += `${device.id},${info.latitude},${info.longitude},${
    //         info.altitude || "N/A"
    //       },${currentDate}\n`;
    //     });
    //   });
    //   // Define file path
    //   const fileUri = FileSystem.documentDirectory + "device_data.csv";
    //   // Write CSV file
    //   await FileSystem.writeAsStringAsync(fileUri, csvContent, {
    //     encoding: FileSystem.EncodingType.UTF8,
    //   });
    //   // Share file (Optional)
    //   if (await Sharing.isAvailableAsync()) {
    //     await Sharing.shareAsync(fileUri);
    //   } else {
    //     console.log("Error", "Sharing is not available on this device.");
    //   }
    //   console.log("CSV exported:", fileUri);
    // } catch (error) {
    //   console.error("Error exporting CSV:", error);
    // }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={exportCSV}>
          <FontAwesome
            name="download"
            size={24}
            color={primaryColor}
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TableComponent data={deviceList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
});

export default TableDetails;
