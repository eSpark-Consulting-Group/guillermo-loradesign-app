import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { GeoData } from "../types";
import { formatDate } from "../utils/DateFormat"; // Ensure this function is available

interface BottomSheetProps {
  visible: boolean;
  geoData: GeoData | null;
  onClose: () => void;
}

const BottomSheetComponent = ({
  visible,
  geoData,
  onClose,
}: BottomSheetProps) => {
  if (!visible || !geoData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} />

        <View style={styles.bottomSheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>Device Info</Text>

          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Device Id: {geoData.id}</Text>
            <Text style={styles.itemText}>Latitude: {geoData.latitude}</Text>
            <Text style={styles.itemText}>Longitude: {geoData.longitude}</Text>
            <Text style={styles.itemText}>Altitude: {geoData.altitude}</Text>
            <Text style={styles.itemText}>
              Timestamp: {formatDate(geoData.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    alignSelf: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 16,
  },
});

export default BottomSheetComponent;
