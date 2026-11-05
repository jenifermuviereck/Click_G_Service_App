import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { ServiceRequest } from '../types';
import jobsApi, { PersonJobDetail } from '../common/api/jobsApi';
import attendanceApi from '../common/api/attendanceApi';
import { useAuth } from './AuthContext';

export interface DashboardCounts {
  assigned: number;
  acceptReject: number;
  inProgress: number;
  pending: number;
  completed: number;
  reAssigned: number;
}

interface JobContextType {
  requests: ServiceRequest[];
  activeJob: ServiceRequest | null;
  completedJobs: ServiceRequest[];
  acceptJob: (jobId: string) => ServiceRequest | undefined;
  rejectJob: (jobId: string, reason?: string) => void;
  completeJob: (jobId: string, notes?: string) => ServiceRequest | undefined;
  setActiveJobDirectly: (job: ServiceRequest | null) => void;
  refreshJobs: () => Promise<void>;
  dashboardCounts: DashboardCounts;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

/**
 * Transforms a backend PersonJobDetail entity to a UI-friendly ServiceRequest.
 */
function mapBackendJobToServiceRequest(item: PersonJobDetail): ServiceRequest {
  const address = item.booking?.address;
  const fullAddress = address
    ? [address.addressLine1, address.addressLine2, address.city, address.pincode]
        .filter(Boolean)
        .join(', ')
    : 'Customer Address';

  const customerName = item.booking?.customerName || 'Customer';
  const customerInitials =
    customerName
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CU';

  const firstItem = item.booking?.items?.[0];
  const serviceName = firstItem?.serviceName || 'Service Request';
  const price = firstItem?.totalPrice ? parseFloat(firstItem.totalPrice) : 1200;

  let status: ServiceRequest['status'] = 'new';
  if (
    item.status === 'ACCEPTED' ||
    item.status === 'EN_ROUTE' ||
    item.status === 'ARRIVED'
  ) {
    status = 'accepted';
  } else if (item.status === 'IN_PROGRESS') {
    status = 'in_progress';
  } else if (item.status === 'COMPLETED') {
    status = 'completed';
  } else if (item.status === 'REJECTED' || item.status === 'CANCELLED') {
    status = 'rejected';
  }

  return {
    id: item.id,
    bookingRef: item.jobNo || item.booking?.bookingNo || 'CG-JOB',
    category: serviceName,
    distanceKm: '2.5 km',
    scheduledTime: item.booking?.serviceDate || 'Today • Scheduled',
    locationArea: address?.city || 'Bengaluru',
    fullAddress,
    customerName,
    customerPhone: item.booking?.customerPhoneMasked || '+91 98765 00000',
    customerInitials,
    description: item.booking?.customerNotes || serviceName,
    estimatedEarnings: Math.round(price * 0.8),
    grossAmount: price,
    platformCommission: Math.round(price * 0.2),
    additionalCharges: 0,
    gstAmount: Math.round(price * 0.18),
    netEarnings: Math.round(price * 0.8),
    status,
    acceptedAt: item.startedAt,
    completedAt: item.completedAt,
  };
}

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [activeJob, setActiveJob] = useState<ServiceRequest | null>(null);
  const [completedJobs, setCompletedJobs] = useState<ServiceRequest[]>([]);

  // Dynamically aggregated metrics
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts>({
    assigned: 0,
    acceptReject: 0,
    inProgress: 0,
    pending: 0,
    completed: 0,
    reAssigned: 0,
  });

  /**
   * Refreshes jobs and computes real-time aggregate metric counts from backend APIs
   */
  const refreshJobs = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      // Parallel queries across status buckets
      const [assignedRes, activeRes, completedRes, attendanceRes] = await Promise.all([
        jobsApi.getJobs('ASSIGNED', 1, 20),
        jobsApi.getJobs('IN_PROGRESS', 1, 10),
        jobsApi.getJobs('COMPLETED', 1, 10),
        attendanceApi.getCurrentAttendance(),
      ]);

      // 1. Process Assigned requests
      let assignedTotal = requests.length;
      if (assignedRes.success && assignedRes.data?.items) {
        if (assignedRes.data.items.length > 0) {
          setRequests(assignedRes.data.items.map(mapBackendJobToServiceRequest));
        }
        assignedTotal = assignedRes.data.total ?? assignedRes.data.items.length;
      }

