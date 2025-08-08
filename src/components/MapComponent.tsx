import React, { useEffect, useRef } from "react";
import { View, StyleSheet, InteractionManager } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { GeoData } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export interface MapComponentProps {
  geoData: GeoData[];
  onMarkerPress: (geoData: GeoData) => void;
}

const MapComponent = ({ geoData, onMarkerPress }: MapComponentProps) => {
  const mapRef = useRef<MapView>(null);

  const selectedDevice = useSelector(
    (state: RootState) => state.device.selectedDevice
  );

  const getInitialRegion = (): Region | undefined => {
    if (geoData.length === 0) return undefined;

    const latitudes = geoData.map((loc) => loc.latitude);
    const longitudes = geoData.map((loc) => loc.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 1.5,
      longitudeDelta: (maxLng - minLng) * 1.5,
    };
  };

  useEffect(() => {
    if (!mapRef.current || geoData.length === 0) return;
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        if (geoData.length === 1) {
          mapRef?.current?.animateToRegion({
            latitude: geoData[0].latitude,
            longitude: geoData[0].longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        } else {
          mapRef?.current?.fitToCoordinates(
            geoData.map((device) => ({
              latitude: device.latitude,
              longitude: device.longitude,
            })),
            {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            }
          );
        }
      });
    }, 100);
  }, [geoData]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={getInitialRegion()}
        moveOnMarkerPress={true}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {selectedDevice?.geoData &&
          selectedDevice?.geoData.map((device, index) => (
            <Marker
              key={`${device?.latitude}-${device?.longitude}-${index}`}
              coordinate={{
                latitude: device.latitude,
                longitude: device.longitude,
              }}
              onPress={() => onMarkerPress(selectedDevice!.geoData![index])}
            />
          ))}
      </MapView>
    </View>
  );
};

export default MapComponent;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
