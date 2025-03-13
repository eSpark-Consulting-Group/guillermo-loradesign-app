import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

interface BottomSheetProps {
  visible: boolean;
  details: string[];
  onClose: () => void;
}

const BottomSheetComponent = ({
  visible,
  details,
  onClose,
}: BottomSheetProps) => {
  const [localDetails, setLocalDetails] = useState<string[]>([]);

  useEffect(() => {
    if (details && details.length > 0) {
      console.log("Setting local details:", JSON.stringify(details));
      setLocalDetails([...details]);
    }
  }, [details]);

  if (!visible) return null;

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>• {item}</Text>
    </View>
  );

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

          {localDetails.length > 0 ? (
            <FlatList
              data={localDetails}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
            <Text style={styles.noData}>No details available</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  flatList: {
    maxHeight: 300,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 16,
  },
  noData: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
});

export default BottomSheetComponent;
