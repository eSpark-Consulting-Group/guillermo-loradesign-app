import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigation";
import { store } from "./src/store";
import { RealmProvider } from "@realm/react";
import { DeviceInfoSchema, DeviceSchema } from "./src/database/models/schemas";
import { Provider } from "react-redux";
import ToastConfig from "./src/utils/toastConfig";

export default function App() {
  return (
    <Provider store={store}>
    <RealmProvider schema={[DeviceInfoSchema, DeviceSchema]} schemaVersion={1}>
      <NavigationContainer theme={DefaultTheme}>
          <StatusBar translucent={true} barStyle={"dark-content"} />
          <SafeAreaProvider style={{ flex: 1 }}>
            <RootStack />
            <ToastConfig />
          </SafeAreaProvider>
        </NavigationContainer>
        </RealmProvider>
        </Provider>
  );
}
