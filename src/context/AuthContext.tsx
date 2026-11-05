/**
 * @file AuthContext.tsx (Root Context Re-Export)
 * @description Standardized global auth context.
 *
 * Re-exports the driver-aligned AuthContext from `../services/auth/AuthContext`
 * to ensure seamless backward-compatibility for all existing screens.
 */

export * from '../services/auth/AuthContext';
export { default } from '../services/auth/AuthContext';
