/**
 * @file apiClient.ts
 * @description Core HTTP Network Client for Click G Service App.
 *
 * Implements standard fetch requests with:
 *  - Automatic Bearer token injection from local storage
 *  - Configurable timeouts via AbortController
 *  - Clean JSON and multipart/form-data upload handling
 *  - Unified error transformation
 */

import Config from './config';
import { getAuthToken } from '../../services/storage/authStorage';

/**
 * Current environment setting.
 */
const ENV: 'testing' | 'production' = 'production';

/**
 * Active Base URL for all API requests
 */
export const BASE_URL = Config[ENV].baseURL;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  skipAuth?: boolean;
}

/**
 * Base HTTP request execution wrapper
 */
async function request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: any,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const timeoutMs = options.timeoutMs ?? 15000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...options.headers,
    };

    // Attach Bearer JWT token if available
    if (!options.skipAuth) {
      const token = await getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const init: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    // Format body depending on whether it's FormData or JSON
    if (body !== undefined && body !== null) {
      if (typeof FormData !== 'undefined' && body instanceof FormData) {
        // Fetch sets multipart/form-data boundary automatically when Content-Type is unset
        delete headers['Content-Type'];
        init.body = body;
      } else {
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, init);
    clearTimeout(timer);

    let responseData: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => '');
      responseData = text ? { message: text } : null;
    }

    if (!response.ok) {
      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        `Request failed with status ${response.status}`;

      return {
        success: false,
        message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
        statusCode: response.status,
        data: responseData,
      };
    }

    return {
      success: true,
      message: responseData?.message || 'Success',
      data: responseData as T,
      statusCode: response.status,
    };
  } catch (error: any) {
    clearTimeout(timer);
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timed out. Please check your network connection.',
        statusCode: 408,
      };
    }

    return {
      success: false,
      message: error?.message || 'Network error occurred.',
      statusCode: 0,
    };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, 'GET', undefined, options),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, 'POST', body, options),

  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, 'PATCH', body, options),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    request<T>(endpoint, 'PUT', body, options),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, 'DELETE', undefined, options),

  /**
   * Uploads multipart form data (photos, KYC documents, avatar)
   */
  upload: <T>(endpoint: string, formData: FormData, options?: RequestOptions) =>
    request<T>(endpoint, 'POST', formData, options),
};

export default apiClient;
