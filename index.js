/**
 * @file index.js
 * @description Click G Service App — Entry Point
 *
 * The background FCM message handler MUST be registered here at the module level
 * (outside the React component tree). This ensures Firebase can process messages
 * even when the app is in a background or killed state.
 */

import './global.css';
import { AppRegistry } from 'react-native';
import { getMessaging } from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// ─── Background FCM Handler ───────────────────────────────────────────────────
// Called when a data-only push arrives while the app is background/killed.
getMessaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[FCM Service] Background message received:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
