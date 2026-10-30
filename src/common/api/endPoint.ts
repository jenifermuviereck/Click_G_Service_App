/**
 * @file endPoint.ts
 * @description API Endpoint URI Constants.
 *
 * All backend API routes are mapped here in one central location.
 * When backend URL paths change, updating them here updates all API callers automatically.
 */

export const ENDPOINTS = {
  // Authentication & Partner Onboarding Endpoints
  /** Endpoint to trigger SMS OTP delivery */
  SEND_OTP: '/auth/send-otp',

  /** Endpoint to verify OTP and obtain an auth session token */
  VERIFY_OTP: '/auth/verify-otp',

  /** Endpoint to register a new service partner profile with documents */
  REGISTER_PARTNER: '/auth/register-partner',

  /** Endpoint to end active session */
  LOGOUT: '/auth/logout',

  // Service Jobs Endpoints
  /** Endpoint to list available/assigned service job requests */
  SERVICE_REQUESTS: '/service/requests',

  /** Endpoint to accept an assigned service job */
  ACCEPT_JOB: '/service/jobs/accept',

  /** Endpoint to reject an assigned service job */
  REJECT_JOB: '/service/jobs/reject',

  /** Endpoint to complete service and upload before/after photos */
  COMPLETE_JOB: '/service/jobs/complete',

  // Profile & Earnings
  /** Endpoint to fetch partner profile & verification status */
  PROFILE: '/service/partner/profile',

  /** Endpoint to fetch earnings summary and transaction history */
  EARNINGS: '/service/partner/earnings',
} as const;

export default ENDPOINTS;

