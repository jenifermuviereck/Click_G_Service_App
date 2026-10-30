/**
 * @file authService.ts
 * @description High-Level Authentication & Session Management Service.
 *
 * Bridges the UI screens/contexts with the underlying network API (`authApi`) and
 * local persistent storage (`authStorage`), providing a clean, decoupled interface.
 */

import {
  clearAuthToken,
  clearAuthUser,
  getAuthToken,
  getAuthUser,
  saveAuthToken,
  saveAuthUser,
} from '../storage/authStorage';
import {
  sendOtp as sendOtpApi,
  verifyOtp as verifyOtpApi,
  registerPartnerApi,
  AuthApiResponse,
} from '../../common/api/authApi';
import { UserProfile, RegistrationData } from '../../types';

/**
 * Persists an authentication token into secure local storage.
 *
 * @param {string} token - The access token returned by the verification API.
 * @returns {Promise<void>}
 */
export const saveToken = async (token: string): Promise<void> => {
  await saveAuthToken(token);
};

/**
 * Reads the cached authentication token from local storage.
 *
 * @returns {Promise<string | null>} The token string, or null if session has expired / user logged out.
 */
export const getToken = async (): Promise<string | null> => {
  return getAuthToken();
};

/**
 * Saves the authenticated partner's profile to local storage.
 *
 * @param {UserProfile} user - The user profile object.
 * @returns {Promise<void>}
 */
export const saveUser = async (user: UserProfile): Promise<void> => {
  await saveAuthUser(user);
};

/**
 * Retrieves the stored partner user profile.
 *
 * @returns {Promise<UserProfile | null>} The stored user profile or null.
 */
export const getUser = async (): Promise<UserProfile | null> => {
  return getAuthUser();
};

/**
 * Clears all local session credentials (token & profile data) upon user logout.
 *
 * @returns {Promise<void>}
 */
export const logout = async (): Promise<void> => {
  await Promise.all([clearAuthToken(), clearAuthUser()]);
};

/**
 * Dispatches an OTP verification request to a partner's mobile number.
 *
 * @param {string} mobile - 10-digit mobile number.
 * @returns {Promise<AuthApiResponse>} Result of OTP dispatch.
 */
export const sendOtp = async (mobile: string): Promise<AuthApiResponse> => {
  return sendOtpApi({ mobile, flow: 'login' });
};

/**
 * Submits an entered OTP code for verification and retrieves session credentials.
 *
 * @param {string} mobile - 10-digit mobile number.
 * @param {string} otp - 4-digit numeric OTP code.
 * @returns {Promise<AuthApiResponse<UserProfile>>} Session token & user profile if valid.
 */
export const verifyOtp = async (
  mobile: string,
  otp: string,
): Promise<AuthApiResponse<UserProfile>> => {
  return verifyOtpApi({ mobile, otp });
};

/**
 * Submits partner registration form data (personal, KYC documents, bank details) for approval.
 *
 * @param {RegistrationData} data - The complete partner registration form fields.
 * @returns {Promise<AuthApiResponse<UserProfile>>} Registration status and initial profile.
 */
export const registerPartner = async (
  data: RegistrationData,
): Promise<AuthApiResponse<UserProfile>> => {
  return registerPartnerApi(data);
};

export const authService = {
  saveToken,
  getToken,
  saveUser,
  getUser,
  logout,
  sendOtp,
  verifyOtp,
  registerPartner,
};

export default authService;

