/**
 * @file authService.ts (Root Service Re-Export)
 * @description Standardized authentication facade.
 *
 * Re-exports the modular authService from `./auth/authService` to maintain
 * backward-compatibility with existing screens and tests.
 */

export * from './auth/authService';
export { default } from './auth/authService';
