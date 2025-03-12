import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import RootStack from "./src/navigation";

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
      <SafeAreaProvider style={{ flex: 1 }}>
        <RootStack />
      </SafeAreaProvider>
    </NavigationContainer>
  );
};
