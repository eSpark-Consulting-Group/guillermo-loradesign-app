import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";

type MapViewProps = StackScreenProps<
  RootStackParamList & BottomTabParamList,
  "Map"
>;

const MapView = () => {
  const route = useRoute<MapViewProps["route"]>();
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.screenName}>Map View Screen</Text>
      <Text style={styles.deviceName}>{device?.name}</Text>
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
  deviceName: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default MapView;
