import { View, Text, StyleSheet } from "react-native";
import { ThemedText } from "../components/ThemedText";

const BaseStationSelection = () => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.screenName}>Base Station Selection</ThemedText>
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

export default BaseStationSelection;
