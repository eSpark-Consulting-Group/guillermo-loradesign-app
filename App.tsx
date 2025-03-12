import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BaseStationSelection from "./src/screens/BaseStationSelection";

export default function App() {
  return <MainApp />;
}

const MainApp = () => {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />
      <SafeAreaProvider>
        <BaseStationSelection />
      </SafeAreaProvider>
    </NavigationContainer>
  );
};
