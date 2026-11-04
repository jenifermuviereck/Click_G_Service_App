/**
 * @file notificationService.ts
 * @description Firebase Cloud Messaging service for Click G Service App.
 *
 * Responsibilities:
 *  - Request notification permissions from the OS
 *  - Get the device FCM token and save it to backend
 *  - Listen for foreground messages and show local notifications
 *  - Handle background / quit-state notification taps (navigation)
 *  - Play a custom alert sound when a new job arrives
 */

import {
  getMessaging,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidCategory,
  EventType,
  Notification,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import { addNotification } from './notificationHistoryService';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JobNotificationPayload {
  jobId: string;
  jobTitle: string;
  customerName: string;
  address: string;
  amount: string;
  type: 'new_job' | 'job_update' | 'job_cancelled';
}

// ─── Channel IDs (Android) ────────────────────────────────────────────────────

/** High-priority channel for new incoming job alerts (plays custom sound). */
const JOB_ALERT_CHANNEL_ID = 'clickg_job_alert';

/** General channel for status updates. */
const JOB_UPDATE_CHANNEL_ID = 'clickg_job_update';

// ─── Channel Setup ────────────────────────────────────────────────────────────

/**
 * Creates Android notification channels the first time the app launches.
 * Must be called before displaying any notification.
 *
 * On Android 8+ (API 26+) channels are required.
 * iOS uses the `sound` option on the notification itself.
 */
export async function createNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  // Channel 1 — New Job Alert (custom sound + high importance)
  await notifee.createChannel({
    id: JOB_ALERT_CHANNEL_ID,
    name: 'New Job Alerts',
    importance: AndroidImportance.HIGH,
    sound: 'job_alert',          // ← maps to res/raw/job_alert.mp3
    vibration: true,
    vibrationPattern: [400, 200, 400, 200],
    lights: true,
    lightColor: '#FF6B00',       // ClickG brand orange
  });

  // Channel 2 — Job Updates (default sound)
  await notifee.createChannel({
    id: JOB_UPDATE_CHANNEL_ID,
    name: 'Job Updates',
    importance: AndroidImportance.DEFAULT,
    sound: 'default',
  });
}

// ─── Permission ────────────────────────────────────────────────────────────────

/**
 * Requests notification permission from the OS.
 * On Android 13+ this shows the system permission dialog.
 * On iOS it shows the standard permission sheet.
 *
 * @returns `true` if permission is granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const authStatus = await getMessaging().requestPermission();
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  // Android 13+ permission (handled by @notifee/react-native)
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1; // 1 = AUTHORIZED
}

// ─── FCM Token ────────────────────────────────────────────────────────────────

/**
 * Returns the current device FCM registration token.
 * Call this after the user logs in and send the token to your backend
 * so the backend can target this specific device.
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    // Ensure the device is registered with APNs first (iOS only)
    if (Platform.OS === 'ios') {
      await getMessaging().registerDeviceForRemoteMessages();
    }
    const token = await getMessaging().getToken();
    console.log('[FCM] Service App Token:', token);
    return token;
  } catch (error) {
    console.error('[FCM] Failed to get token:', error);
    return null;
  }
}

// ─── Display Local Notification ───────────────────────────────────────────────

/**
 * Displays a rich local notification for an incoming job.
 * Triggered when a push arrives while the app is in the foreground.
 */
