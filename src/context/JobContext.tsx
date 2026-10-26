import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ServiceRequest } from '../types';
import { initialRequests } from '../data/mockData';

interface JobContextType {
  requests: ServiceRequest[];
  activeJob: ServiceRequest | null;
  completedJobs: ServiceRequest[];
  acceptJob: (jobId: string) => ServiceRequest | undefined;
  rejectJob: (jobId: string) => void;
  completeJob: (jobId: string) => ServiceRequest | undefined;
  setActiveJobDirectly: (job: ServiceRequest | null) => void;
  dashboardCounts: {
    assigned: number;
    acceptReject: number;
    inProgress: number;
    pending: number;
    completed: number;
    reAssigned: number;
  };
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [activeJob, setActiveJob] = useState<ServiceRequest | null>(initialRequests[0]);
  const [completedJobs, setCompletedJobs] = useState<ServiceRequest[]>([]);

  const acceptJob = (jobId: string) => {
    const job = requests.find(r => r.id === jobId);
    if (!job) return undefined;
    const acceptedJob: ServiceRequest = {
      ...job,
      status: 'accepted',
      acceptedAt: '10:35 AM',
    };
    setActiveJob(acceptedJob);
    setRequests(prev => prev.filter(r => r.id !== jobId));
    return acceptedJob;
  };

  const rejectJob = (jobId: string) => {
    setRequests(prev => prev.filter(r => r.id !== jobId));
  };

  const completeJob = (jobId: string) => {
    const target = activeJob && activeJob.id === jobId ? activeJob : requests.find(r => r.id === jobId);
    if (!target) return undefined;
    const finished: ServiceRequest = {
      ...target,
      status: 'completed',
      completedAt: '11:15 AM',
    };
    setCompletedJobs(prev => [finished, ...prev]);
    setActiveJob(null);
    return finished;
  };

  const dashboardCounts = {
    assigned: 10,
    acceptReject: 5,
    inProgress: activeJob ? 2 : 1,
    pending: 2,
    completed: 1 + completedJobs.length,
    reAssigned: 0,
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
