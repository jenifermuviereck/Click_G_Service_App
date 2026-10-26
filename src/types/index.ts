export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  experienceYears?: string;
  avatarUrl?: string;
  status: 'online' | 'offline';
  verified: boolean;
  registrationRef?: string;
}

export interface RegistrationData {
  // Step 1: Personal Details
  avatarUri?: string;
  fullName: string;
  mobile: string;
  email?: string;

  // Step 2: Address & Experience
  address: string;
  city: string;
  pincode: string;
  experienceYears: string;

  // Step 3: Identity Documents
  idDocType1: string;
  idDocFile1?: string;
  idDocType2: string;
  idDocFile2?: string;

  // Step 4: Bank Details
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  gPayUpiId: string;
  phonePeUpiId: string;
}

export interface ServiceRequest {
  id: string;
  bookingRef: string;
  category: string;
  distanceKm: string;
  scheduledTime: string;
  locationArea: string;
  fullAddress: string;
  customerName: string;
  customerPhone: string;
  customerInitials: string;
  description: string;
  estimatedEarnings: number;
  grossAmount: number;
  platformCommission: number;
  additionalCharges: number;
  gstAmount: number;
  netEarnings: number;
  status: 'new' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
  acceptedAt?: string;
  completedAt?: string;
}

export interface TransactionItem {
  id: string;
  title: string;
  bookingRef: string;
  dateStr: string;
  timeStr: string;
  amount: number;
  status: 'Pending' | 'Paid';
}

export interface EarningsSummary {
  todayTotal: number;
  thisMonthTotal: number;
  pendingTotal: number;
  grossServiceAmount: number;
  platformCommissionRate: number;
  platformCommissionAmount: number;
  netPartnerEarnings: number;
  completedJobsCount: number;
}
