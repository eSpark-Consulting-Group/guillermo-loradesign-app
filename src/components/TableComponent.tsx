import { View, FlatList, StyleSheet } from "react-native";
import React from "react";
import { MyText } from "./MyText";
import { primaryColor } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { BleDevice, GeoData, Timestamp } from "../types";
import { StackScreenProps } from "@react-navigation/stack";
import { formatDate } from "../utils/DateFormat";
import {
  RootStackParamList,
  BottomTabParamList,
} from "../types/navigationParams";

interface TableComponentProps {
  data: BleDevice | null;
}

type TableDetailsProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "Map"
>;

const TableComponent = ({ data }: TableComponentProps) => {
  const navigation = useNavigation<TableDetailsProps["navigation"]>();

  const handlePress = (item: GeoData) => {
    if (!data) return;

    const selectedDevice: BleDevice = {
      ...data,
      geoData: [item],
    };

    navigation.navigate("Map", {
      device: selectedDevice,
      redirectedFromTable: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MyText style={[styles.headerText, { width: "20%" }]}>Device ID</MyText>
        <MyText style={[styles.headerText, { width: "20%" }]}>Date</MyText>
        <MyText style={[styles.headerText, { width: "60%" }]}>
          GNSS Location (Latitude,Longitude)
        </MyText>
      </View>

      <FlatList
        data={data?.geoData || []}
        keyExtractor={(item, index) =>
          `${item.latitude}-${item.longitude}-${index}`
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            style={[
              styles.row,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
            ]}
            onPress={() => handlePress(item)}
          >
            <MyText style={[styles.cell, { width: "20%" }]}>{item.id}</MyText>
            <MyText style={[styles.cell, { width: "20%" }]}>
              {formatDate(item.timestamp)}
            </MyText>
            <View style={[styles.deviceInfoContainer, { width: "60%" }]}>
              <Pressable
                key={`${item.latitude}-${item.longitude}-${index}`}
                onPress={() => handlePress(item)}
              >
                <MyText style={styles.deviceTitle}>
                  {`${item.latitude}, ${item.longitude}`}
                </MyText>
              </Pressable>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 10 }}>
            <MyText style={{ textAlign: "center" }}>No data available</MyText>
          </View>
        }
      />
    </View>
  );
};

export default TableComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    padding: "2%",
    margin: "3%",
    marginBottom: "18%",
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
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    // backgroundColor: "yellow",
    // paddingLeft: 12,
    // borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  evenRow: {
    backgroundColor: "#ffffff",
  },
  oddRow: {
    backgroundColor: "#f1f3f5",
  },
  cell: {
    // flex: 1,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#343a40",
  },
  deviceInfoContainer: {
    // flex: 1,
    // alignSelf: "flex-start",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceInfoCard: {
    backgroundColor: "#e9f5ff",
    padding: "4%",
    borderRadius: 8,
    marginBottom: "10%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  deviceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#007bff",
    marginBottom: 4,
  },
  deviceText: {
    fontSize: 13,
    color: "#495057",
  },
});
