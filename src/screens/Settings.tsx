import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { MyText } from "../components/MyText";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { settingsOptions } from "../constants";

const Settings = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(
    "Region 1"
  );

  const handleRegionSelection = (region: string) => {
    setSelectedRegion(region);
    console.log(region);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {settingsOptions.map((option) => (
          <View key={option.id}>
            <View style={styles.option}>
              <MyText>{option.text}</MyText>
              <FontAwesome
                name={option.icon as any}
                size={24}
                onPress={option.onPress}
              />
            </View>

            {option.id === 2 && (
              <View style={styles.status}>
                <FontAwesome name="check-circle" size={24} color="green" />
                <MyText>Online</MyText>
              </View>
            )}

            {option.id === 3 && (
              <View style={{ paddingLeft: 5, gap: 5 }}>
                {["Region 1", "Region 2", "Region 3"].map((region) => (
                  <Pressable
                    key={region}
                    onPress={() => handleRegionSelection(region)}
                    style={[
                      styles.region,
                      selectedRegion === region && styles.selectedRegion,
                    ]}
                  >
                    <MyText>- {region}</MyText>
                    {selectedRegion === region ? (
                      <Ionicons name="checkmark" size={24} color="green" />
                    ) : null}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    height: "92%",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 25,
  },
  status: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 25,
    width: "26%",
    paddingLeft: 5,
  },
  region: {
    padding: 5,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  selectedRegion: {
    // backgroundColor: "#d3d3d3",
  },
});

export default Settings;
