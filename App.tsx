import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootTabs from "./src/navigation";

export default function App() {
  return <MainApp />;
}

const MainApp = () => {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <StatusBar
        translucent={true}
        backgroundColor={"white"}
        barStyle={"dark-content"}
      />
      <SafeAreaProvider>
        <RootTabs />
      </SafeAreaProvider>
    </NavigationContainer>
  );
};
