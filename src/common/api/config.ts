/**
 * @file config.ts
 * @description API Environment Configuration for Click G Service App.
 *
 * Base URL provided by Yetlo API team:
 * https://cliickgserviceman.yetloapps.com/api/docs/Person-App
 */

const Config = {
  /**
   * Primary API Base URL
   */
  testing: {
    baseURL: 'https://cliickgserviceman.yetloapps.com',
  },

  /**
   * Production live backend API environment
   */
  production: {
    baseURL: 'https://cliickgserviceman.yetloapps.com',
  },
};

export default Config;
