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

export interface ExtraWorkItemInput {
  name: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface CreateExtraWorkPayload {
  description?: string;
  additionalCost?: number;
  items?: ExtraWorkItemInput[];
  labourCharges?: number;
  paymentMethod?: 'GATEWAY' | 'CASH' | 'DIRECT_UPI' | 'RAZORPAY';
  customerNotes?: string;
}

export interface UpdateExtraWorkPayload {
  description?: string;
  items?: ExtraWorkItemInput[];
  labourCharges?: number;
  paymentMethod?: 'GATEWAY' | 'CASH' | 'DIRECT_UPI' | 'RAZORPAY';
  customerNotes?: string;
}

export interface CollectDirectPaymentPayload {
  paymentMethod: 'CASH' | 'DIRECT_UPI';
  amount: number;
  paymentReference?: string;
  collectionNotes?: string;
}

export interface ExtraWorkRequest {
  id: string;
  jobId: string;
  description: string;
  additionalCost: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CANCELLED';
  paymentMethod: string;
  items?: any[];
  labourCharges?: number;
  customerNotes?: string;
  receiptUrl?: string;
  evidenceUrl?: string;
  createdAt: string;
}

/**
 * Uploads photographic evidence (before/after photos) for a job
 */
export const uploadJobEvidence = async (
  jobId: string,
  formData: FormData,
): Promise<ApiResponse> => {
  return apiClient.upload(ENDPOINTS.JOBS.EVIDENCE(jobId), formData);
};

/**
 * Retrieves photographic evidence list for an assigned job by UUID
 */
export const getJobEvidence = async (jobId: string): Promise<ApiResponse<PersonJobEvidence[]>> => {
  return apiClient.get<PersonJobEvidence[]>(ENDPOINTS.JOBS.EVIDENCE(jobId));
};

/**
 * Retrieves photographic evidence list for an assigned job by human-readable job number
 */
export const getJobEvidenceByNo = async (jobNo: string): Promise<ApiResponse<PersonJobEvidence[]>> => {
  return apiClient.get<PersonJobEvidence[]>(ENDPOINTS.JOBS.EVIDENCE_BY_NO(jobNo));
};

/**
 * Submits an extra-work quotation request for an assigned job
 */
export const createExtraWork = async (
  jobId: string,
  data: CreateExtraWorkPayload,
): Promise<ApiResponse<ExtraWorkRequest>> => {
  return apiClient.post<ExtraWorkRequest>(ENDPOINTS.JOBS.EXTRA_WORK(jobId), data);
};

/**
 * Lists all extra-work quotation requests for an assigned job
 */
export const listExtraWork = async (jobId: string): Promise<ApiResponse<ExtraWorkRequest[]>> => {
  return apiClient.get<ExtraWorkRequest[]>(ENDPOINTS.JOBS.EXTRA_WORK(jobId));
};

/**
 * Retrieves details of a specific extra-work request
 */
export const getExtraWorkDetail = async (
  jobId: string,
  requestId: string,
): Promise<ApiResponse<ExtraWorkRequest>> => {
  return apiClient.get<ExtraWorkRequest>(ENDPOINTS.JOBS.EXTRA_WORK_DETAIL(jobId, requestId));
};

/**
 * Updates an unpaid extra-work quotation request
 */
export const updateExtraWork = async (
  jobId: string,
  requestId: string,
  data: UpdateExtraWorkPayload,
): Promise<ApiResponse<ExtraWorkRequest>> => {
  return apiClient.patch<ExtraWorkRequest>(ENDPOINTS.JOBS.EXTRA_WORK_DETAIL(jobId, requestId), data);
};

/**
 * Uploads supporting expense receipt/invoice for an extra-work request
 */
export const uploadExtraWorkReceipt = async (
  jobId: string,
  requestId: string,
  formData: FormData,
): Promise<ApiResponse> => {
  return apiClient.upload(ENDPOINTS.JOBS.EXTRA_WORK_RECEIPT(jobId, requestId), formData);
};

/**
 * Uploads photographic evidence for an extra-work request
 */
export const uploadExtraWorkEvidence = async (
  jobId: string,
  requestId: string,
  formData: FormData,
): Promise<ApiResponse> => {
  return apiClient.upload(ENDPOINTS.JOBS.EXTRA_WORK_EVIDENCE(jobId, requestId), formData);
};

/**
 * Cancels an unpaid extra-work request
 */
export const cancelExtraWork = async (
  jobId: string,
  requestId: string,
): Promise<ApiResponse> => {
  return apiClient.post(ENDPOINTS.JOBS.EXTRA_WORK_CANCEL(jobId, requestId), {});
};

/**
 * Collects direct Cash or UPI payment for approved extra-work
 */
export const collectDirectPayment = async (
  jobId: string,
  requestId: string,
  data: CollectDirectPaymentPayload,
): Promise<ApiResponse> => {
  return apiClient.post(ENDPOINTS.JOBS.EXTRA_WORK_COLLECT(jobId, requestId), data);
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
  getJobEvidence,
  getJobEvidenceByNo,
  createExtraWork,
  listExtraWork,
  getExtraWorkDetail,
  updateExtraWork,
  uploadExtraWorkReceipt,
  uploadExtraWorkEvidence,
  cancelExtraWork,
  collectDirectPayment,
};

