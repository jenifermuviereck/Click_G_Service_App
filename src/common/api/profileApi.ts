/**
 * @file profileApi.ts
 * @description Professional Profile, KYC, Bank & Catalog API for Click G Service App.
 *
 * Mapped to Swagger Person-App-Profile endpoints:
 * https://cliickgserviceman.yetloapps.com/api/docs/Person-App#/Person-App-Profile
 */

import apiClient, { ApiResponse } from './apiClient';
import { ENDPOINTS } from './endPoint';

export interface PersonProfile {
  id: string;
  phone: string;
  fullName: string;
  email?: string;
  status: string;
  rating: number;
  totalJobsDone: number;
  skills: string[];
  serviceAreaIds: string[];
  serviceCategoryIds?: string[];
  experienceYears?: number;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    experienceInYears?: number;
  };
  kyc?: {
    aadhaarNumberMasked?: string;
    panNumberMasked?: string;
    drivingLicenseNumberMasked?: string;
    status?: string;
  };
  attendance?: {
    isOnDuty: boolean;
  };
  avatarUrl?: string;
}

export interface BankDetailsPayload {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  upiVpa?: string;
  googlePayUpiId?: string;
  phonePeUpiId?: string;
  bankName?: string;
  upiId?: string;
}

export interface AddressPayload {
  addressLine1: string;
  city: string;
  state?: string;
  pincode: string;
  addressLine2?: string;
  area?: string;
  landmark?: string;
  experienceInYears?: number;
}

export interface WorkSelectionPayload {
  /** List of active skill names or service identifiers (Swagger: skills) */
  skills?: string[];
  /** List of active service area UUIDs */
  serviceAreaIds: string[];
  /** Optional list of active service category UUIDs or identifiers */
  serviceCategoryIds?: string[];
  /** Backward-compatible alias for skill names */
  skillIds?: string[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  iconUrl?: string;
}

export interface CatalogSkill {
  id: string;
  name: string;
  categoryId: string;
}

export interface CatalogServiceArea {
  id: string;
  name: string;
  city: string;
  pincode?: string;
}

/**
 * Retrieves full profile details of the authenticated professional
 */
export const getProfile = async (): Promise<ApiResponse<PersonProfile>> => {
  return apiClient.get<PersonProfile>(ENDPOINTS.PROFILE.GET);
};

/**
 * Updates basic profile fields
 */
export const updateProfile = async (
  data: Partial<{ fullName: string; email: string; experienceYears: number }>,
): Promise<ApiResponse<PersonProfile>> => {
  return apiClient.patch<PersonProfile>(ENDPOINTS.PROFILE.UPDATE, data);
};

/**
 * Uploads profile avatar image (multipart/form-data)
 */
export const uploadAvatar = async (formData: FormData): Promise<ApiResponse<{ avatarUrl: string }>> => {
  return apiClient.upload<{ avatarUrl: string }>(ENDPOINTS.PROFILE.AVATAR_UPLOAD, formData);
};

/**
 * Uploads KYC verification document (multipart/form-data)
 */
export const uploadKycDocument = async (formData: FormData): Promise<ApiResponse> => {
  return apiClient.upload(ENDPOINTS.PROFILE.KYC_UPLOAD, formData);
};

/**
 * Updates residential address
 */
export const updateAddress = async (data: AddressPayload): Promise<ApiResponse> => {
  const payload = {
    addressLine1: data.addressLine1,
    city: data.city,
    state: data.state && data.state.trim() ? data.state.trim() : 'Karnataka',
    pincode: data.pincode,
    addressLine2: data.addressLine2 || undefined,
    area: data.area || data.landmark || undefined,
    experienceInYears: typeof data.experienceInYears === 'number' ? data.experienceInYears : undefined,
  };
  return apiClient.patch(ENDPOINTS.PROFILE.ADDRESS, payload);
};

/**
 * Updates bank account and UPI details for weekly/monthly payouts
 */
export const updateBankDetails = async (data: BankDetailsPayload): Promise<ApiResponse> => {
  const payload = {
    accountHolderName: data.accountHolderName,
    accountNumber: data.accountNumber,
    ifscCode: data.ifscCode,
    upiVpa: data.upiVpa || data.upiId || undefined,
    googlePayUpiId: data.googlePayUpiId || undefined,
    phonePeUpiId: data.phonePeUpiId || undefined,
  };
  return apiClient.patch(ENDPOINTS.PROFILE.BANK, payload);
};

/**
 * Updates masked identity details (PAN and Aadhaar) for authenticated professional
 */
export const updateKycDetails = async (data: {
  panNumber?: string;
  aadhaarNumber?: string;
}): Promise<ApiResponse> => {
  return apiClient.patch(ENDPOINTS.PROFILE.KYC_DETAILS, data);
};

/**
 * Updates skill categories & geographic service areas
 */
export const updateWorkSelection = async (data: WorkSelectionPayload): Promise<ApiResponse> => {
  const payload = {
    skills: data.skills || data.skillIds || [],
    serviceAreaIds: data.serviceAreaIds || [],
    serviceCategoryIds: data.serviceCategoryIds || undefined,
  };
  return apiClient.patch(ENDPOINTS.PROFILE.WORK_SELECTION, payload);
};

/**
 * Retrieves onboarding progress and next incomplete step
 */
export const getOnboardingProgress = async (): Promise<ApiResponse<{
  currentStep: number;
  completedSteps: string[];
  isComplete: boolean;
  nextIncompleteStep?: string;
}>> => {
  return apiClient.get(ENDPOINTS.PROFILE.ONBOARDING_PROGRESS);
};

/**
 * Submits complete onboarding application for administrative review
 */
export const submitOnboarding = async (): Promise<ApiResponse> => {
  return apiClient.post(ENDPOINTS.PROFILE.ONBOARDING_SUBMIT, {});
};

// ── Public Catalog APIs ──────────────────────────────────────────────────────

export const getCatalogCategories = async (): Promise<ApiResponse<CatalogCategory[]>> => {
  return apiClient.get<CatalogCategory[]>(ENDPOINTS.CATALOG.CATEGORIES);
};

export const getCatalogSkills = async (): Promise<ApiResponse<CatalogSkill[]>> => {
  return apiClient.get<CatalogSkill[]>(ENDPOINTS.CATALOG.SKILLS);
};

export const getCatalogServiceAreas = async (): Promise<ApiResponse<CatalogServiceArea[]>> => {
  return apiClient.get<CatalogServiceArea[]>(ENDPOINTS.CATALOG.SERVICE_AREAS);
};

export default {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadKycDocument,
  updateAddress,
  updateBankDetails,
  updateKycDetails,
  updateWorkSelection,
  getOnboardingProgress,
  submitOnboarding,
  getCatalogCategories,
  getCatalogSkills,
  getCatalogServiceAreas,
};

