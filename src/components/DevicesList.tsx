import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MyText } from "./MyText";

import { Device } from "../types";

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
  return (
    <View style={{ borderWidth: 1, borderColor: "black", height: "90%" }}>
      {devices.map((device) => (
        <TouchableOpacity
          key={device.id}
          onPress={() => onDeviceSelect && onDeviceSelect(device)}
          style={[
            styles.deviceItem,
            selectedDevice?.id === device.id ? styles.selectedDevice : null,
          ]}
        >
          <MyText style={{ fontSize: 16 }}>{device.name}</MyText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  deviceItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 10,
  },
  selectedDevice: {
    backgroundColor: "#e0e0e0",
  },
});

export default DevicesList;
