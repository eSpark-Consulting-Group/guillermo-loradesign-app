import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

import TableComponent from "../components/TableComponent";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";
import { useSelector } from "react-redux";
import { RootState } from "../store";

type TableDetailsProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "Map"
>;

const TableDetails = () => {
  const navigation = useNavigation<TableDetailsProps["navigation"]>();
  const selectedDevice = useSelector(
    (state: RootState) => state.device.selectedDevice
  );

  return (
    <View style={styles.container}>
      <TableComponent data={selectedDevice} />
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
