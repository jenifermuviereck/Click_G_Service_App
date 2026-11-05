import { Platform, Alert } from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastPayload {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

type ToastListener = (toast: ToastPayload) => void;

let listeners: ToastListener[] = [];

/**
 * Subscribes a listener to in-app toast events.
 */
export const subscribeToast = (fn: ToastListener): (() => void) => {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
};

/**
 * Triggers an in-app animated toast banner for all app events.
 *
 * @param msg - The message to display
 * @param type - Optional visual theme ('success' | 'error' | 'info' | 'warning')
 * @param title - Optional header title
 */
export const showNotification = (
  msg: string,
  type: ToastType = 'success',
  title?: string,
): void => {
  if (!msg) return;

  const toast: ToastPayload = {
    id: `${Date.now()}_${Math.random()}`,
    message: msg,
    type,
    title,
  };

  // Broadcast to in-app toast subscribers
  listeners.forEach(fn => {
    try {
      fn(toast);
    } catch (e) {
      console.warn('Toast listener error:', e);
    }
  });
};

export default showNotification;
