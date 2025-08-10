import { registerRootComponent } from 'expo';
import crashlytics from '@react-native-firebase/crashlytics';

import App from './App';
crashlytics().setCrashlyticsCollectionEnabled(true);
// Enable crashlytics collection (disable for debug builds if needed)
// if (!__DEV__) {
//   crashlytics().setCrashlyticsCollectionEnabled(true);
// }
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
