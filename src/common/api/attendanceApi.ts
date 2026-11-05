/**
 * @file attendanceApi.ts
 * @description Shift Attendance & On-Duty Management API for Click G Service App.
 *
 * Mapped to Swagger Person-App-Attendance endpoints:
 * https://cliickgserviceman.yetloapps.com/api/docs/Person-App#/Person-App-Attendance
 */

import apiClient, { ApiResponse } from './apiClient';
import { ENDPOINTS } from './endPoint';

export interface AttendanceSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
}

export interface TodayAttendanceSummary {
  date: string;
  totalDurationMinutes: number;
  totalJobsCompleted: number;
  sessionsCount: number;
}

export interface CurrentAttendanceStatus {
  isOnDuty: boolean;
  todaySummary?: TodayAttendanceSummary | null;
  activeSession?: AttendanceSession | null;
}

/**
 * Retrieves the current on-duty/off-duty state and today's session summary
 */
export const getCurrentAttendance = async (): Promise<ApiResponse<CurrentAttendanceStatus>> => {
  return apiClient.get<CurrentAttendanceStatus>(ENDPOINTS.ATTENDANCE.CURRENT);
};

/**
 * Starts a duty session (turns on-duty)
 */
export const enableAttendance = async (coords?: {
  latitude?: number;
  longitude?: number;
}): Promise<ApiResponse> => {
  return apiClient.post(ENDPOINTS.ATTENDANCE.ENABLE, coords || {});
};

/**
 * Ends active duty session (turns off-duty)
 */
export const disableAttendance = async (): Promise<ApiResponse> => {
  return apiClient.post(ENDPOINTS.ATTENDANCE.DISABLE, {});
};

/**
 * Retrieves historical attendance records
 */
export const getAttendanceHistory = async (page = 1, limit = 20): Promise<ApiResponse> => {
  return apiClient.get(`${ENDPOINTS.ATTENDANCE.HISTORY}?page=${page}&limit=${limit}`);
};

export default {
  getCurrentAttendance,
  enableAttendance,
  disableAttendance,
  getAttendanceHistory,
};

