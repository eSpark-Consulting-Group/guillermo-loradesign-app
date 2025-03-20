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

import { Device } from "../types";
import { deviceList } from "../constants";
import { primaryColor, secondaryColor } from "../constants/Colors";
import { selectDevice } from "../features/device/deviceSlice";
import DatabaseService from "../database/services/DatabaseService";

type BaseStationSelectionProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "BaseStationSelection"
>;

const BaseStationSelection = () => {
  const navigation = useNavigation<BaseStationSelectionProps["navigation"]>();
  const [selectedDevice, setDeviceSelected] = useState<Device>();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const devices = DatabaseService.getAllDevices();
    if (devices.length > 0) {
      console.log("Stored Devices:", JSON.stringify(devices));
    }
  }, [dispatch]);

  const handleDeviceSelect = async (device: Device) => {
    dispatch(selectDevice(device));
    DatabaseService.saveDevice(device);
    navigation.navigate("BottomTabs", {
      device: device,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, marginTop: -20, marginBottom: 20 }}>
        <DevicesList
          devices={deviceList}
          selectedDevice={selectedDevice}
          onDeviceSelect={setDeviceSelected}
        />
      </View>

      <TouchableOpacity
        disabled={!selectedDevice}
        onPress={() => {
          if (selectedDevice) {
            handleDeviceSelect(selectedDevice);
          }
        }}
        style={[
          styles.buttonWrapper,
          !selectedDevice ? styles.buttonDisabled : {},
        ]}
      >
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          style={styles.selectButton}
        >
          <MyText style={styles.buttonText}>Select</MyText>
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
