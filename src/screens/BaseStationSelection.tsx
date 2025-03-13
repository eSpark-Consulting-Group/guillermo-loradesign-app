import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

import DevicesList from "../components/DevicesList";
import { MyText } from "../components/MyText";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";

import { Device } from "../types";
import { deviceList } from "../constants";

type BaseStationSelectionProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "BaseStationSelection"
>;

const BaseStationSelection = () => {
  const navigation = useNavigation<BaseStationSelectionProps["navigation"]>();
  const [deviceSelected, setDeviceSelected] = useState<Device>();

  const handleDeviceSelect = (device: Device) => {
    setDeviceSelected(device);
  };

  return (
    <LinearGradient
    colors={["#ffffff", "#ffffff", "#ffffff"]} 
    style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <DevicesList
            devices={deviceList}
            selectedDevice={deviceSelected}
            onDeviceSelect={handleDeviceSelect}
          />
        </View>

        <TouchableOpacity
          disabled={!deviceSelected}
          onPress={() => {
            if (deviceSelected) {
              navigation.navigate("BottomTabs", {
                device: deviceSelected,
              });
            }
          }}
          style={[
            styles.buttonWrapper,
            !deviceSelected ? styles.buttonDisabled : {},
          ]}
        >
          <LinearGradient
            colors={["#3EADCF", "#2B879E"]}
            style={styles.selectButton}
          >
            <MyText style={styles.buttonText}>Select</MyText>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  content: {
    marginTop: 10,
  },
  screenName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  header: {
    marginTop: 40,
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    color: "#B0BEC5",
    marginTop: 5,
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
    opacity: 0.6,
  },
});

export default BaseStationSelection;