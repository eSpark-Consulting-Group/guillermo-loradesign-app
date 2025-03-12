import { View, Text, StyleSheet } from "react-native";
import { MyText } from "../components/MyText";

const BaseStationSelection = () => {
  return (
    <View style={styles.container}>
      <MyText style={styles.screenName}>Base Station Selection</MyText>
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
