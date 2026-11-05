/**
 * @file useNotifications.ts
 * @description React hook that wires up Firebase push notifications
 * for the Click G Service App (serviceman side).
 *
 * Usage:
 *   1. Call `useNotifications()` once inside your root AppContent component.
 *   2. It handles permissions, token registration, and listeners automatically.
 *   3. The `lastJob` state updates when a new job push arrives in foreground.
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import {
  createNotificationChannels,
  requestNotificationPermission,
  getFCMToken,
  subscribeToForegroundMessages,
  subscribeToNotificationOpenedApp,
  subscribeToTokenRefresh,
  getInitialNotification,
  registerBackgroundNotificationActions,
  JobNotificationPayload,
} from './notificationService';

// TODO: Replace with your actual backend API call
async function saveTokenToBackend(token: string, userId: string): Promise<void> {
  console.log(`[Notifications] Saving FCM token for user ${userId}:`, token);
  // Example:
  // await apiClient.post('/users/fcm-token', { token, userId });
}

// TODO: Replace with your backend call to accept/reject job
async function acceptJobOnBackend(jobId: string): Promise<void> {
  console.log('[Notifications] Background accept job:', jobId);
}
async function rejectJobOnBackend(jobId: string): Promise<void> {
  console.log('[Notifications] Background reject job:', jobId);
}

interface UseNotificationsReturn {
  /** The latest job push payload received in foreground (null initially). */
  lastJob: JobNotificationPayload | null;
  /** The current FCM token for this device. */
  fcmToken: string | null;
  /** Whether notification permission is granted. */
  hasPermission: boolean;
}

export function useNotifications(userId?: string): UseNotificationsReturn {
  const [lastJob, setLastJob] = useState<JobNotificationPayload | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Ref to avoid stale userId closure in token callback
  const userIdRef = useRef(userId);
  useEffect(() => { userIdRef.current = userId; }, [userId]);

  // ── Initial Setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    let unsubForeground: (() => void) | undefined;
    let unsubOpened: (() => void) | undefined;
    let unsubTokenRefresh: (() => void) | undefined;

    const setup = async () => {
      // 1. Create Android notification channels (no-op on iOS)
      await createNotificationChannels();

      // 2. Request permission
      const granted = await requestNotificationPermission();
      setHasPermission(granted);
      if (!granted) {
        console.warn('[Notifications] Permission not granted.');
        return;
      }

      // 3. Get & store FCM token
      const token = await getFCMToken();
      if (token) {
        setFcmToken(token);
        if (userIdRef.current) {
          await saveTokenToBackend(token, userIdRef.current);
        }
      }

      // 4. Foreground messages → display local notification + update state
      unsubForeground = subscribeToForegroundMessages(payload => {
        setLastJob(payload);
      });

      // 5. Background → Foreground tap (app was in background, user tapped notif)
      unsubOpened = subscribeToNotificationOpenedApp(remoteMessage => {
        console.log('[Notifications] Opened from background:', remoteMessage.data);
        // TODO: Navigate to job details
        // navigationRef.navigate('AcceptRequest', { jobId: remoteMessage.data?.jobId });
      });

      // 6. Token rotation
      unsubTokenRefresh = subscribeToTokenRefresh(async newToken => {
        setFcmToken(newToken);
        if (userIdRef.current) {
          await saveTokenToBackend(newToken, userIdRef.current);
        }
      });

      // 7. Check if app was launched from a killed-state notification tap
      const initialMessage = await getInitialNotification();
      if (initialMessage) {
        console.log('[Notifications] App opened from quit state:', initialMessage.data);
        // TODO: Navigate to job details
      }
    };

    setup();

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      unsubForeground?.();
      unsubOpened?.();
      unsubTokenRefresh?.();
    };
  }, []); // runs once on mount

  return { lastJob, fcmToken, hasPermission };
}
