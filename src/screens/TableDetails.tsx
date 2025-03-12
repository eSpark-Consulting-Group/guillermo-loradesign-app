import { StackScreenProps } from "@react-navigation/stack";
import { View, Text, StyleSheet } from "react-native";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";

type TableDetailsProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "Table"
>;

const TableDetails = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenName}>Table Details screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenName: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default TableDetails;
