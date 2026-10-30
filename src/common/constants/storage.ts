/**
 * @file storage.ts
 * @description Storage Key Constants for ClickG Service App.
 *
 * This file defines centralized, immutable keys used with AsyncStorage.
 * Centralizing keys prevents typos and ensures cache consistency across the application.
 */

export const StorageKeys = {
  /** Key for storing the user authentication JWT token */
  TOKEN: '@ClickGService:authToken',

  /** Key for storing serialized partner user profile */
  USER: '@ClickGService:userProfile',

  /** Key for storing service partner online/offline duty status */
  ONLINE_STATUS: '@ClickGService:onlineStatus',

  /** Key for storing user language preferences */
  LANGUAGE: '@ClickGService:language',

  /** Key for storing UI theme preferences */
  THEME: '@ClickGService:theme',
} as const;

export default StorageKeys;

