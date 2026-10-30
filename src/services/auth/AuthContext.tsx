/**
 * @file AuthContext.tsx
 * @description Global Authentication & Partner State Context.
 *
 * Implements the session management provider for ClickG Service App, matching the
 * architectural pattern of the Driver App. Handles session restoration on app startup,
 * token caching, user profile updates, and active duty status.
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
import { UserProfile } from '../../types';

/**
 * Shape of the Authentication Context state and dispatch actions.
 */
export interface AuthContextValue {
  /** True when the user is logged in with an active access token */
  isAuthenticated: boolean;

  /** True while the session is being restored from local storage on app startup */
  isAuthLoading: boolean;

  /** Alias for isAuthLoading to maintain backward compatibility with existing screens */
  isLoading: boolean;

  /** The active service partner's profile object */
  user: UserProfile | null;

  /** The active session bearer JWT token string */
  token: string | null;

  /** Online/Offline job acceptance status of the service partner */
  isOnline: boolean;

  /** Explicitly updates the authenticated flag */
  setAuthenticated: (value: boolean) => void;

  /** Logs in the user with an access token and user profile */
  login: (token: string, user: UserProfile) => Promise<void>;

  /** Clears local credentials and logs out the user */
  logout: () => Promise<void>;

  /** Updates fields on the cached user profile */
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;

  /** Toggles or explicitly sets the partner's online availability status */
  toggleOnlineStatus: (override?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Root Authentication Provider component.
 *
 * Wrap this near the root of the React Native component tree to make
 * authentication state accessible anywhere via the `useAuth()` hook.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  /**
   * Directly sets the authentication state.
   */
  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value);
  }, []);

  /**
   * Restores stored session credentials and online status on initial application launch.
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
        } else {
          setIsAuthenticated(false);
        }

        if (savedUser) {
          setUser(savedUser);
        }

        setIsOnline(savedOnline);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Saves credentials to storage and updates context state upon successful login/verification.
   */
  const login = useCallback(
    async (newToken: string, newUser: UserProfile): Promise<void> => {
      try {
        await Promise.all([saveToken(newToken), saveUser(newUser)]);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.warn('Error saving login state:', err);
      }
    },
    [],
  );

  /**
   * Clears cached token and profile from storage and resets context state.
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutService();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.warn('Error logging out:', err);
    }
  }, []);

  /**
   * Updates partner profile attributes both in state and in local storage.
   */
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
   * Switches the partner between online (accepting jobs) and offline modes.
   */
  const toggleOnlineStatus = useCallback(
    async (override?: boolean): Promise<void> => {
      const nextStatus = override !== undefined ? override : !isOnline;
      setIsOnline(nextStatus);
      try {
        await saveOnlineStatus(nextStatus);
      } catch (err) {
        console.warn('Error persisting online status:', err);
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

/**
 * Custom hook to consume the current Authentication state.
 *
 * @throws {Error} If called outside of an `<AuthProvider />`.
 * @returns {AuthContextValue} The auth state and action helpers.
 *
 * @example
 * const { isAuthenticated, user, logout } = useAuth();
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};

export default AuthContext;

