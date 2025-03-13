import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import BaseStationSelection from "../screens/BaseStationSelection";
import MapView from "../screens/MapView";
import Settings from "../screens/Settings";
import TableDetails from "../screens/TableDetails";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";
import { Device } from "../types";
import BottomTabBar from "../components/BottomTabBar";
import { primaryColor } from "../constants/Colors";

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const BottomTabs = ({ route }: { route: { params: { device: Device } } }) => {
  const { device } = route.params;

  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerStyle: { height: 90, backgroundColor: "#ffffff" },
        headerTitleStyle: { color: primaryColor },
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapView}
        initialParams={{ device }}
        options={{
          tabBarIcon: (props) => (
            <Ionicons name="map" size={props.size} color={props.color} />
          ),
          tabBarStyle: { paddingVertical: 10 },
        }}
      />
      <Tab.Screen
        name="Table"
        component={TableDetails}
        initialParams={{ device }}
        options={{
          tabBarIcon: (props) => (
            <Ionicons name="journal" size={props.size} color={props.color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        initialParams={{ device }}
        options={{
          tabBarIcon: (props) => (
            <Ionicons name="settings" size={props.size} color={props.color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="BaseStationSelection"
        component={BaseStationSelection}
        options={{
          headerShown: true,
          title: "Select Base Station",
          headerTitleStyle: { color: primaryColor },
          headerStyle: { height: 90, backgroundColor: "#ffffff" },
        }}
      />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default RootStack;
