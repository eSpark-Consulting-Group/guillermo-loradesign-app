import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { primaryColor } from "../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={[
        styles.container,
        { height: Platform.OS == "ios" ? 60 + insets.bottom : 60 },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tab,
              { borderColor: isFocused ? primaryColor : "transparent" },
            ]}
          >
            {options.tabBarIcon && (
              <Ionicons
                name={
                  (
                    options.tabBarIcon({
                      focused: isFocused,
                      color: isFocused ? primaryColor : "#5591b6",
                      size: 24,
                    }) as React.ReactElement
                  ).props.name
                }
                size={24}
                color={isFocused ? primaryColor : "#5591b6"}
              />
            )}
            <Text
              style={[
                styles.label,
                { color: isFocused ? primaryColor : "#5591b6" },
              ]}
            >
              {typeof label === "string" ? label : ""}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#ffffff",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 3,
  },
  label: {
    fontSize: 11,
  },
});

export default BottomTabBar;
