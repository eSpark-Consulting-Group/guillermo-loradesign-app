import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CalendarPicker from "react-native-calendar-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme, useNavigation } from "@react-navigation/native";

import { primaryColor, secondaryColor } from "../constants/Colors";
import { MyText } from "../components/MyText";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigationParams";
import { useTheme } from "react-native-paper";
import { getDateRangeObjects } from "../utils/DateFormat";

type ScheduleScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ScheduleSelection"
>;

const ScheduleSelection = () => {
  const navigation = useNavigation<ScheduleScreenNavigationProp>();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <CalendarPicker
        selectedStartDate={startDate!}
        selectedEndDate={endDate as Date}
        allowRangeSelection
        todayBackgroundColor="transparent"
        dayLabelsWrapper={{
          display: "none",
        }}
        todayTextStyle={{ color: "black" }}
        maxRangeDuration={15}
        selectedRangeStyle={{ backgroundColor: secondaryColor + 43 }}
        selectedRangeStartTextStyle={{ color: "black" }}
        minDate={new Date()}
        onDateChange={(date: Date, dateType: "END_DATE" | "START_DATE") => {
          if (dateType == "END_DATE") {
            setEndDate(date);
          } else {
            setStartDate(date);
            setEndDate(null);
          }
        }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.buttonWrapper}
        >
          <MyText style={styles.buttonText}>Cancel</MyText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!endDate || !startDate) return;
            console.log("startDate", startDate, "endDate", endDate);
            const dateArr = getDateRangeObjects(startDate, endDate);
            console.log("dateArr ....>>", dateArr);
          }}
          disabled={!endDate}
          style={[styles.buttonWrapper, { backgroundColor: primaryColor }]}
        >
          <MyText style={styles.buttonText}>Send to Base Station</MyText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ScheduleSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
  },
  buttonContainer: { flexDirection: "row", padding: 10, gap: 10 },
  buttonWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: secondaryColor,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});