      // 2. Process Active / In-Progress jobs
      let activeTotal = activeJob ? 1 : 0;
      if (activeRes.success && activeRes.data?.items) {
        if (activeRes.data.items.length > 0) {
          setActiveJob(mapBackendJobToServiceRequest(activeRes.data.items[0]));
        }
        activeTotal = activeRes.data.total ?? activeRes.data.items.length;
      }

      // 3. Process Completed jobs & Shift summary
      let completedTotal = completedJobs.length;
      if (completedRes.success && completedRes.data?.items) {
        if (completedRes.data.items.length > 0) {
          setCompletedJobs(completedRes.data.items.map(mapBackendJobToServiceRequest));
        }
        completedTotal = completedRes.data.total ?? completedRes.data.items.length;
      } else if (attendanceRes.success && attendanceRes.data?.todaySummary) {
        completedTotal = attendanceRes.data.todaySummary.totalJobsCompleted;
      }

      // 4. Update aggregated metric counts
      setDashboardCounts({
        assigned: assignedTotal,
        acceptReject: assignedTotal,
        inProgress: activeTotal,
        pending: assignedTotal + activeTotal,
        completed: completedTotal,
        reAssigned: 0,
      });
    } catch (err) {
      console.warn('[JobContext] refreshJobs error:', err);
    }
  }, [isAuthenticated, requests.length, activeJob, completedJobs.length]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshJobs();
    }
  }, [isAuthenticated, refreshJobs]);

  /**
   * Accepts a job request, transitions status, and refreshes metrics
   */
  const acceptJob = (jobId: string): ServiceRequest | undefined => {
    const job = requests.find(r => r.id === jobId);
    if (!job) return undefined;

    const acceptedJob: ServiceRequest = {
      ...job,
      status: 'accepted',
      acceptedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setActiveJob(acceptedJob);
    setRequests(prev => prev.filter(r => r.id !== jobId));

    // Optimistic count adjustment
    setDashboardCounts(prev => ({
      ...prev,
      assigned: Math.max(0, prev.assigned - 1),
      acceptReject: Math.max(0, prev.acceptReject - 1),
      inProgress: prev.inProgress + 1,
    }));

    jobsApi.acceptJob(jobId).catch(err => {
      console.warn('[JobContext] jobsApi.acceptJob warning:', err);
    });

    return acceptedJob;
  };

  /**
   * Declines a job request and updates metric counters
   */
  const rejectJob = (jobId: string, reason = 'Declined by service partner') => {
    setRequests(prev => prev.filter(r => r.id !== jobId));
    setDashboardCounts(prev => ({
      ...prev,
      assigned: Math.max(0, prev.assigned - 1),
      acceptReject: Math.max(0, prev.acceptReject - 1),
    }));

    jobsApi.declineJob(jobId, reason).catch(err => {
      console.warn('[JobContext] jobsApi.declineJob warning:', err);
    });
  };

  /**
   * Completes an active job, records completion, and updates counts
   */
  const completeJob = (
    jobId: string,
    notes = 'Work completed successfully',
  ): ServiceRequest | undefined => {
    const target =
      activeJob && activeJob.id === jobId
        ? activeJob
        : requests.find(r => r.id === jobId);
    if (!target) return undefined;

    const finished: ServiceRequest = {
      ...target,
      status: 'completed',
      completedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setCompletedJobs(prev => [finished, ...prev]);
    setActiveJob(null);

    // Optimistic count adjustment
    setDashboardCounts(prev => ({
      ...prev,
      inProgress: Math.max(0, prev.inProgress - 1),
      completed: prev.completed + 1,
      pending: Math.max(0, prev.pending - 1),
    }));

    jobsApi.completeJob(jobId, notes).catch(err => {
      console.warn('[JobContext] jobsApi.completeJob warning:', err);
    });

    return finished;
  };

  return (
    <JobContext.Provider
      value={{
        requests,
        activeJob,
        completedJobs,
        acceptJob,
        rejectJob,
        completeJob,
        setActiveJobDirectly: setActiveJob,
        refreshJobs,
        dashboardCounts,
      }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export default JobContext;
