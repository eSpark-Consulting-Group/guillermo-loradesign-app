import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapComponent from "../components/MapComponent";
import { DeviceInfo } from "../components/MapComponent";
import BottomSheetComponent from "../components/BottomSheetComponent";

const deviceInfo: DeviceInfo[] = [
  {
    id: 1,
    latitude: 24.8934,
    longitude: 67.0281,
    title: "University of Karachi",
    details: [
      "One of the largest universities in Pakistan",
      "Known for its research and diverse academic programs",
      "Established in 1951",
    ],
  },
  {
    id: 2,
    latitude: 24.9208,
    longitude: 67.0971,
    title: "Jinnah International Airport",
    details: [
      "Busiest airport in Pakistan",
      "Named after Quaid-e-Azam Muhammad Ali Jinnah",
      "Serves both domestic and international flights",
    ],
  },
  {
    id: 3,
    latitude: 24.8975,
    longitude: 67.0745,
    title: "Mazar-e-Quaid",
    details: [
      "Mausoleum of Quaid-e-Azam Muhammad Ali Jinnah",
      "A significant historical and tourist site",
      "Completed in 1971",
    ],
  },
];

const MapView = () => {
  const [selectedDetails, setSelectedDetails] = useState<string[]>();
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleMarkerPress = (deviceInfo: DeviceInfo) => {
    setSelectedDetails(deviceInfo.details);
    setBottomSheetVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapComponent deviceInfo={deviceInfo} onMarkerPress={handleMarkerPress} />
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
