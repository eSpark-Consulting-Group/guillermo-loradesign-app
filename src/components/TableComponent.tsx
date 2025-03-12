import { View, FlatList, StyleSheet } from "react-native";
import React from "react";
import { MyText } from "./MyText";

interface TableComponentProps {
  data: { age: string; name: string; employeeID: string }[];
}

const TableComponent = ({ data }: TableComponentProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MyText style={[styles.headerText, styles.headerCell]}>AGE</MyText>
        <MyText style={[styles.headerText, styles.headerCell]}>NAME</MyText>
        <MyText style={[styles.headerText, styles.headerCell]}>EMPLOYEE ID</MyText>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
            <MyText style={styles.cell}>{item.age}</MyText>
            <MyText style={styles.cell}>{item.name}</MyText>
            <MyText style={styles.cell}>{item.employeeID}</MyText>
          </View>
        )}
      />
    </View>
  );
};
export default TableComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    backgroundColor: "#343a40",
    borderRadius: 8,
  },
  headerText: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "#fff",
  },
  headerCell: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  evenRow: {
    backgroundColor: "#ffffff",
  },
  oddRow: {
    backgroundColor: "#f1f3f5",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 4,
    fontSize: 16,
    color: "#212529",
  },
});