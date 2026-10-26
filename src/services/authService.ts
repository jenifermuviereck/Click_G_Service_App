import { UserProfile, RegistrationData } from '../types';
import { mockUserProfile } from '../data/mockData';

export const authService = {
  async sendOtp(mobile: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
    return {
      success: true,
      message: 'OTP sent successfully to ' + mobile,
      testOtp: '5975',
    };
  },

  async verifyOtp(mobile: string, otp: string) {
    await new Promise(resolve => setTimeout(() => resolve(true), 600));
    // Accept standard test OTP or any 4-digit code
    if (otp.length === 4) {
      return {
        success: true,
        token: `jwt_partner_${Date.now()}`,
        user: {
          ...mockUserProfile,
          mobile: mobile.startsWith('+91') ? mobile : `+91 ${mobile}`,
        },
      };
    }
    return {
      success: false,
      message: 'Invalid OTP code. Please enter 4 digits.',
    };
  },

  async registerPartner(data: RegistrationData) {
    await new Promise(resolve => setTimeout(() => resolve(true), 700));
    const newPartner: UserProfile = {
      id: `partner-${Date.now()}`,
      name: data.fullName || 'Kumar',
      mobile: data.mobile || '+91 98765 43210',
      email: data.email,
      city: data.city || 'Bengaluru',
      experienceYears: data.experienceYears || '5',
      status: 'offline',
      verified: false,
      registrationRef: 'CG-P-2084',
    };
    return {
      success: true,
      token: `jwt_registered_${Date.now()}`,
      user: newPartner,
    };
  },
};

export default authService;
