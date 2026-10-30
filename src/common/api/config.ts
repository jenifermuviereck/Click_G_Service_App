/**
 * @file config.ts
 * @description API Environment Configuration.
 *
 * Provides base URLs for different application environments (testing, production).
 * Change the active environment string to toggle between backend endpoints.
 */

const Config = {
  /**
   * Staging / Testing backend API environment
   */
  testing: {
    baseURL: 'https://testing-api.yetlocart.com/api',
  },

  /**
   * Production live backend API environment
   */
  production: {
    baseURL: 'https://api.yetlocart.com/api',
  },
};

export default Config;

