// import { StyleSheet, Text, View, StatusBar, Platform } from "react-native";
// import { AppNavigator } from "./navigation/AppNavigator";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { store, persistor } from "./redux/store";
// import { useEffect, useState, useRef } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { ShopProvider } from "./Components/ShopContext";
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import * as TaskManager from 'expo-task-manager';
// import * as Device from 'expo-device';

// export default function App() {
//   const [notificationPermissionStatus, setNotificationPermissionStatus] = useState(null);

//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true, // Display an alert
//       shouldPlaySound: false, // Do not play a sound
//       shouldSetBadge: false, // Do not set a badge on the app icon
//     }),
//   });

//   async function requestNotificationPermission() {
//     if (Platform.OS === 'android') {
//       Alert.alert(
//         "Stay Updated",
//         "We'd like to send you notifications to keep you informed about important updates and offers.",
//         [
//           {
//             text: "Cancel",
//             style: "cancel"
//           },
//           {
//             text: "Allow",
//             onPress: async () => {
//               const { status } = await Notifications.requestPermissionsAsync();
//               if (status !== 'granted') {
//                 Alert.alert('Permission not granted to receive push notifications!');
//               }
//             }
//           }
//         ]
//       );
//     } else {
//       const { status } = await Notifications.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission not granted to receive push notifications!');
//       }
//     }
//   }
  

//   const [devicePushToken, setDevicePushToken] = useState('');
  
//   useEffect(() => {
//     requestNotificationPermission();
//     registerForPushNotificationsAsync();

//     const notificationListener = Notifications.addNotificationReceivedListener(notification => {
//       Alert.alert('Notification Received', notification.request.content.body);
//     });
//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener);
//     };
//   }, []);

//   useEffect(() => {
//     const registerBackgroundTask = async () => {
//       const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
//       if (!isRegistered) {
//         await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
//       }
//     };

//     registerBackgroundTask();

//     return () => {
//       Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
//     };
//   }, []);


//   async function registerForPushNotificationsAsync() {
//     if (Device.isDevice) {
//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       setNotificationPermissionStatus(finalStatus);

//       if (finalStatus !== 'granted') {
//         Alert.alert('Permission required', 'Please enable notifications in your settings to receive updates.');
//         return;
//       }

//       const token = (await Notifications.getExpoPushTokenAsync()).data;
//       // console.log('Expo Push Token:', token);
//     } else {
//       Alert.alert('Physical device required', 'Push notifications are only supported on physical devices.');
//     }

//     // Configure notification channels for Android
//     if (Platform.OS === 'android') {
//       await Notifications.setNotificationChannelAsync('default', {
//         name: 'Default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }
//   }

//   const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

//   TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
//     if (error) {
//       console.error('Error handling background notification:', error);
//       return;
//     }
//     if (data) {
//       console.log('Received a background notification:', data);
//     }
//   });
  
//   Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  
// // AsyncStorage.clear()
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <View style={styles.container}>
//           <Toast ref={(ref) => Toast.setRef(ref)} />
//           <ShopProvider>
//             <AppNavigator />

//           </ShopProvider>
//           <StatusBar backgroundColor="white" barStyle="dark-content" translucent={false} />
//         </View>
//       </PersistGate>
//     </Provider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
// });


// my code
import { StyleSheet, Text, View, StatusBar, Platform, Alert } from "react-native";
import { AppNavigator } from "./navigation/AppNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ShopProvider } from "./Components/ShopContext";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';

export default function App() {
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState(null);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, // Display an alert
      shouldPlaySound: false, // Do not play a sound
      shouldSetBadge: false, // Do not set a badge on the app icon
    }),
  });

  async function requestNotificationPermission() {
    if (Platform.OS === 'android') {
      Alert.alert(
        "Stay Updated",
        "We'd like to send you notifications to keep you informed about important updates and offers.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Allow",
            onPress: async () => {
              const { status } = await Notifications.requestPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission not granted to receive push notifications!');
              }
            }
          }
        ]
      );
    } else {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted to receive push notifications!');
      }
    }
  }

  const [devicePushToken, setDevicePushToken] = useState('');

  useEffect(() => {
    requestNotificationPermission();
    registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      Alert.alert('Notification Received', notification.request.content.body);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  useEffect(() => {
    const registerBackgroundTask = async () => {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
      if (!isRegistered) {
        await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      }
    };

    registerBackgroundTask();

    return () => {
      Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setNotificationPermissionStatus(finalStatus);

      if (finalStatus !== 'granted') {
        Alert.alert('Permission required', 'Please enable notifications in your settings to receive updates.');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log('Expo Push Token:', token);
    } else {
      Alert.alert('Physical device required', 'Push notifications are only supported on physical devices.');
    }

    // Configure notification channels for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
    if (error) {
      console.error('Error handling background notification:', error);
      return;
    }
    if (data) {
      console.log('Received a background notification:', data);
    }
  });

  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

  // AsyncStorage.clear()
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <Toast />
          <ShopProvider>
            <AppNavigator />
          </ShopProvider>
          <StatusBar backgroundColor="white" barStyle="dark-content" translucent={false} />
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});