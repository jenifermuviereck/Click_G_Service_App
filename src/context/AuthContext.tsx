import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';
import { mockUserProfile } from '../data/mockData';

const AUTH_USER_KEY = '@clickg_service_user';
const AUTH_TOKEN_KEY = '@clickg_service_token';
const ONLINE_STATUS_KEY = '@clickg_service_online_status';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnline: boolean;
  login: (token: string, user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  toggleOnlineStatus: (status?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(mockUserProfile);
  const [token, setToken] = useState<string | null>('mock-service-token');
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [savedToken, savedUser, savedOnline] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
          AsyncStorage.getItem(ONLINE_STATUS_KEY),
        ]);

        if (savedToken) {
          setToken(savedToken);
        }
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedOnline !== null) {
          setIsOnline(savedOnline === 'true');
        }
      } catch (e) {
        console.warn('Failed to load local auth session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (newToken: string, newUser: UserProfile) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken),
        AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser)),
      ]);
      setToken(newToken);
      setUser(newUser);
    } catch (e) {
      console.warn('Error saving login state:', e);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(AUTH_USER_KEY),
      ]);
      setToken(null);
      setUser(null);
    } catch (e) {
      console.warn('Error logging out:', e);
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error updating user state:', e);
    }
  };

  const toggleOnlineStatus = async (override?: boolean) => {
    const nextStatus = override !== undefined ? override : !isOnline;
    setIsOnline(nextStatus);
    try {
      await AsyncStorage.setItem(ONLINE_STATUS_KEY, String(nextStatus));
    } catch (e) {
      console.warn('Error saving online status:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isOnline,
        login,
        logout,
        updateUser,
        toggleOnlineStatus,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
