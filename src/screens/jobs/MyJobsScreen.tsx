import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import BottomNavBar from '../../components/BottomNavBar';

type JobTab = 'Upcoming' | 'Ongoing' | 'Completed';

interface MyJobsScreenProps {
  hideBottomNav?: boolean;
  onBackToHome?: () => void;
}

const MyJobsScreen: React.FC<MyJobsScreenProps> = ({ hideBottomNav = false, onBackToHome }) => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<JobTab>('Upcoming');

  const upcomingJobs = [
    {
      id: 'job-1',
      title: 'Painting Service',
      category: 'Painting Service',
      bookingRef: 'CG-1044',
      area: 'Indiranagar, Bengaluru',
      fullAddress: 'Flat 402, Sunshine Apts, 100ft Road, Indiranagar, Bengaluru - 560038',
      timeStr: 'Today • 4:00 PM',
      scheduledTime: 'Today • 4:00 PM',
      distanceKm: '3.2 km',
      customerName: 'Karthik Rao',
      customerPhone: '+91 98765 11223',
      price: 2400,
      estimatedEarnings: 2400,
      badge: 'Upcoming',
    },
    {
      id: 'job-2',
      title: 'Electrical Wiring',
      category: 'Electrical Wiring',
      bookingRef: 'CG-1045',
      area: 'HSR Layout, Bengaluru',
      fullAddress: 'No 78, 27th Main, Sector 1, HSR Layout, Bengaluru - 560102',
      timeStr: 'Tomorrow • 9:00 AM',
      scheduledTime: 'Tomorrow • 9:00 AM',
      distanceKm: '4.5 km',
      customerName: 'Pooja Hegde',
      customerPhone: '+91 98765 33445',
      price: 950,
      estimatedEarnings: 950,
      badge: 'Upcoming',
    },
  ];

  const ongoingJobs = [
    {
      id: 'job-3',
      title: 'Plumbing Repair',
      category: 'Plumbing Repair',
      bookingRef: 'CG-1042',
      area: 'Koramangala, Bengaluru',
      fullAddress: 'Flat 202, Maple Apartments, 5th Block, Koramangala, Bengaluru - 560095',
      timeStr: 'Today • 10:30 AM',
      scheduledTime: 'Today • 10:30 AM',
      distanceKm: '2.4 km',
      customerName: 'Ananya Sharma',
      customerPhone: '+91 98765 01234',
      price: 1200,
      estimatedEarnings: 1200,
      grossAmount: 1500,
      platformCommission: 300,
      additionalCharges: 500,
      gstAmount: 170,
      netEarnings: 1870,
      badge: 'Service Started',
    },
  ];

  const completedJobs = [
    {
      id: 'job-4',
      title: 'Painting Service',
      bookingRef: 'CG-1039',
      area: 'Indiranagar, Bengaluru',
      timeStr: 'Today • 8:00 AM',
      price: 3200,
      badge: 'Completed',
      grossAmount: 4000,
      commission: 800,
      netEarnings: 3200,
      customer: 'Rahul Mehta',
      description: 'Bedroom wall touch-up completed. Work checked and approved by the customer.',
      txRef: 'TX-1039',
    },
    {
      id: 'job-5',
      title: 'Electrical Wiring',
      bookingRef: 'CG-1040',
      area: 'HSR Layout, Bengaluru',
      timeStr: 'Today • 9:00 AM',
      price: 1650,
      badge: 'Completed',
      grossAmount: 2062.5,
      commission: 412.5,
      netEarnings: 1650,
      customer: 'Priya Sundaram',
      description: 'Main switchboard MCB replacement and circuit safety test.',
      txRef: 'TX-1040',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['left', 'right']}>
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => (onBackToHome ? onBackToHome() : (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')))}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">My Jobs</Text>
      </View>

      <View className="flex-1">
        {/* 3 Segmented Tabs */}
        <View className="flex-row bg-slate-200/70 p-1 rounded-xl mx-4 sm:mx-5 my-3">
          {(['Upcoming', 'Ongoing', 'Completed'] as JobTab[]).map(tab => {
            const isSelected = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                className={`flex-1 py-2 items-center justify-center rounded-lg ${
                  isSelected ? 'bg-white shadow-sm' : ''
                }`}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab)}>
                <Text
                  className={`text-xs sm:text-[13px] ${
                    isSelected ? 'font-bold text-brand-green' : 'font-medium text-slate-600'
                  }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="p-4 sm:p-5 pt-1 pb-6">
          {/* Upcoming Tab */}
          {activeTab === 'Upcoming' && (
            <View>
              <Text className="text-xs font-semibold text-slate-500 mb-3">
                {upcomingJobs.length} scheduled {upcomingJobs.length === 1 ? 'job' : 'jobs'}
              </Text>

              {upcomingJobs.map(job => (
                <View key={job.id} className="bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-sm">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm sm:text-base font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>{job.title}</Text>
                    <View className="bg-blue-100 px-2.5 py-0.5 rounded-full">
                      <Text className="text-[10px] sm:text-xs font-bold text-blue-800">{job.badge}</Text>
                    </View>
                  </View>

                  <Text className="text-xs text-slate-500 mb-3">
                    {job.bookingRef} • {job.area}
                  </Text>

                  <View className="flex-row justify-between items-center pt-2 mb-3 border-t border-slate-100">
                    <Text className="text-xs text-slate-600">{job.timeStr}</Text>
                    <Text className="text-sm sm:text-base font-extrabold text-slate-900">
                      ₹{(job.price ?? 0).toLocaleString()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="bg-brand-green w-full h-11 rounded-xl items-center justify-center shadow-sm"
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('ActiveJob', { job })}>
                    <Text className="text-white text-xs sm:text-sm font-bold">View Details</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Ongoing Tab */}
          {activeTab === 'Ongoing' && (
            <View>
              <Text className="text-xs font-semibold text-slate-500 mb-3">
                {ongoingJobs.length} service in progress
              </Text>

              {ongoingJobs.map(job => (
                <View key={job.id} className="bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-sm">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm sm:text-base font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>{job.title}</Text>
                    <View className="bg-amber-100 px-2.5 py-0.5 rounded-full">
                      <Text className="text-[10px] sm:text-xs font-bold text-amber-800">{job.badge}</Text>
                    </View>
                  </View>

                  <Text className="text-xs text-slate-500 mb-3">
                    {job.bookingRef} • {job.area}
                  </Text>

                  <View className="flex-row justify-between items-center pt-2 mb-3 border-t border-slate-100">
                    <Text className="text-xs text-slate-600">{job.timeStr}</Text>
                    <Text className="text-sm sm:text-base font-extrabold text-slate-900">
                      ₹{(job.price ?? 0).toLocaleString()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="bg-brand-green w-full h-11 rounded-xl items-center justify-center shadow-sm"
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('CompleteService', { job })}>
                    <Text className="text-white text-xs sm:text-sm font-bold">Continue Job</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Completed Tab */}
          {activeTab === 'Completed' && (
            <View>
              <Text className="text-xs font-semibold text-slate-500 mb-3">
                {completedJobs.length} completed today
              </Text>

              {completedJobs.map(job => (
                <View key={job.id} className="bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-sm">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm sm:text-base font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>{job.title}</Text>
                    <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <Text className="text-[10px] sm:text-xs font-bold text-emerald-800">{job.badge}</Text>
                    </View>
                  </View>

                  <Text className="text-xs text-slate-500 mb-3">
                    {job.bookingRef} • {job.area}
                  </Text>

                  <View className="flex-row justify-between items-center pt-2 mb-3 border-t border-slate-100">
                    <Text className="text-xs text-slate-600">{job.timeStr}</Text>
                    <Text className="text-sm sm:text-base font-extrabold text-slate-900">
                      ₹{(job.price ?? 0).toLocaleString()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="bg-brand-green w-full h-11 rounded-xl items-center justify-center shadow-sm"
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('JobSummary', { job })}>
                    <Text className="text-white text-xs sm:text-sm font-bold">View Summary</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Bottom Nav */}
      {!hideBottomNav && <BottomNavBar currentTab="Jobs" />}
    </SafeAreaView>
  );
};

export default MyJobsScreen;
