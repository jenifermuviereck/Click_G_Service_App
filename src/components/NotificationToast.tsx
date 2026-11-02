/**
 * @file NotificationToast.tsx
 * @description In-app animated banner that appears at the top of the screen
 * when a new job push arrives while the serviceman is actively using the app.
 *
 * Features:
 *  - Slides down from top with spring animation
 *  - Shows job details: title, customer, address, amount
 *  - Accept / Reject action buttons
 *  - Auto-dismisses after 8 seconds
 *  - Manual dismiss via ✕ button
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { JobNotificationPayload } from '../services/notifications';

interface NotificationToastProps {
  /** The job payload to display. Pass `null` to hide the toast. */
  job: JobNotificationPayload | null;
  onAccept: (job: JobNotificationPayload) => void;
  onReject: (job: JobNotificationPayload) => void;
  onDismiss: () => void;
  /** Auto-dismiss timeout in ms. Default 8000 (8 seconds). */
  autoDismissMs?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  job,
  onAccept,
  onReject,
  onDismiss,
  autoDismissMs = 8000,
}) => {
  const translateY = useRef(new Animated.Value(-200)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Slide in when a new job arrives ───────────────────────────────────────
  useEffect(() => {
    if (!job) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 6,
    }).start();

    timerRef.current = setTimeout(slideOut, autoDismissMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  const slideOut = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(translateY, {
      toValue: -200,
      duration: 280,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  if (!job) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>

      {/* ── Header Bar ──────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔔</Text>
        <Text style={styles.headerTitle}>New Job Request!</Text>
        <TouchableOpacity onPress={slideOut} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* ── Job Details ─────────────────────────────────────────────────── */}
      <View style={styles.body}>
        <Text style={styles.jobTitle}>{job.jobTitle}</Text>
        <Text style={styles.detail}>👤 {job.customerName}</Text>
        <Text style={styles.detail}>📍 {job.address}</Text>
        <Text style={styles.amount}>₹ {job.amount}</Text>
      </View>

      {/* ── Action Buttons ──────────────────────────────────────────────── */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.rejectBtn]}
          activeOpacity={0.7}
          onPress={() => { onReject(job); slideOut(); }}>
          <Text style={styles.rejectBtnText}>❌ Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.acceptBtn]}
          activeOpacity={0.7}
          onPress={() => { onAccept(job); slideOut(); }}>
          <Text style={styles.acceptBtnText}>✅ Accept</Text>
        </TouchableOpacity>
      </View>

    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    margin: 12,
    borderRadius: 16,
    backgroundColor: '#1E1E2E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerIcon: { fontSize: 18, marginRight: 8 },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  closeBtn: { padding: 4 },
  closeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  body: { padding: 14 },
  jobTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 6 },
  detail: { color: '#aaa', fontSize: 13, marginBottom: 3, lineHeight: 20 },
  amount: { color: '#4CAF50', fontWeight: '800', fontSize: 22, marginTop: 6 },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2D2D45',
  },
  btn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  rejectBtn: { borderRightWidth: 1, borderRightColor: '#2D2D45' },
  acceptBtn: { backgroundColor: '#FF6B0015' },
  rejectBtnText: { color: '#FF5252', fontWeight: '600', fontSize: 14 },
  acceptBtnText: { color: '#FF6B00', fontWeight: '700', fontSize: 15 },
});

export default NotificationToast;
