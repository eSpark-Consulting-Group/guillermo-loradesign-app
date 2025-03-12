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
  const deviceTheme = useColorScheme();

  return (
    <NavigationContainer
      theme={deviceTheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <StatusBar
        translucent={true}
        backgroundColor={"transparent"}
        barStyle={deviceTheme === "dark" ? "light-content" : "dark-content"}
      />
      <SafeAreaProvider
        style={{ backgroundColor: deviceTheme === "dark" ? "black" : "white" }}
      >
        <BaseStationSelection />
      </SafeAreaProvider>
    </NavigationContainer>
  );
};
