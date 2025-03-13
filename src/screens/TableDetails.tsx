import React from "react";
import { View, StyleSheet } from "react-native";
import TableComponent from "../components/TableComponent";

const TableDetails = () => {
  const tableData = [
    { age: "25", name: "John Doe", employeeID: "EMP001" },
    { age: "30", name: "Jane Smith", employeeID: "EMP002" },
    { age: "28", name: "Alice Brown", employeeID: "EMP003" },
    { age: "35", name: "Bob White", employeeID: "EMP004" },
    { age: "40", name: "Charlie Black", employeeID: "EMP005" },
    { age: "22", name: "Daisy Green", employeeID: "EMP006" },
  ];

  return (
    <View style={styles.container}>
      <TableComponent data={tableData} />
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