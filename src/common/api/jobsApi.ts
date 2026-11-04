/**
 * @file jobsApi.ts
 * @description Assigned Jobs & Service Execution API for Click G Service App.
 *
 * Mapped to Swagger Person-App-Jobs endpoints:
 * https://cliickgserviceman.yetloapps.com/api/docs/Person-App#/Person-App-Jobs
 */

import apiClient, { ApiResponse } from './apiClient';
import { ENDPOINTS } from './endPoint';

export type JobStatus =
  | 'BROADCASTED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export interface PersonJobAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface PersonJobItem {
  id: string;
  serviceName: string;
  quantity: number;
  unitPrice?: string;
  totalPrice?: string;
}

export interface PersonJobBooking {
  id: string;
  bookingNo: string;
  serviceDate: string;
  customerName?: string;
  customerPhoneMasked?: string;
  customerNotes?: string;
  address?: PersonJobAddress;
  items?: PersonJobItem[];
}

export interface PersonJobEvidence {
  id: string;
  mediaType: 'BEFORE_WORK' | 'AFTER_WORK' | 'CUSTOMER_SIGNATURE' | 'DAMAGE_RECORD';
  mediaUrl: string;
  notes?: string;
  createdAt: string;
}

export interface PersonJobDetail {
  id: string;
  jobNo: string;
  status: JobStatus;
  startedAt?: string;
  completedAt?: string;
  completionNotes?: string;
  otpAttempts?: number;
  otpVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  booking?: PersonJobBooking;
  evidence?: PersonJobEvidence[];
}

export interface PaginatedJobsResponse {
  items: PersonJobDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Lists assigned jobs with optional status filter (e.g. 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED')
 */
export const getJobs = async (
  status?: JobStatus,
  page = 1,
  limit = 20,
): Promise<ApiResponse<PaginatedJobsResponse>> => {
  let url = `${ENDPOINTS.JOBS.LIST}?page=${page}&limit=${limit}`;
  if (status) {
    url += `&status=${status}`;
  }
  return apiClient.get<PaginatedJobsResponse>(url);
};

/**
 * Gets job details by UUID
 */
export const getJobDetail = async (jobId: string): Promise<ApiResponse<PersonJobDetail>> => {
  return apiClient.get<PersonJobDetail>(ENDPOINTS.JOBS.DETAIL(jobId));
};

/**
 * Gets job details by human-readable Job Number (e.g. JB-2026-000001)
 */
export const getJobByNo = async (jobNo: string): Promise<ApiResponse<PersonJobDetail>> => {
  return apiClient.get<PersonJobDetail>(ENDPOINTS.JOBS.BY_NO(jobNo));
};

/**
 * Accepts an assigned job
 */
export const acceptJob = async (jobId: string): Promise<ApiResponse<PersonJobDetail>> => {
  return apiClient.post<PersonJobDetail>(ENDPOINTS.JOBS.ACCEPT(jobId), {});
};

/**
 * Declines an assigned job with a reason
 */
export const declineJob = async (
  jobId: string,
  reason: string,
): Promise<ApiResponse> => {
  return apiClient.post(ENDPOINTS.JOBS.DECLINE(jobId), { reason });
};

/**
 * Signals that the serviceman is en route to customer location
 */
export const transitionEnRoute = async (jobId: string): Promise<ApiResponse> => {
  return apiClient.post(ENDPOINTS.JOBS.EN_ROUTE(jobId), {});
};

/**
 * Signals arrival at the customer location
 */
export const transitionArrived = async (jobId: string): Promise<ApiResponse> => {
  return apiClient.post(ENDPOINTS.JOBS.ARRIVED(jobId), {});
};

/**
 * Verifies customer 4-digit start OTP and begins job execution
 */
export const startJobWithOtp = async (
  jobId: string,
  startOtp: string,
): Promise<ApiResponse<PersonJobDetail>> => {
  return apiClient.post<PersonJobDetail>(ENDPOINTS.JOBS.START(jobId), {
    otp: startOtp.trim(),
  });
};

/**
 * Completes job and records sign-off notes
 */
export const completeJob = async (
  jobId: string,
  completionNotes?: string,
): Promise<ApiResponse<PersonJobDetail>> => {
  return apiClient.post<PersonJobDetail>(ENDPOINTS.JOBS.COMPLETE(jobId), {
    completionNotes: completionNotes || 'Work completed successfully',
  });
};

/**
 * Uploads photographic evidence (before/after photos) for a job
 */
export const uploadJobEvidence = async (
  jobId: string,
  formData: FormData,
): Promise<ApiResponse> => {
  return apiClient.upload(ENDPOINTS.JOBS.EVIDENCE(jobId), formData);
};

export default {
  getJobs,
  getJobDetail,
  getJobByNo,
  acceptJob,
  declineJob,
  transitionEnRoute,
  transitionArrived,
  startJobWithOtp,
  completeJob,
  uploadJobEvidence,
};

