import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE,Region } from "react-native-maps";
import { DeviceInfo } from "../types";

export interface MapComponentProps {
  deviceInfo: DeviceInfo[];
  onMarkerPress: (deviceInfo: DeviceInfo) => void;
}

const MapComponent = ({ deviceInfo, onMarkerPress }: MapComponentProps) => {
    const mapRef = useRef<MapView>(null);
  
    const getInitialRegion = (): Region | undefined => {
      if (deviceInfo.length === 0) return undefined;
  
      const latitudes = deviceInfo.map((loc) => loc.latitude);
      const longitudes = deviceInfo.map((loc) => loc.longitude);
  
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
        console.log("Device Info:", JSON.stringify(deviceInfo));
      if (mapRef.current && deviceInfo.length > 0) {
        mapRef.current.fitToCoordinates(
            deviceInfo.map((deviceInfo) => ({
            latitude: deviceInfo.latitude,
            longitude: deviceInfo.longitude,
          })),
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          }
        );
      }
    }, [deviceInfo]);
  
    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={getInitialRegion()}
          zoomEnabled={false}
          zoomControlEnabled={false}
          moveOnMarkerPress={false}
        >
          {deviceInfo.map((deviceInfo) => (
            <Marker
              key={deviceInfo.id}
              coordinate={{ latitude: deviceInfo.latitude, longitude: deviceInfo.longitude }}
              title={deviceInfo.title}
              onPress={() => onMarkerPress(deviceInfo)}
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