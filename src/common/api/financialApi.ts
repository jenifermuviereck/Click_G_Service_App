/**
 * @file financialApi.ts
 * @description Earnings, Wallet & Payout Financial API for Click G Service App.
 *
 * Mapped to Swagger Person-App-Financial endpoints:
 * https://cliickgserviceman.yetloapps.com/api/docs/Person-App#/Person-App-Financial
 */

import apiClient, { ApiResponse } from './apiClient';
import { ENDPOINTS } from './endPoint';

export interface FinancialSummary {
  walletBalance: string;
  currency: string;
  totalEarnings: string;
  pendingPayouts: string;
  totalDeductions: string;
  thisMonthEarnings?: string;
  todayEarnings?: string;
  completedJobsCount?: number;
}

export interface EarningItem {
  id: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: string;
  netPayoutAmount: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING';
  payoutReference?: string;
  paidAt?: string;
}

export interface LedgerTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: string;
  currency: string;
  description: string;
  balanceAfter: string;
  createdAt: string;
  referenceType?: string;
  referenceId?: string;
}

export interface PendingDeductionItem {
  id: string;
  category: string;
  totalAmount: string;
  recoveredAmount: string;
  remainingAmount: string;
  status: 'PENDING' | 'IN_RECOVERY' | 'COMPLETED' | 'WAIVED';
  description?: string;
  createdAt: string;
}

export interface DeductionRecoveryEvent {
  id: string;
  deductionId: string;
  recoveredAmount: string;
  remainingAfter: string;
  recoveredAt: string;
  payoutCycleId?: string;
  notes?: string;
}

/**
 * Retrieves overall financial summary (earnings, wallet balance, deductions)
 */
export const getFinancialSummary = async (): Promise<ApiResponse<FinancialSummary>> => {
  return apiClient.get<FinancialSummary>(ENDPOINTS.FINANCIAL.SUMMARY);
};

/**
 * Retrieves fixed-salary / per-job earnings history
 */
export const getEarningsHistory = async (
  page = 1,
  limit = 20,
): Promise<ApiResponse<{ items: EarningItem[]; total: number }>> => {
  return apiClient.get(`${ENDPOINTS.FINANCIAL.EARNINGS}?page=${page}&limit=${limit}`);
};

/**
 * Retrieves financial ledger transactions
 */
export const getLedgerTransactions = async (
  page = 1,
  limit = 20,
): Promise<ApiResponse<{ items: LedgerTransaction[]; total: number }>> => {
  return apiClient.get(`${ENDPOINTS.FINANCIAL.LEDGER}?page=${page}&limit=${limit}`);
};

/**
 * Retrieves current salary / remuneration configuration
 */
export const getSalaryConfig = async (): Promise<ApiResponse> => {
  return apiClient.get(ENDPOINTS.FINANCIAL.SALARY);
};

/**
 * Retrieves pending financial deductions with optional status/category filter
 */
export const getPendingDeductions = async (
  page = 1,
  limit = 20,
  status?: string,
  category?: string,
): Promise<ApiResponse<{ items: PendingDeductionItem[]; total: number }>> => {
  let url = `${ENDPOINTS.FINANCIAL.PENDING_DEDUCTIONS}?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  if (category) url += `&category=${category}`;
  return apiClient.get(url);
};

/**
 * Retrieves recovery events history for a specific pending deduction
 */
export const getDeductionRecoveryEvents = async (
  deductionId: string,
): Promise<ApiResponse<DeductionRecoveryEvent[]>> => {
  return apiClient.get(ENDPOINTS.FINANCIAL.RECOVERY_EVENTS(deductionId));
};

export default {
  getFinancialSummary,
  getEarningsHistory,
  getLedgerTransactions,
  getSalaryConfig,
  getPendingDeductions,
  getDeductionRecoveryEvents,
};

