/**
 * @file endPoint.ts
 * @description Centralized API Endpoint URI mappings for Click G Service App.
 *
 * Mapped directly from Swagger documentation:
 * https://cliickgserviceman.yetloapps.com/api/docs/Person-App
 */

export const ENDPOINTS = {
  // ── Authentication & Onboarding ──────────────────────────────────────────
  AUTH: {
    /** Self-register new professional applicant and dispatch verification OTP */
    REGISTER: '/api/v1/person/auth/register',
    /** Submit first valid onboarding data to create permanent profile and authenticate */
    ONBOARDING_START: '/api/v1/person/auth/onboarding/start',
    /** Alias for completing onboarding registration */
    COMPLETE_REGISTRATION: '/api/v1/person/auth/complete-registration',
    /** Request 5-digit login OTP for registered serviceman */
    SEND_OTP: '/api/v1/person/auth/send-otp',
    /** Resend 5-digit login OTP */
    RESEND_OTP: '/api/v1/person/auth/resend-otp',
    /** Verify 5-digit OTP and authenticate serviceman (returns accessToken, refreshToken) */
    VERIFY_OTP: '/api/v1/person/auth/verify-otp',
    /** Rotate refresh token and issue new token pair */
    REFRESH_TOKEN: '/api/v1/person/auth/refresh-token',
    /** Log out serviceman and revoke active session */
    LOGOUT: '/api/v1/person/auth/logout',
  },

  // ── Daily Shift Attendance ────────────────────────────────────────────────
  ATTENDANCE: {
    /** Enable daily attendance / start shift session (on-duty) */
    ENABLE: '/api/v1/person/attendance/enable',
    /** Disable daily attendance / end shift session (off-duty) */
    DISABLE: '/api/v1/person/attendance/disable',
    /** Get current on-duty status and today summary */
    CURRENT: '/api/v1/person/attendance/current',
    /** Get historical attendance summaries */
    HISTORY: '/api/v1/person/attendance/history',
  },

  // ── Professional Profile & Verification ───────────────────────────────────
  PROFILE: {
    /** Retrieve profile details for authenticated professional */
    GET: '/api/v1/person/profile',
    /** Update personal details */
    UPDATE: '/api/v1/person/profile',
    /** Upload KYC document image/pdf (multipart/form-data) */
    KYC_UPLOAD: '/api/v1/person/profile/kyc/upload',
    /** Upload profile avatar image (multipart/form-data) */
    AVATAR_UPLOAD: '/api/v1/person/profile/avatar',
    /** Update residential address */
    ADDRESS: '/api/v1/person/profile/address',
    /** Update KYC document metadata numbers (Aadhaar, PAN, DL) */
    KYC_DETAILS: '/api/v1/person/profile/kyc/details',
    /** Update bank account & UPI details for payouts */
    BANK: '/api/v1/person/profile/bank',
    /** Update skill categories & service areas */
    WORK_SELECTION: '/api/v1/person/profile/work-selection',
    /** Check onboarding progress */
    ONBOARDING_PROGRESS: '/api/v1/person/onboarding/progress',
    /** Submit onboarding step */
    ONBOARDING_SUBMIT: '/api/v1/person/onboarding/submit',
  },

  // ── Public Service Catalog ────────────────────────────────────────────────
  CATALOG: {
    /** List active service categories */
    CATEGORIES: '/api/v1/person/catalog/categories',
    /** List active skills */
    SKILLS: '/api/v1/person/catalog/skills',
    /** List active geographical service areas */
    SERVICE_AREAS: '/api/v1/person/catalog/service-areas',
  },

  // ── Service Jobs Execution ────────────────────────────────────────────────
  JOBS: {
    /** List assigned jobs with optional status filter */
    LIST: '/api/v1/person/jobs',
    /** Get assigned job execution details by UUID */
    DETAIL: (id: string) => `/api/v1/person/jobs/${id}`,
    /** Get job details by human-readable job number (e.g. JB-2026-000001) */
    BY_NO: (jobNo: string) => `/api/v1/person/jobs/by-no/${jobNo}`,
    /** Accept an assigned job */
    ACCEPT: (id: string) => `/api/v1/person/jobs/${id}/accept`,
    /** Decline an assigned job with reason */
    DECLINE: (id: string) => `/api/v1/person/jobs/${id}/decline`,
    /** Signal transit to customer location */
    EN_ROUTE: (id: string) => `/api/v1/person/jobs/${id}/en-route`,
    /** Signal arrival at customer location */
    ARRIVED: (id: string) => `/api/v1/person/jobs/${id}/arrived`,
    /** Verify customer start OTP and start work */
    START: (id: string) => `/api/v1/person/jobs/${id}/start`,
    /** Complete job and record completion notes */
    COMPLETE: (id: string) => `/api/v1/person/jobs/${id}/complete`,
    /** Upload photographic evidence (before/after photos) */
    EVIDENCE: (id: string) => `/api/v1/person/jobs/${id}/evidence`,
    /** Extra work quotes/requests */
    EXTRA_WORK: (id: string) => `/api/v1/person/jobs/${id}/extra-work`,
  },

  // ── Financial & Wallet ────────────────────────────────────────────────────
  FINANCIAL: {
    /** Get financial and wallet summary (gross, net, pending) */
    SUMMARY: '/api/v1/person/financial/summary',
    /** Get fixed-salary / payout earnings history */
    EARNINGS: '/api/v1/person/financial/earnings',
    /** Get financial ledger transactions */
    LEDGER: '/api/v1/person/financial/ledger',
    /** Get current salary configuration */
    SALARY: '/api/v1/person/financial/salary',
    /** Get pending deductions */
    PENDING_DEDUCTIONS: '/api/v1/person/financial/pending-deductions',
  },

  // ── FCM Push Token (Planned / Standard Route) ─────────────────────────────
  NOTIFICATIONS: {
    /** Register FCM device token for push notifications */
    REGISTER_DEVICE: '/api/v1/person/device/register',
  },
} as const;

export default ENDPOINTS;
