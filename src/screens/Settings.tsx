import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  UIManager,
  Platform
} from "react-native";
import { MyText } from "../components/MyText";
import { Feather } from "@expo/vector-icons";
import { primaryColor } from "../constants/Colors";
import { settingsOptions } from "../constants";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { downloadDeviceInfoCSV } from "../database/csvUtil";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  
  // Date range state (replacing single date)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [datePickerStep, setDatePickerStep] = useState(0); // 0: none, 1: start, 2: end
  
  const [filteredData, setFilteredData] = useState<GeoData[]>([]);
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadDeviceInfoCSV(selectedDevice, selectedDevice?.geoData ?? []);
      showToast("The CSV file has been saved successfully","success")
    } catch (error) {
      console.error("Error downloading CSV:", error);
      showToast("An error occurred while downloading the file","error")
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStartDateChange = (event:any, date:any) => {
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

  const handleEndDateChange = (event:any, date:any) => {
    setShowEndPicker(false);
    if (!date) return;

    if (event.type === "dismissed") {
      return;
    }

    setEndDate(date);
    setDatePickerStep(0);
    
    filterDataByDateRange(startDate, date);
  };

  const filterDataByDateRange = (start:any, end:any) => {
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
      showToast("No Data Found","error")
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
  
      navigation.navigate("Map", { device: selectedDevice });
    };
  

  const renderItem = ({ item, index }: { item: GeoData; index: number }) => (
    <Pressable
      style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
      onPress={() => selectedDevice && handlePress(selectedDevice,item)}
    >
      <MyText style={[styles.cell, { width: "30%" }]}>
      {formatDate(item.timestamp)}
            </MyText>
      <View style={[styles.deviceInfoContainer, { width: "65%" }]}>
        <Pressable
          onPress={() => selectedDevice && handlePress(selectedDevice,item)}
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
      <View style={styles.content}>
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
                  : option.onPress
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
                    <MyText style={styles.statusText}>Online</MyText>
                    <Feather
                      name="check-circle"
                      size={18}
                      color="#28A745"
                      style={styles.statusIcon}
                    />
                  </View>
                )}

                {option.id === 3 && filteredData.length > 0 ? (
                  <TouchableOpacity
                    onPress={clearDateFilter}
                  >
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
              minimumDate={startDate} // Prevent selecting end date before start date
              onChange={handleEndDateChange}
            />
          </View>
        )}
        
        {filteredData.length > 0 && (
          <>
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
              keyExtractor={(item) => item.ids[0].toString()}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
            />
          </>
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