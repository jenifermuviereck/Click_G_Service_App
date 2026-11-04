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
    city?: string;
    state?: string;
    pincode?: string;
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
  bankName?: string;
  upiId?: string;
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
export const updateAddress = async (data: {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}): Promise<ApiResponse> => {
  return apiClient.patch(ENDPOINTS.PROFILE.ADDRESS, data);
};

/**
 * Updates bank account and UPI details for weekly/monthly payouts
 */
export const updateBankDetails = async (data: BankDetailsPayload): Promise<ApiResponse> => {
  return apiClient.patch(ENDPOINTS.PROFILE.BANK, data);
};

/**
 * Updates skill categories & geographic service areas
 */
export const updateWorkSelection = async (data: {
  skillIds: string[];
  serviceAreaIds: string[];
  serviceCategoryIds?: string[];
}): Promise<ApiResponse> => {
  return apiClient.patch(ENDPOINTS.PROFILE.WORK_SELECTION, data);
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
  updateWorkSelection,
  getCatalogCategories,
  getCatalogSkills,
  getCatalogServiceAreas,
};

