import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import DevicesList from "../components/DevicesList";
import { MyText } from "../components/MyText";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";

import { Device } from "react-native-ble-plx";
import { primaryColor, secondaryColor } from "../constants/Colors";
import DatabaseService from "../database/services/DatabaseService";
import { useBLE } from "../hooks/useBLE";
import { selectDevice } from "../features/device/deviceSlice";

type BaseStationSelectionProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "BaseStationSelection"
>;

const BaseStationSelection = () => {
  const navigation = useNavigation<BaseStationSelectionProps["navigation"]>();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    startScan,
    scannedDevices,
    isScanning,
    connectToDevice,
    connectedDevice,
    deviceData,
  } = useBLE();

  useEffect(() => {
    const devices = DatabaseService.getAllDevices();
    if (devices.length > 0) {
      console.log("Stored Devices:", JSON.stringify(devices));
    }
  }, []);

  const initializeScan = async () => {
    await startScan(); // Auto start scanning when component mounts
  };

  useEffect(() => {
    initializeScan();
  }, []);

  const handleDeviceSelect = async (device: Device) => {
    await connectToDevice(device);
  };

  useEffect(() => {
    console.log("isScanning:", isScanning);
  }, [isScanning]);

  useEffect(() => {
    if (connectedDevice && deviceData) {
      dispatch(selectDevice(deviceData));
      navigation.navigate("BottomTabs", {
        device: deviceData,
      });
    }
  }, [connectedDevice, deviceData]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={initializeScan}
        style={[styles.scanButtonWrapper, isScanning && styles.buttonDisabled]}
        disabled={isScanning}
      >
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          style={styles.scanButton}
        >
          <MyText style={styles.scanButtonText}>
            {isScanning ? "Scanning..." : "Scan"}
          </MyText>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ flex: 1, marginBottom: 20 }}>
        <DevicesList
          devices={scannedDevices}
          selectedDevice={selectedDevice}
          onDeviceSelect={setSelectedDevice}
        />
      </View>

      <TouchableOpacity
        disabled={!selectedDevice || loading}
        onPress={() => selectedDevice && handleDeviceSelect(selectedDevice)}
        style={[
          styles.buttonWrapper,
          !selectedDevice ? styles.buttonDisabled : {},
        ]}
      >
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          style={styles.selectButton}
        >
          <MyText style={styles.buttonText}>
            {loading ? "Connecting..." : "Select"}
          </MyText>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    backgroundColor: "#ffffff",
  },
  scanButtonWrapper: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  scanButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  selectButton: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default BaseStationSelection;
