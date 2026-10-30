/**
 * @file authStorage.ts
 * @description Local Secure Storage Layer for Authentication.
 *
 * Encapsulates all persistent AsyncStorage reads and writes for authentication tokens,
 * user credentials, and active driver/partner duty status.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../../common/constants/storage';
import { UserProfile } from '../../types';

/**
 * Saves the authentication bearer token into local device storage.
 *
 * @param {string} token - The JWT or session access token.
 * @returns {Promise<void>}
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(StorageKeys.TOKEN, token);
};

/**
 * Retrieves the stored authentication bearer token.
 *
 * @returns {Promise<string | null>} The access token string or null if unauthenticated.
 */
export const getAuthToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(StorageKeys.TOKEN);
};

/**
 * Removes the authentication bearer token from local storage (used during logout).
 *
 * @returns {Promise<void>}
 */
export const clearAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(StorageKeys.TOKEN);
};

/**
 * Persists the partner's user profile object into local storage as JSON.
 *
 * @param {UserProfile} user - The user profile data object.
 * @returns {Promise<void>}
 */
export const saveAuthUser = async (user: UserProfile): Promise<void> => {
  await AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(user));
};

/**
 * Reads and deserializes the stored partner user profile.
 *
 * @returns {Promise<UserProfile | null>} The user profile object or null if not found.
 */
export const getAuthUser = async (): Promise<UserProfile | null> => {
  try {
    const raw = await AsyncStorage.getItem(StorageKeys.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Removes the stored user profile from local storage.
 *
 * @returns {Promise<void>}
 */
export const clearAuthUser = async (): Promise<void> => {
  await AsyncStorage.removeItem(StorageKeys.USER);
};

/**
 * Saves the service partner's online/offline availability switch status.
 *
 * @param {boolean} isOnline - True if partner is accepting new jobs, false if offline.
 * @returns {Promise<void>}
 */
export const saveOnlineStatus = async (isOnline: boolean): Promise<void> => {
  await AsyncStorage.setItem(StorageKeys.ONLINE_STATUS, String(isOnline));
};

/**
 * Retrieves the persisted online/offline status.
 *
 * @returns {Promise<boolean>} Current availability status (defaults to false if unset).
 */
export const getOnlineStatus = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(StorageKeys.ONLINE_STATUS);
    return val === 'true';
  } catch {
    return false;
  }
};

