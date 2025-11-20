import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  UIManager,
  Platform,
} from "react-native";
import { MyText } from "../components/MyText";
import { Feather, AntDesign } from "@expo/vector-icons";
import { primaryColor } from "../constants/Colors";
import { settingsOptions } from "../constants";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { downloadDeviceInfoCSV } from "../database/csvUtil";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { BleDevice, GeoData } from "../types";
import { FlatList, Pressable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";
import { showToast } from "../utils/showToast";
import { formatDate } from "../utils/DateFormat";
import { useBLE } from "../hooks/useBLE";
import DatabaseService from "../database/services/DatabaseService";
import OverlayLoader from "../components/OverlayLoader";

// Enable smooth Layout Animation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList & BottomTabParamList,
  "Map"
>;

const Settings = () => {
  const selectedDevice = useSelector(
    (state: RootState) => state.device.selectedDevice
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [datePickerStep, setDatePickerStep] = useState(0);
  const { reconnect, connectionStatus } = useBLE();
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchConnectionStatus = async () => {
      const status = await connectionStatus();
      setIsOnline(status);
    };
    fetchConnectionStatus();
  }, [connectionStatus]);

  const [filteredData, setFilteredData] = useState<GeoData[]>([]);
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const devices = await DatabaseService.getAllDevices();
      const device = devices.find((device) => device.id === selectedDevice?.id);
      if (!device) {
        showToast("Device not found in the database", "error");
        return;
      }
      await downloadDeviceInfoCSV(device, device?.geoData!);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      showToast("An error occurred while downloading the file", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStartDateChange = (event: any, date: any) => {
    setShowStartPicker(false);
    if (!date) return;

    if (event.type === "dismissed") {
      return;
    }

    setStartDate(date);

    setTimeout(() => {
      setShowEndPicker(true);
      setDatePickerStep(2);
    }, 300);
  };

  const handleEndDateChange = (event: any, date: any) => {
    setShowEndPicker(false);
    if (!date) return;

    if (event.type === "dismissed") {
      return;
    }

    setEndDate(date);
    setDatePickerStep(0);

    filterDataByDateRange(startDate, date);
  };

  const filterDataByDateRange = (start: any, end: any) => {
    const startTime = new Date(start);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date(end);
    endTime.setHours(23, 59, 59, 999);

    const filtered = (selectedDevice?.geoData ?? []).filter((item) => {
      if (!item) return false;

      const currentTimestamp = new Date();
      const itemYear = currentTimestamp.getFullYear();
      const itemMonth = currentTimestamp.getMonth();
      const itemDay = currentTimestamp.getDate();

      const itemDate = new Date(itemYear, itemMonth, itemDay);

      return itemDate >= startTime && itemDate <= endTime;
    });

    setFilteredData(filtered);

    if (filtered.length === 0) {
      showToast("No Data Found", "error");
    }
  };

  const handleDateRangeSelect = () => {
    setShowStartPicker(true);
    setDatePickerStep(1);
  };

  const clearDateFilter = () => {
    setFilteredData([]);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handlePress = (device: BleDevice, item: GeoData) => {
    if (!device) return;

    const selectedDevice: BleDevice = {
      ...device,
      geoData: [item],
    };

    navigation.navigate("Map", {
      device: selectedDevice,
      redirectedFromTable: true,
    });
  };

  const renderItem = ({ item, index }: { item: GeoData; index: number }) => (
    <Pressable
      style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
      onPress={() => selectedDevice && handlePress(selectedDevice, item)}
    >
      <MyText style={[styles.cell, { width: "30%" }]}>
        {formatDate(item.timestamp)}
      </MyText>
      <View style={[styles.deviceInfoContainer, { width: "65%" }]}>
        <Pressable
          onPress={() => selectedDevice && handlePress(selectedDevice, item)}
        >
          <MyText style={styles.deviceTitle}>
            {`${item.latitude}, ${item.longitude}`}
          </MyText>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <OverlayLoader isShow={isDownloading} />
      <View style={styles.mainContainer}>
        <View style={styles.optionsSection}>
          {settingsOptions.map((option) => (
            <View key={option.id} style={styles.card}>
              <TouchableOpacity
                style={styles.option}
                activeOpacity={0.7}
                onPress={
                  option.id === 1
                    ? handleDownload
                    : option.id === 3
                    ? handleDateRangeSelect
                    : option.id === 4
                    ? () => navigation.navigate("ScheduleSelection")
                    : () => {
                        if (!isOnline) {
                          console.log("reconnect logic");
                          reconnect();
                        }
                      }
                }
              >
                <View style={styles.optionContent}>
                  <MyText style={styles.optionText}>
                    {option.id === 3 && filteredData.length > 0
                      ? `Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                      : option.text}
                  </MyText>
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
                      <MyText
                        style={[
                          styles.statusText,
                          { color: isOnline ? "#28A745" : "red" },
                        ]}
                      >
                        {isOnline ? "Online" : "Offline"}
                      </MyText>
                      {isOnline ? (
                        <Feather
                          name="check-circle"
                          size={18}
                          color={"#28A745"}
                          style={styles.statusIcon}
                        />
                      ) : (
                        <AntDesign
                          size={18}
                          name="warning"
                          color={"red"}
                          style={styles.statusIcon}
                        />
                      )}
                    </View>
                  )}

                  {option.id === 3 && filteredData.length > 0 ? (
                    <TouchableOpacity onPress={clearDateFilter}>
                      <Feather
                        name="x-circle"
                        size={22}
                        color={primaryColor}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  ) : (
                    option.id === 3 && (
                      <TouchableOpacity onPress={handleDateRangeSelect}>
                        <Feather
                          name="calendar"
                          size={22}
                          color={primaryColor}
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {showStartPicker && (
          <View style={styles.pickerContainer}>
            <MyText style={styles.pickerTitle}>Select Start Date</MyText>
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          </View>
        )}

        {showEndPicker && (
          <View style={styles.pickerContainer}>
            <MyText style={styles.pickerTitle}>Select End Date</MyText>
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              minimumDate={startDate}
              onChange={handleEndDateChange}
            />
          </View>
        )}

        {filteredData.length > 0 && (
          <View style={styles.listContainer}>
            <View style={styles.header}>
              <MyText style={[styles.headerText, { width: "40%" }]}>
                Date
              </MyText>
              <MyText style={[styles.headerText, { width: "60%" }]}>
                GNSS Location (Latitude, Longitude)
              </MyText>
            </View>

            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionsSection: {
    marginBottom: 15,
  },
  listContainer: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: primaryColor,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 5,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "left",
    color: "#fff",
    fontSize: 15,
    paddingLeft: 12,
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
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#343a40",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  evenRow: {
    backgroundColor: "#ffffff",
  },
  statusIcon: {
    marginLeft: 5,
  },
  deviceInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  oddRow: {
    backgroundColor: "#f1f3f5",
  },
  cell: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#343a40",
  },
  deviceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#007bff",
  },
  pickerContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: primaryColor,
    marginBottom: 8,
  },
});
export default Settings;
