import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import BaseStationSelection from "../screens/BaseStationSelection";
import MapView from "../screens/MapView";
import Settings from "../screens/Settings";
import TableDetails from "../screens/TableDetails";

type RootTabParamList = {
  BaseStationSelection: undefined;
  MapView: undefined;
  Settings: undefined;
  TableDetails: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const RootTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="BaseStationSelection"
        component={BaseStationSelection}
      />
      <Tab.Screen name="MapView" component={MapView} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="TableDetails" component={TableDetails} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <RootTabs />
    </NavigationContainer>
  );
};

export default RootTabs;
