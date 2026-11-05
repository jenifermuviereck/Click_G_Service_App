/**
 * @file AuthContext.tsx
 * @description Global Authentication, Attendance, Device FCM & GPS Location State Context.
 *
 * Implements session management, active duty status via Attendance API,
 * background GPS location tracking, and FCM push token registration.
 */

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  getToken,
  getUser,
  logout as logoutService,
  saveToken,
  saveUser,
} from './authService';
import {
  getOnlineStatus,
  saveOnlineStatus,
} from '../storage/authStorage';
import {
  getCurrentAttendance,
  enableAttendance,
  disableAttendance,
} from '../../common/api/attendanceApi';
import { logoutApi } from '../../common/api/authApi';
import {
  syncDeviceToken,
  setupTokenRefreshListener,
} from '../notifications/deviceTokenService';
import {
  getCurrentPosition,
  startLocationTracking,
  stopLocationTracking,
} from '../location/locationService';
import { UserProfile } from '../../types';
import profileApi from '../../common/api/profileApi';
import { BASE_URL } from '../../common/api/apiClient';

export interface AuthContextValue {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  token: string | null;
  isOnline: boolean;
  setAuthenticated: (value: boolean) => void;
  login: (token: string, user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  toggleOnlineStatus: (override?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value);
  }, []);

  /**
   * Restores stored session credentials, registers device push token,
   * and synchronizes online/duty status on initial app launch.
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [savedToken, savedUser, savedOnline] = await Promise.all([
          getToken(),
          getUser(),
          getOnlineStatus(),
        ]);

        if (savedToken) {
          setToken(savedToken);
          setIsAuthenticated(true);

          // 1. Sync FCM Push Token
          syncDeviceToken().catch(() => {});

          // 2. Synchronize real-time on-duty status from backend attendance
          try {
            const attendanceRes = await getCurrentAttendance();
            if (attendanceRes.success && attendanceRes.data) {
              const liveOnDuty = Boolean(attendanceRes.data.isOnDuty);
              setIsOnline(liveOnDuty);
              await saveOnlineStatus(liveOnDuty);

              if (liveOnDuty) {
                startLocationTracking().catch(() => {});
              }
            } else {
              setIsOnline(savedOnline);
              if (savedOnline) {
                startLocationTracking().catch(() => {});
              }
            }
          } catch {
            setIsOnline(savedOnline);
          }
        } else {
          setIsAuthenticated(false);
          setIsOnline(false);
        }

        if (savedUser) {
          setUser(savedUser);
        }

        // 3. Keep profile, avatar, and verification status synchronized with server
        if (savedToken) {
          try {
            const profileRes = await profileApi.getProfile();
            if (profileRes.success && profileRes.data) {
              const p = profileRes.data;
              const fullAvatar = p.avatarUrl
                ? (p.avatarUrl.startsWith('http') ? p.avatarUrl : `${BASE_URL}/${p.avatarUrl.replace(/^\//, '')}`)
                : (savedUser?.avatarUrl || undefined);

              const freshUser: UserProfile = {
                ...(savedUser || {
                  id: p.id,
                  mobile: p.phone,
                  status: 'offline',
                  verified: p.status === 'APPROVED',
                }),
                name: p.fullName || savedUser?.name || 'Partner',
                avatarUrl: fullAvatar,
                email: p.email || savedUser?.email,
                verified: p.status === 'APPROVED',
              };
              setUser(freshUser);
              saveUser(freshUser).catch(() => {});
            }
          } catch (profileErr) {
            console.warn('[AuthContext] Profile sync deferred:', profileErr);
          }
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();

    // Listen to Firebase token refresh
    const unsubscribeToken = setupTokenRefreshListener();
    return () => {
      unsubscribeToken();
      stopLocationTracking();
    };
  }, []);

  /**
   * Saves credentials to storage, registers FCM token, and updates context state.
   */
  const login = useCallback(
    async (newToken: string, newUser: UserProfile): Promise<void> => {
      try {
        await Promise.all([saveToken(newToken), saveUser(newUser)]);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);

        // Register FCM Push Token on login
        syncDeviceToken().catch(() => {});

        // Fetch initial attendance on login
        try {
          const attendanceRes = await getCurrentAttendance();
          if (attendanceRes.success && attendanceRes.data) {
            const onDuty = Boolean(attendanceRes.data.isOnDuty);
            setIsOnline(onDuty);
            if (onDuty) {
              startLocationTracking().catch(() => {});
            }
          }
        } catch {
          // Keep offline by default until toggled
        }
      } catch (err) {
        console.warn('Error saving login state:', err);
      }
    },
    [],
  );

  /**
   * Clears session credentials, stops tracking, and resets context state.
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      stopLocationTracking();
      if (isOnline) {
        try {
          await disableAttendance();
        } catch {}
      }
      await logoutApi();
      await logoutService();
      setToken(null);
      setUser(null);
      setIsOnline(false);
      setIsAuthenticated(false);
    } catch (err) {
      console.warn('Error logging out:', err);
      stopLocationTracking();
      await logoutService();
      setToken(null);
      setUser(null);
      setIsOnline(false);
      setIsAuthenticated(false);
    }
  }, [isOnline]);

  const updateUser = useCallback(
    async (updates: Partial<UserProfile>): Promise<void> => {
      if (!user) return;
      const updatedUser: UserProfile = { ...user, ...updates };
      setUser(updatedUser);
      try {
        await saveUser(updatedUser);
      } catch (err) {
        console.warn('Error updating stored user profile:', err);
      }
    },
    [user],
  );

  /**
   * Switches partner between online (with live GPS tracking) and offline modes.
   */
  const toggleOnlineStatus = useCallback(
    async (override?: boolean): Promise<void> => {
      const nextStatus = override !== undefined ? override : !isOnline;
      setIsOnline(nextStatus);
      await saveOnlineStatus(nextStatus);

      try {
        if (nextStatus) {
          // Fetch current GPS coordinates and start live tracking
          const coords = await getCurrentPosition();
          startLocationTracking(undefined, 20000).catch(() => {});

          const res = await enableAttendance({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          if (!res.success) {
            console.warn('[Attendance] enableAttendance warning:', res.message);
          }
        } else {
          stopLocationTracking();
          const res = await disableAttendance();
          if (!res.success) {
            console.warn('[Attendance] disableAttendance warning:', res.message);
          }
        }
      } catch (err) {
        console.warn('Error syncing online/attendance status with backend:', err);
      }
    },
    [isOnline],
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        isLoading: isAuthLoading,
        user,
        token,
        isOnline,
        setAuthenticated,
        login,
        logout,
        updateUser,
        toggleOnlineStatus,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export default AuthContext;
