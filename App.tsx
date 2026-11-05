/**
 * @file App.tsx — Click G Service App
 * @description Root component. Wires Firebase push notifications into the app.
 *
 * What happens here:
 *  1. useNotifications() hook initialises FCM on app start
 *  2. lastJob updates when a push arrives in the foreground
 *  3. <NotificationToast> shows an animated in-app banner for new jobs
 */

import './global.css';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { JobProvider, useJobs } from './src/context/JobContext';
import { useNotifications } from './src/services/notifications/useNotifications';
import { NotificationToast } from './src/components/NotificationToast';
import { InAppToast } from './src/components/InAppToast';
import { JobNotificationPayload } from './src/services/notifications';

// ─── Inner component (has access to all context values) ───────────────────────
const AppContent = () => {
  const { isDark } = useAppTheme();
  const { user }   = useAuth();
  const { acceptJob, rejectJob } = useJobs();

  // 🔔 Initialise FCM: channels, permissions, token, listeners
  const { lastJob } = useNotifications(user?.id);

  // Track the job to show in the in-app toast
  const [toastJob, setToastJob] = useState<JobNotificationPayload | null>(null);

  // When a foreground push arrives, display the in-app banner
  useEffect(() => {
    if (lastJob) { setToastJob(lastJob); }
  }, [lastJob]);

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppNavigator />

      {/* Modern In-App Animated Toast notification for all internal app alerts & actions */}
      <InAppToast />

      {/* In-app notification banner — slides in when a new job arrives */}
      <NotificationToast
        job={toastJob}
        onAccept={(job) => {
          acceptJob(job.jobId);   // update local job state
          setToastJob(null);
        }}
        onReject={(job) => {
          rejectJob(job.jobId);
          setToastJob(null);
        }}
        onDismiss={() => setToastJob(null)}
      />
    </>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────
const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <JobProvider>
            <AppContent />
          </JobProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
