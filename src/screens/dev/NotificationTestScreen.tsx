/**
 * @file NotificationTestScreen.tsx
 * @description Developer screen to test push notifications locally
 * WITHOUT needing Firebase or a backend during development.
 *
 * Access: only shown in __DEV__ mode (not bundled in release builds).
 *
 * Features:
 *  - Display current FCM token (tap to copy)
 *  - Simulate a foreground "New Job" notification
 *  - Send a real local notification via notifee
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Clipboard,
  Platform,
} from 'react-native';
import notifee, { AndroidImportance, AndroidCategory } from '@notifee/react-native';
import { getFCMToken, createNotificationChannels } from '../../services/notifications';

const JOB_ALERT_CHANNEL_ID = 'clickg_job_alert';

/** Fires a real on-device notification using notifee (no server required). */
async function fireLocalJobNotification(type: 'new_job' | 'update' | 'cancel') {
  await createNotificationChannels();

  const configs = {
    new_job: {
      title: '🔧 New Job Request!',
      body: 'Ravi Kumar needs AC Repair at 14, Anna Nagar.',
    },
    update: {
      title: '📋 Job Updated',
      body: 'Customer changed the appointment to 3:00 PM.',
    },
    cancel: {
      title: '❌ Job Cancelled',
      body: 'The customer has cancelled the AC Repair job.',
    },
  };

  const { title, body } = configs[type];

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: JOB_ALERT_CHANNEL_ID,
      smallIcon: 'ic_launcher',
      color: '#FF6B00',
      importance: AndroidImportance.HIGH,
      category: AndroidCategory.CALL,
      pressAction: { id: 'default' },
      actions:
        type === 'new_job'
          ? [
              { title: '✅ Accept', pressAction: { id: 'accept' } },
              { title: '❌ Reject', pressAction: { id: 'reject' } },
            ]
          : [],
    },
    ios: {
      sound: type === 'new_job' ? 'job_alert.wav' : 'default',
    },
    data: {
      jobId: 'DEV-TEST-001',
      jobTitle: 'AC Repair',
      customerName: 'Ravi Kumar',
      address: '14, Anna Nagar, Chennai',
      amount: '450',
      type,
    },
  });
}

const NotificationTestScreen: React.FC = () => {
  const [token, setToken] = useState<string>('Press button to fetch...');
  const [loading, setLoading] = useState(false);

  const fetchToken = async () => {
    setLoading(true);
    const t = await getFCMToken();
    setToken(t ?? 'Failed to get token');
    setLoading(false);
  };

  const copyToken = () => {
    Clipboard.setString(token);
    Alert.alert('Copied!', 'FCM token copied to clipboard.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>🔬 Notification Dev Lab</Text>
      <Text style={styles.subtitle}>Service App — Dev Only</Text>

      {/* FCM Token Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 FCM Device Token</Text>
        <Text style={styles.tokenText} numberOfLines={5}>{token}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.btnSecondary} onPress={fetchToken} disabled={loading}>
            <Text style={styles.btnSecondaryText}>{loading ? 'Fetching...' : '🔄 Fetch Token'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={copyToken}>
            <Text style={styles.btnSecondaryText}>📋 Copy</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>
          Copy this token and use it in Firebase Console → Cloud Messaging → Send test message
        </Text>
      </View>

      {/* Local Notification Triggers */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧪 Fire Local Notification</Text>
        <Text style={styles.hint}>
          These trigger real on-device notifications using notifee. No server needed.
          Background the app first to see heads-up banners.
        </Text>

        <TouchableOpacity
          style={[styles.btn, styles.btnOrange]}
          onPress={() => fireLocalJobNotification('new_job')}>
          <Text style={styles.btnText}>🔔 Fire — New Job Alert (Custom Sound)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnBlue]}
          onPress={() => fireLocalJobNotification('update')}>
          <Text style={styles.btnText}>📋 Fire — Job Updated</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnRed]}
          onPress={() => fireLocalJobNotification('cancel')}>
          <Text style={styles.btnText}>❌ Fire — Job Cancelled</Text>
        </TouchableOpacity>
      </View>

      {/* Steps Guide */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📖 How to Test</Text>
        {[
          '1. Run app on a real Android device (emulators may not support FCM).',
          '2. Tap "Fetch Token" above and copy the FCM token.',
          '3. Open Firebase Console → your project → Cloud Messaging.',
          '4. Click "Send test message" → paste the token → send.',
          '5. Or use the local triggers above (no server needed).',
          '6. To test background: press Home, then trigger a notification.',
          '7. To test quit-state: force close app, then send from Firebase Console.',
        ].map((step, i) => (
          <Text key={i} style={styles.stepText}>{step}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1A' },
  content: { padding: 16, paddingBottom: 40 },
  screenTitle: { color: '#FF6B00', fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  subtitle: { color: '#666', fontSize: 13, textAlign: 'center', marginBottom: 20 },
  card: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 12 },
  tokenText: {
    color: '#aaa',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnOrange: { backgroundColor: '#FF6B00' },
  btnBlue: { backgroundColor: '#2979FF' },
  btnRed: { backgroundColor: '#D32F2F' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnSecondary: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#2A2A3E',
  },
  btnSecondaryText: { color: '#FF6B00', fontWeight: '600', fontSize: 13 },
  hint: { color: '#666', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  stepText: { color: '#aaa', fontSize: 13, lineHeight: 22 },
});

export default NotificationTestScreen;
