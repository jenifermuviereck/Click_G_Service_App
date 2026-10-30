/**
 * @file authApi.ts
 * @description Authentication & Onboarding API Functions.
 *
 * Implements network requests for OTP verification, login, and partner registration.
 * Includes complete TypeScript interfaces and mini-descriptions for every API contract.
 */

import { UserProfile, RegistrationData } from '../../types';
import { mockUserProfile } from '../../data/mockData';

/**
 * Payload sent when requesting an OTP.
 */
export interface SendOtpRequest {
  /** 10-digit mobile number of the service partner */
  mobile: string;
  /** Purpose of the OTP request ('login' or 'register') */
  flow?: 'login' | 'register';
}

/**
 * Payload sent when verifying an entered OTP code.
 */
export interface VerifyOtpRequest {
  /** 10-digit mobile number being verified */
  mobile: string;
  /** 4-digit numeric OTP code entered by the user */
  otp: string;
}

/**
 * Standard API Response structure returned by authentication endpoints.
 */
export interface AuthApiResponse<T = any> {
  /** Indicates whether the operation succeeded */
  success: boolean;
  /** Human-readable status message for Toast/Alert display */
  message: string;
  /** JWT access token returned on successful authentication */
  token?: string;
  /** User profile payload returned on login/verification */
  user?: UserProfile;
  /** Extra response data if applicable */
  data?: T;
  /** Test OTP for sandbox/development environments */
  testOtp?: string;
}

/**
 * Sends a 4-digit verification OTP to the partner's mobile number.
 *
 * @param {SendOtpRequest} data - The mobile number and flow type.
 * @returns {Promise<AuthApiResponse>} Result indicating if OTP was dispatched.
 *
 * @example
 * const res = await sendOtp({ mobile: '9876543210', flow: 'login' });
 * if (res.success) {
 *   console.log('OTP sent successfully');
 * }
 */
export const sendOtp = async (
  data: SendOtpRequest,
): Promise<AuthApiResponse> => {
  // Simulate network latency (500ms)
  await new Promise<void>(resolve => setTimeout(resolve, 500));

  const cleanMobile = data.mobile.trim();

  if (!cleanMobile || cleanMobile.length < 10) {
    return {
      success: false,
      message: 'Please provide a valid 10-digit mobile number',
    };
  }

  return {
    success: true,
    message: `OTP sent successfully to ${cleanMobile}`,
    testOtp: '5975',
  };
};

/**
 * Verifies the 4-digit OTP code against the partner's mobile number.
 *
 * @param {VerifyOtpRequest} data - The mobile number and OTP code.
 * @returns {Promise<AuthApiResponse<UserProfile>>} Authentication token and partner profile on success.
 *
 * @example
 * const res = await verifyOtp({ mobile: '9876543210', otp: '1234' });
 * if (res.success && res.token) {
 *   await saveToken(res.token);
 * }
 */
export const verifyOtp = async (
  data: VerifyOtpRequest,
): Promise<AuthApiResponse<UserProfile>> => {
  // Simulate network latency (600ms)
  await new Promise<void>(resolve => setTimeout(resolve, 600));

  // Accept 4-digit codes
  if (data.otp && data.otp.length === 4) {
    const formattedMobile = data.mobile.startsWith('+91')
      ? data.mobile
      : `+91 ${data.mobile}`;

    const user: UserProfile = {
      ...mockUserProfile,
      mobile: formattedMobile,
    };

    return {
      success: true,
      message: 'OTP verified successfully',
      token: `jwt_partner_${Date.now()}`,
      user,
      data: user,
    };
  }

  return {
    success: false,
    message: 'Invalid OTP code. Please enter a valid 4-digit verification code.',
  };
};

/**
 * Registers a new service partner with identity documents and bank payout details.
 *
 * @param {RegistrationData} data - The registration form payload.
 * @returns {Promise<AuthApiResponse<UserProfile>>} Verification submission response and initial user record.
 *
 * @example
 * const res = await registerPartnerApi(formData);
 * if (res.success) {
 *   // Navigate to pending verification screen
 * }
 */
export const registerPartnerApi = async (
  data: RegistrationData,
): Promise<AuthApiResponse<UserProfile>> => {
  // Simulate network latency (700ms)
  await new Promise<void>(resolve => setTimeout(resolve, 700));

  const newPartner: UserProfile = {
    id: `partner-${Date.now()}`,
    name: data.fullName || 'Kumar',
    mobile: data.mobile || '+91 98765 43210',
    email: data.email,
    city: data.city || 'Bengaluru',
    experienceYears: data.experienceYears || '5',
    status: 'offline',
    verified: false,
    registrationRef: 'CG-P-2084',
  };

  return {
    success: true,
    message: 'Partner registration submitted successfully for review.',
    token: `jwt_registered_${Date.now()}`,
    user: newPartner,
    data: newPartner,
  };
};