export async function displayJobNotification(
  remoteMessage: any,
): Promise<void> {
  const { notification, data } = remoteMessage;
  const isNewJob = (data as unknown as JobNotificationPayload)?.type === 'new_job';

  // Persist incoming notification in local Notification Center history
  addNotification({
    title: notification?.title ?? '🔧 New Job Request',
    body: notification?.body ?? 'You have a new job waiting!',
    type: isNewJob ? 'new_job' : 'job_update',
    jobId: (data as any)?.jobId,
    data: data || {},
  }).catch(() => {});

  await notifee.displayNotification({
    title: notification?.title ?? '🔧 New Job Request',
    body: notification?.body ?? 'You have a new job waiting!',
    android: {
      channelId: isNewJob ? JOB_ALERT_CHANNEL_ID : JOB_UPDATE_CHANNEL_ID,
      // Custom sound is inherited from the channel on Android 8+
      smallIcon: 'ic_launcher',      // standard app icon in res/mipmap
      color: '#FF6B00',
      pressAction: { id: 'default' },    // brings app to foreground on tap
      category: AndroidCategory.CALL,   // shows heads-up banner even DND
      importance: isNewJob ? AndroidImportance.HIGH : AndroidImportance.DEFAULT,
      // Action buttons
      actions: isNewJob
        ? [
            { title: '✅ Accept', pressAction: { id: 'accept' } },
            { title: '❌ Reject', pressAction: { id: 'reject' } },
          ]
        : [],
    },
    ios: {
      sound: isNewJob ? 'job_alert.wav' : 'default',   // add to iOS bundle
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
    data: remoteMessage.data,
  });
}

// ─── Foreground Listener ──────────────────────────────────────────────────────

/**
 * Sets up the foreground message listener.
 * Firebase suppresses visual notifications when the app is open —
 * we intercept and display them manually with notifee.
 *
 * @param onJobReceived  Optional callback with the parsed payload.
 * @returns Unsubscribe function — call it in your `useEffect` cleanup.
 */
export function subscribeToForegroundMessages(
  onJobReceived?: (payload: JobNotificationPayload) => void,
): () => void {
  const unsubscribe = getMessaging().onMessage(async remoteMessage => {
    console.log('[FCM] Foreground message:', remoteMessage);
    await displayJobNotification(remoteMessage);

    if (onJobReceived && remoteMessage.data) {
      onJobReceived(remoteMessage.data as unknown as JobNotificationPayload);
    }
  });

  return unsubscribe;
}

// ─── Background / Quit Handler (register at module level) ────────────────────

/**
 * Handles notification action button taps while app is in background/quit.
 * Register this ONCE at the very top of index.js (outside React tree).
 *
 * @param onAccept  Called with jobId when serviceman taps "Accept".
 * @param onReject  Called with jobId when serviceman taps "Reject".
 */
export function registerBackgroundNotificationActions(
  onAccept: (jobId: string) => void,
  onReject: (jobId: string) => void,
): void {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    const jobId = (notification?.data as unknown as JobNotificationPayload)?.jobId;

    if (type === EventType.ACTION_PRESS && pressAction?.id === 'accept' && jobId) {
      onAccept(jobId);
    }
    if (type === EventType.ACTION_PRESS && pressAction?.id === 'reject' && jobId) {
      onReject(jobId);
    }
    // Dismiss the notification after action
    if (notification?.id) {
      await notifee.cancelNotification(notification.id);
    }
  });
}

// ─── App-Opened-Via-Notification ──────────────────────────────────────────────

/**
 * Checks if the app was opened by tapping a notification while it was quit.
 * Call this in your root navigator's `useEffect` to navigate to the right screen.
 *
 * @returns The remote message that caused the open, or `null`.
 */
export async function getInitialNotification(): Promise<any | null> {
  return getMessaging().getInitialNotification();
}

/**
 * Listens for notification taps that bring the app from background to foreground.
 * @returns Unsubscribe function.
 */
export function subscribeToNotificationOpenedApp(
  callback: (remoteMessage: any) => void,
): () => void {
  return getMessaging().onNotificationOpenedApp(callback);
}

// ─── Token Refresh Listener ───────────────────────────────────────────────────

/**
 * Listens for token refresh events (Firebase rotates tokens periodically).
 * Send the new token to your backend when this fires.
 *
 * @param onTokenRefresh  Callback with the new token string.
 * @returns Unsubscribe function.
 */
export function subscribeToTokenRefresh(
  onTokenRefresh: (token: string) => void,
): () => void {
  return getMessaging().onTokenRefresh(onTokenRefresh);
}
