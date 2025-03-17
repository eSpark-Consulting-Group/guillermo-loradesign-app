import React from "react";
import { View, StyleSheet } from "react-native";
import TableComponent from "../components/TableComponent";
import { deviceList } from "../constants";
import { useRoute } from "@react-navigation/native";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";
import { StackScreenProps } from "@react-navigation/stack";
import { MyText } from "../components/MyText";

type TableDetailsProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "Map"
>;

const TableDetails = () => {
  const route = useRoute<TableDetailsProps["route"]>();
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <TableComponent data={deviceList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
});

export default TableDetails;
