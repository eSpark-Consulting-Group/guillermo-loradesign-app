import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { store, persistor } from "./src/store";
import RootStack from "./src/navigation";
import { initializeDatabase } from "./src/database";
import DatabaseService from "./src/database/services/DatabaseService";

export default function App() {
  const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);

  useEffect(() => {
    setupDatabase();
  }, []);
  
  useEffect(() => {
    if (isDatabaseInitialized) {
      fetchDevices();
    }
  }, [isDatabaseInitialized]);

  const fetchDevices = async () => {
    try {
      const devicesFromDb = await DatabaseService.getAllDevicesList();
      console.log("fetching devices:", JSON.stringify(devicesFromDb));
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const setupDatabase = async () => {
    try {
      await initializeDatabase();
      setIsDatabaseInitialized(true);
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer theme={DefaultTheme}>
          <StatusBar translucent={true} barStyle={"dark-content"} />
          <SafeAreaProvider style={{ flex: 1 }}>
            <RootStack />
          </SafeAreaProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
