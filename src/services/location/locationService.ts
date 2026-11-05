/**
 * @file locationService.ts
 * @description Real-time GPS Location Tracking and Synchronization Service.
 *
 * Responsibilities:
 *  1. Request Android fine & coarse location runtime permissions.
 *  2. Fetch device coordinates via @react-native-community/geolocation.
 *  3. Fallback safely to Bengaluru regional coordinates if GPS is unavailable.
 *  4. Continuously transmit live coordinates to backend during active duty / en route trips.
 */

import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../common/api/apiClient';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

const LAST_LOCATION_KEY = '@clickg_last_known_location';

/** Default fallback coordinates (Bengaluru tech hub) */
const DEFAULT_COORDINATES: LocationCoordinates = {
  latitude: 12.9716,
  longitude: 77.5946,
  timestamp: Date.now(),
};

let trackingInterval: ReturnType<typeof setInterval> | null = null;
let currentTrackingCallback: ((coords: LocationCoordinates) => void) | null = null;

/**
 * Requests location runtime permissions on Android devices.
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  try {
    const fineGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ClickG Location Permission',
        message: 'ClickG requires access to your location to assign nearby jobs and track transit.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    return fineGranted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('[LocationService] Permission request error:', err);
    return false;
  }
}

/**
 * Retrieves the current GPS position of the device.
 */
export function getCurrentPosition(): Promise<LocationCoordinates> {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      position => {
        const coords: LocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading ?? undefined,
          speed: position.coords.speed ?? undefined,
          timestamp: position.timestamp,
        };
        AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(coords)).catch(() => {});
        resolve(coords);
      },
      error => {
        console.warn('[LocationService] getCurrentPosition warning, using fallback:', error.message);
        resolve({
          ...DEFAULT_COORDINATES,
          timestamp: Date.now(),
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      },
    );
  });
}

/**
 * Transmits the latest GPS coordinates to the backend server.
 */
export async function sendLocationUpdate(
  coords: LocationCoordinates,
  jobId?: string,
): Promise<boolean> {
  try {
    const payload = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      heading: coords.heading,
      speed: coords.speed,
      timestamp: coords.timestamp,
      jobId,
    };

    const res = await apiClient.post('/api/v1/person/location/update', payload, {
      timeoutMs: 4000,
    });

    return res.success;
  } catch (err) {
    // Non-blocking: location pings fail silently if network drops or endpoint not implemented yet
    return false;
  }
}

/**
 * Starts periodic GPS tracking (e.g. while ON_DUTY or EN_ROUTE).
 *
 * @param onLocationChange Callback triggered with fresh coordinates.
 * @param intervalMs Frequency of updates (defaults to 20 seconds).
 */
export async function startLocationTracking(
  onLocationChange?: (coords: LocationCoordinates) => void,
  intervalMs = 20000,
  activeJobId?: string,
): Promise<void> {
  stopLocationTracking();

  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    console.warn('[LocationService] Cannot start tracking without location permission');
  }

  currentTrackingCallback = onLocationChange || null;

  // Initial immediate fetch
  const initial = await getCurrentPosition();
  if (currentTrackingCallback) {
    currentTrackingCallback(initial);
  }
  await sendLocationUpdate(initial, activeJobId);

  // Set recurring tracking loop
  trackingInterval = setInterval(async () => {
    const pos = await getCurrentPosition();
    if (currentTrackingCallback) {
      currentTrackingCallback(pos);
    }
    await sendLocationUpdate(pos, activeJobId);
  }, intervalMs);
}

/**
 * Stops any ongoing GPS tracking loop.
 */
export function stopLocationTracking(): void {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  currentTrackingCallback = null;
}

export default {
  requestLocationPermission,
  getCurrentPosition,
  sendLocationUpdate,
  startLocationTracking,
  stopLocationTracking,
};
