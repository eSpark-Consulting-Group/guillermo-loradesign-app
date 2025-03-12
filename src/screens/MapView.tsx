import { View, Text, StyleSheet } from "react-native";

const MapView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenName}>Map View Screen</Text>
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

export default MapView;
