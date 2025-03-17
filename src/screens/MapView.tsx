import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapComponent from "../components/MapComponent";
import { DeviceInfo } from "../types";
import BottomSheetComponent from "../components/BottomSheetComponent";
import { useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";

type MapViewProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "Map"
>;

const MapView = () => {
  const [selectedDetails, setSelectedDetails] = useState<string[]>();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const route = useRoute<MapViewProps["route"]>();
  const { device } = route.params;

  const handleMarkerPress = (device: DeviceInfo) => {
    setSelectedDetails(device.details);
    setBottomSheetVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapComponent
        deviceInfo={device?.deviceInfo!}
        onMarkerPress={handleMarkerPress}
      />
      <BottomSheetComponent
        visible={isBottomSheetVisible}
        details={selectedDetails?.length ? selectedDetails : []}
        onClose={() => setBottomSheetVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  deviceName: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default MapView;
