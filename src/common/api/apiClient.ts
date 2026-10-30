/**
 * @file apiClient.ts
 * @description Core HTTP Network Client.
 *
 * Configures the active environment's BASE_URL and provides network request wrappers
 * with automatic Bearer token injection, request timeouts, and unified error handling.
 */

import Config from './config';

/**
 * Current environment setting. Change to 'production' for live deployment.
 */
const ENV: 'testing' | 'production' = 'testing';

/**
 * Active Base URL for all API requests
 */
export const BASE_URL = Config[ENV].baseURL;

export default BASE_URL;

