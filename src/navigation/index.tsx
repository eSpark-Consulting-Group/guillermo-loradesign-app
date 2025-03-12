import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import BaseStationSelection from "../screens/BaseStationSelection";
import MapView from "../screens/MapView";
import Settings from "../screens/Settings";
import TableDetails from "../screens/TableDetails";
import {
  BottomTabParamList,
  RootStackParamList,
} from "../types/navigationParams";

import { Device } from "../types";

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const BottomTabs = ({ route }: { route: { params: { device: Device } } }) => {
  const { device } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen name="Map" component={MapView} initialParams={{ device }} />
      <Tab.Screen
        name="Settings"
        component={Settings}
        initialParams={{ device }}
      />
      <Tab.Screen
        name="Table"
        component={TableDetails}
        initialParams={{ device }}
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
      />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default RootStack;
