import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapComponent from "../components/MapComponent";
import { GeoData } from "../types";
import BottomSheetComponent from "../components/BottomSheetComponent";
import { useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type MapViewProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "Map"
>;

const MapView = () => {
  const [selectedDetails, setSelectedDetails] = useState<string[]>();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const route = useRoute<MapViewProps["route"]>();
  const { fromCoordRedirect } = route.params;
  const selectedDevice = useSelector((state: RootState) => state.device.selectedDevice);
  const singleDevice = fromCoordRedirect ? selectedDevice?.deviceInfo?.[1] : null;

  useEffect(()=>{
    console.log("selectedDevice", JSON.stringify(selectedDevice))
  }
    ,[])
  const handleMarkerPress = (device: GeoData) => {
    if (!fromCoordRedirect) {
      // setSelectedDetails(device);
      setBottomSheetVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <MapComponent
      deviceInfo={fromCoordRedirect ? (singleDevice ? [singleDevice] : []) : selectedDevice?.deviceInfo ?? []}
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
