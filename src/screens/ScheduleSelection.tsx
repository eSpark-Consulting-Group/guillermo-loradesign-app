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
import Dropdown, { DropdownItem } from "../components/DropdownMenu";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { showToast } from "../utils/showToast";
import { FlatList } from "react-native-gesture-handler";
import { useBLE } from "../hooks/useBLE";

type ScheduleScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ScheduleSelection"
>;

const ScheduleSelection = ({ onClose }: { onClose: () => void }) => {
  const navigation = useNavigation<ScheduleScreenNavigationProp>();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selected, setSelected] = useState<DropdownItem | null>(null);
  const [selectDates, setSelectDates] = useState(false);
  const [currentSlots, setCurrentSlots] = useState<
    | null
    | {
        sDate: Date;
        eDate: Date;
        timeSlot: string;
      }[]
  >(null);

  const { writeCharacteristics, connectedDevice } = useBLE();

  const timeSlots: DropdownItem[] = [
    { label: "6:00-8:00", value: "A" },
    { label: "7:00-9:00", value: "B" },
    { label: "8:00-10:00", value: "C" },
    { label: "16:00-18:00", value: "D" },
  ];

  const formatDatetoMMDD = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${month}/${day}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalendarPicker
        nextComponent={<Feather name="chevron-right" size={24} color="black" />}
        previousComponent={
          <Feather name="chevron-left" size={24} color="black" />
        }
        selectedStartDate={startDate!}
        selectedEndDate={endDate as Date}
        allowRangeSelection={selectDates}
        todayBackgroundColor="transparent"
        dayLabelsWrapper={{
          display: "none",
        }}
        todayTextStyle={{ color: "black" }}
        selectedDayColor={"white"}
        maxRangeDuration={15}
        // selectedRangeStyle={{ backgroundColor: "white" }}
        selectedRangeStyle={{
          backgroundColor: selectDates ? secondaryColor + 43 : "white",
        }}
        selectedRangeStartTextStyle={{ color: "black" }}
        minDate={new Date()}
        onDateChange={(date: Date, dateType: "END_DATE" | "START_DATE") => {
          if (!selectDates) {
            showToast(
              "Please press add date first to start selecting",
              "error"
            );
          }
          if (dateType == "END_DATE") {
            setEndDate(date);
          } else {
            setStartDate(date);
            setEndDate(null);
          }
        }}
      />
      <View style={{ flex: 1, borderTopWidth: 1 }}>
        <View style={{ flexDirection: "row", paddingVertical: 10 }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <MyText type="defaultSemiBold">Dates Selected</MyText>
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <MyText type="defaultSemiBold">2-Hour Time Window</MyText>
          </View>
        </View>
        <FlatList
          data={currentSlots}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MyText>
                  {formatDatetoMMDD(item.sDate)}-{formatDatetoMMDD(item.eDate)}
                </MyText>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MyText>{item.timeSlot}</MyText>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setStartDate(null);
                  setSelectDates(!selectDates);
                  if (!selectDates) {
                    showToast("Now select dates from calendar", "success");
                  }
                }}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                {!selectDates ? (
                  <Ionicons name="add-circle-outline" size={24} />
                ) : null}
                <MyText>
                  {selectDates
                    ? `${startDate ? formatDatetoMMDD(startDate) : ""}` +
                      "-" +
                      `${endDate ? formatDatetoMMDD(endDate) : ""}`
                    : "Add Date"}
                </MyText>
              </TouchableOpacity>
              <Dropdown
                data={timeSlots}
                placeholder="Select a slot"
                value={selected}
                onSelect={(item) => {
                  if (startDate && endDate) {
                    let updatedSlots = currentSlots ? [...currentSlots] : [];
                    const slot = {
                      sDate: startDate,
                      eDate: endDate,
                      timeSlot: item.label,
                    };

                    updatedSlots.push(slot);
                    setCurrentSlots(updatedSlots);
                    setSelectDates(false);
                    console.log("slot >>", slot);
                  } else {
                    setSelected(item);
                  }
                }}
              />
            </View>
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onClose()}
          style={styles.buttonWrapper}
        >
          <MyText style={styles.buttonText}>Cancel</MyText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => {
          //   if (!endDate || !startDate) return;
          //   console.log("startDate", startDate, "endDate", endDate);
          //   const dateArr = getDateRangeObjects(startDate, endDate);
          //   console.log("dateArr ....>>", dateArr);
          // }}
          onPress={() => writeCharacteristics(connectedDevice!)}
          // disabled={!endDate}
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
