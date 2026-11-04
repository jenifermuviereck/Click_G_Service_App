/**
 * @file deviceTokenService.ts
 * @description FCM Push Notification Token Registration and Lifecycle Manager.
 *
 * Handles:
 *  1. Fetching the device FCM token from Firebase Cloud Messaging.
 *  2. Persisting the token locally in AsyncStorage for offline resilience.
 *  3. Dispatching the token to the backend API (with fallback paths).
 *  4. Listening for automatic token rotations by Firebase.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  getFCMToken,
  subscribeToTokenRefresh,
} from './notificationService';
import apiClient from '../../common/api/apiClient';
import { ENDPOINTS } from '../../common/api/endPoint';

const FCM_TOKEN_STORAGE_KEY = '@clickg_device_fcm_token';

/**
 * Retrieves the cached FCM token from local storage.
 */
export async function getStoredFCMToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Sends the FCM device token to the backend.
 * Tries the dedicated device endpoint first, then falls back to profile patch.
 */
export async function sendTokenToBackend(token: string): Promise<boolean> {
  try {
    // 1. Try dedicated device registration endpoint
    const res = await apiClient.post(
      ENDPOINTS.NOTIFICATIONS.REGISTER_DEVICE,
      {
        fcmToken: token,
        platform: Platform.OS,
        appType: 'PERSON_APP',
      },
      { timeoutMs: 5000 },
    );

    if (res.success) {
      console.log('[DeviceToken] Successfully registered with backend /device/register');
      return true;
    }

    // 2. Fallback: Include token in profile patch
    const patchRes = await apiClient.patch(
      ENDPOINTS.PROFILE.UPDATE,
      {
        fcmToken: token,
      },
      { timeoutMs: 5000 },
    );

    if (patchRes.success) {
      console.log('[DeviceToken] Synced token via PATCH /profile');
      return true;
    }

    console.log('[DeviceToken] Token cached locally; will sync when backend endpoint is ready');
    return false;
  } catch (error) {
    console.warn('[DeviceToken] Non-blocking error while syncing token with backend:', error);
    return false;
  }
}

/**
 * Initializes and synchronizes the FCM push token.
 * Should be called upon user login and app startup.
 */
export async function syncDeviceToken(): Promise<string | null> {
  try {
    const token = await getFCMToken();
    if (!token) {
      console.warn('[DeviceToken] No FCM token retrieved from Firebase');
      return null;
    }

    // Save locally
    await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);

    // Send to backend
    await sendTokenToBackend(token);

    return token;
  } catch (err) {
    console.warn('[DeviceToken] Failed to sync device token:', err);
    return null;
  }
}

/**
 * Sets up the listener for Firebase token refresh events.
 */
export function setupTokenRefreshListener(): () => void {
  return subscribeToTokenRefresh(async (newToken: string) => {
    console.log('[DeviceToken] Firebase refreshed token:', newToken);
    await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, newToken);
    await sendTokenToBackend(newToken);
  });
}

export default {
  getStoredFCMToken,
  sendTokenToBackend,
  syncDeviceToken,
  setupTokenRefreshListener,
};
