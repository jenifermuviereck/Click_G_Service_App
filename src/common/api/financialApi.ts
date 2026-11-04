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

export default {
  getFinancialSummary,
  getEarningsHistory,
  getLedgerTransactions,
  getSalaryConfig,
};

