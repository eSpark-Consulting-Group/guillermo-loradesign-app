import { View, Text, StyleSheet } from "react-native";

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenName}>Settings</Text>
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

export default Settings;
