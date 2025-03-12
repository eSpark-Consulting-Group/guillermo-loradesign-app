import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

import DevicesList from "../components/DevicesList";
import { MyText } from "../components/MyText";
import MyButton from "../components/MyButton";
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
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          height: "92%",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <View>
          <MyText style={styles.screenName}>Select BaseStation</MyText>
          <DevicesList
            devices={deviceList}
            selectedDevice={deviceSelected}
            onDeviceSelect={handleDeviceSelect}
          />
        </View>
        <MyButton
          onClick={() => {
            if (deviceSelected) {
              navigation.navigate("BottomTabs", {
                device: deviceSelected,
              });
            }
          }}
          style={{ width: "100%" }}
        >
          Select
        </MyButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  screenName: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 15,
  },
});

export default BaseStationSelection;
