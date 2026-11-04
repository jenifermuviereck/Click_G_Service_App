import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import BottomNavBar from '../../components/BottomNavBar';
import { useJobs } from '../../context/JobContext';
import { ServiceRequest } from '../../types';

type JobTab = 'Upcoming' | 'Ongoing' | 'Completed';

interface MyJobsScreenProps {
  hideBottomNav?: boolean;
  onBackToHome?: () => void;
}

const MyJobsScreen: React.FC<MyJobsScreenProps> = ({ hideBottomNav = false, onBackToHome }) => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<JobTab>('Upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const { requests, activeJob, completedJobs, refreshJobs } = useJobs();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshJobs();
    } finally {
      setRefreshing(false);
    }
  };

  const ongoingList: ServiceRequest[] = activeJob ? [activeJob] : [];

  const renderEmptyState = (title: string, subtitle: string) => (
    <View className="items-center justify-center py-16 px-4">
      <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
        <Icon name="clipboard-text-outline" size={32} color="#94A3B8" />
      </View>
      <Text className="text-base font-bold text-slate-800 mb-1">{title}</Text>
      <Text className="text-xs text-slate-500 text-center">{subtitle}</Text>
    </View>
  );

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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="p-4 sm:p-5 pt-1 pb-6"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#07522C']}
            />
          }>
          {/* Upcoming Tab */}
          {activeTab === 'Upcoming' && (
            <View>
              {requests.length === 0 ? (
                renderEmptyState(
                  'No upcoming jobs',
                  'New assigned jobs from customers will appear here.',
                )
              ) : (
                <>
                  <Text className="text-xs font-semibold text-slate-500 mb-3">
                    {requests.length} scheduled {requests.length === 1 ? 'job' : 'jobs'}
                  </Text>

                  {requests.map(job => (
                    <View key={job.id} className="bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-sm">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-sm sm:text-base font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>
                          {job.category}
                        </Text>
                        <View className="bg-blue-100 px-2.5 py-0.5 rounded-full">
                          <Text className="text-[10px] sm:text-xs font-bold text-blue-800">
                            {job.status === 'accepted' ? 'Accepted' : 'New'}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-xs text-slate-500 mb-3">
                        {job.bookingRef} • {job.locationArea}
                      </Text>

                      <View className="flex-row justify-between items-center pt-2 mb-3 border-t border-slate-100">
                        <Text className="text-xs text-slate-600">{job.scheduledTime}</Text>
                        <Text className="text-sm sm:text-base font-extrabold text-slate-900">
                          ₹{(job.estimatedEarnings ?? 0).toLocaleString()}
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
                </>
              )}
            </View>
          )}

          {/* Ongoing Tab */}
          {activeTab === 'Ongoing' && (
            <View>
              {ongoingList.length === 0 ? (
                renderEmptyState(
                  'No ongoing service',
                  'Jobs in progress will appear here once you start work.',
                )
              ) : (
                <>
                  <Text className="text-xs font-semibold text-slate-500 mb-3">
                    {ongoingList.length} service in progress
                  </Text>

                  {ongoingList.map(job => (
                    <View key={job.id} className="bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-sm">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-sm sm:text-base font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>
                          {job.category}
                        </Text>
                        <View className="bg-amber-100 px-2.5 py-0.5 rounded-full">
                          <Text className="text-[10px] sm:text-xs font-bold text-amber-800">In Progress</Text>
                        </View>
                      </View>

                      <Text className="text-xs text-slate-500 mb-3">
                        {job.bookingRef} • {job.locationArea}
                      </Text>

                      <View className="flex-row justify-between items-center pt-2 mb-3 border-t border-slate-100">
                        <Text className="text-xs text-slate-600">{job.scheduledTime}</Text>
                        <Text className="text-sm sm:text-base font-extrabold text-slate-900">
                          ₹{(job.estimatedEarnings ?? 0).toLocaleString()}
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
                </>
              )}
            </View>
          )}

          {/* Completed Tab */}
          {activeTab === 'Completed' && (
            <View>
              {completedJobs.length === 0 ? (
                renderEmptyState(
                  'No completed jobs',
                  'Services you finish today will be listed here.',
                )
              ) : (
                <>
                  <Text className="text-xs font-semibold text-slate-500 mb-3">
                    {completedJobs.length} completed
                  </Text>

                  {completedJobs.map(job => (
                    <View key={job.id} className="bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-sm">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-sm sm:text-base font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>
                          {job.category}
                        </Text>
                        <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <Text className="text-[10px] sm:text-xs font-bold text-emerald-800">Completed</Text>
                        </View>
                      </View>

                      <Text className="text-xs text-slate-500 mb-3">
                        {job.bookingRef} • {job.locationArea}
                      </Text>

                      <View className="flex-row justify-between items-center pt-2 mb-3 border-t border-slate-100">
                        <Text className="text-xs text-slate-600">{job.scheduledTime}</Text>
                        <Text className="text-sm sm:text-base font-extrabold text-slate-900">
                          ₹{(job.netEarnings ?? job.estimatedEarnings ?? 0).toLocaleString()}
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
                </>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      {!hideBottomNav && <BottomNavBar currentTab="Jobs" />}
    </SafeAreaView>
  );
};

export default MyJobsScreen;
