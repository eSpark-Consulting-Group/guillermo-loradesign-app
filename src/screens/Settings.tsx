import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  UIManager,
  Platform,
  Alert,
} from "react-native";
import { MyText } from "../components/MyText";
import { Feather } from "@expo/vector-icons";
import { primaryColor } from "../constants/Colors";
import DatabaseService from "../database/services/DatabaseService";
import { settingsOptions } from "../constants";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { downloadDeviceInfoCSV } from "../database/csvUtil";

// Enable smooth Layout Animation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const Settings = () => {
  const selectedDevice = useSelector((state: RootState) => state.device.selectedDevice);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadDeviceInfoCSV(selectedDevice?.deviceInfo ?? []);
      Alert.alert("Download Complete", "The CSV file has been saved successfully.");
    } catch (error) {
      console.error("Error downloading CSV:", error);
      Alert.alert("Download Failed", "An error occurred while downloading the file.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {settingsOptions.map((option) => (
          <View key={option.id} style={styles.card}>
            <TouchableOpacity
              style={styles.option}
              activeOpacity={0.7}
              onPress={option.id === 1 ? handleDownload : option.onPress}
            >
              <View style={styles.optionContent}>
                <MyText style={styles.optionText}>{option.text}</MyText>
              </View>
              <View style={styles.rightSection}>
                {option.id === 1 && (
                  <Feather
                    name={option.icon as any}
                    size={22}
                    color={primaryColor}
                    style={styles.icon}
                  />
                )}
                {option.id === 2 && (
                  <View style={styles.statusContainer}>
                    <MyText style={styles.statusText}>Online</MyText>
                    <Feather
                      name="check-circle"
                      size={18}
                      color="#28A745"
                      style={styles.statusIcon}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {option.id === 3 && (
              <View style={styles.dropdown}>
                <MyText style={styles.regionText}>Calender View</MyText>
              </View>
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#28A745",
    marginRight: 5,
  },
  statusIcon: {
    marginLeft: 5,
  },
  dropdown: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  regionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  regionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});

export default Settings;