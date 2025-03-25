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
  const [selectedDetails, setSelectedDetails] = useState<GeoData>();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const route = useRoute<MapViewProps["route"]>();
  const { device } = route.params;
  const selectedDevice = useSelector(
    (state: RootState) => state.device.selectedDevice
  );

  useEffect(() => {
    console.log("selectedDevice", JSON.stringify(selectedDevice));
  }, []);
  const handleMarkerPress = (geoData: GeoData) => {
      setSelectedDetails(geoData);
      setBottomSheetVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapComponent
      geoData={device?.geoData.length === 1 ? device.geoData : selectedDevice?.geoData ?? []}
       onMarkerPress={handleMarkerPress}
      />
      <BottomSheetComponent
        visible={isBottomSheetVisible}
        geoData={selectedDetails||null}
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
