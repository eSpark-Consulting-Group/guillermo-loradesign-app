import React from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { MyText } from "./MyText";
import { Device } from "../types";
import { RadioButton } from "react-native-paper";
import { primaryColor } from "../constants/Colors";

interface DevicesListProps {
  devices: Device[];
  selectedDevice?: Device;
  onDeviceSelect?: (device: Device) => void;
}

const DevicesList: React.FC<DevicesListProps> = ({
  devices,
  selectedDevice,
  onDeviceSelect,
}) => {
  const renderItem = ({ item: device }: { item: Device }) => (
    <TouchableOpacity
      key={device.id}
      onPress={() => onDeviceSelect && onDeviceSelect(device)}
      style={[
        styles.deviceItem,
        selectedDevice?.id === device.id && styles.selectedDevice,
      ]}
    >
      <View style={styles.textContainer}>
        <MyText style={styles.deviceName}>{device.name}</MyText>
        <MyText style={styles.deviceDescription}>
          Base station for connectivity and monitoring.
        </MyText>
      </View>
      <RadioButton
        value={device.id.toString()}
        status={selectedDevice?.id === device.id ? "checked" : "unchecked"}
        onPress={() => onDeviceSelect && onDeviceSelect(device)}
        color="#136FA9"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {devices.map((device) => (
        <TouchableOpacity
          key={device.id}
          onPress={() => onDeviceSelect && onDeviceSelect(device)}
          style={[
            styles.deviceItem,
            selectedDevice?.id === device.id && styles.selectedDevice,
          ]}
        >
          <View style={styles.textContainer}>
            <MyText style={styles.deviceName}>{device.name}</MyText>
            <MyText style={styles.deviceDescription}>
              Base station for connectivity and monitoring.
            </MyText>
          </View>
          <RadioButton
            value={device.id.toString()}
            status={selectedDevice?.id === device.id ? "checked" : "unchecked"}
            onPress={() => onDeviceSelect && onDeviceSelect(device)}
            color="#2575fc"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedDevice: {
    borderColor: primaryColor,
    backgroundColor: "#eef4ff",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  deviceDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default DevicesList;
