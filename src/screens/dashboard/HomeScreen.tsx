import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import BottomNavBar from '../../components/BottomNavBar';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';

const homeBanner = require('../../data/home.png');

interface HomeScreenProps {
  hideBottomNav?: boolean;
  onSwitchTab?: (tab: 'Home' | 'Jobs' | 'Earnings' | 'Profile') => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ hideBottomNav = false, onSwitchTab }) => {
  const navigation = useNavigation<any>();
  const { user, isOnline, toggleOnlineStatus } = useAuth();
  const { dashboardCounts } = useJobs();
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);

  const periodOptions = ['Today', 'Yesterday', 'Weekly', 'Custom'];

  const metrics = [
    { label: 'Assigned Job', count: dashboardCounts.assigned, route: 'AcceptRequest' },
    { label: 'Accept/Reject', count: dashboardCounts.acceptReject, route: 'AcceptRequest' },
    { label: 'In Progress', count: dashboardCounts.inProgress, route: 'ActiveJob' },
    { label: 'Pending Job', count: dashboardCounts.pending, route: 'AcceptRequest' },
    { label: 'Completed Jobs', count: dashboardCounts.completed, route: 'Earnings', tab: 'Earnings' },
    { label: 'Re Assigned Job', count: dashboardCounts.reAssigned, route: 'AcceptRequest' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['left', 'right']}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-slate-100">
        {/* ClickG Brand Logo */}
        <View className="flex-row items-center">
          <View className="w-7 h-7 rounded-lg bg-brand-green items-center justify-center mr-1.5">
            <Icon name="truck-fast" size={16} color="#FFFFFF" />
          </View>
          <Text className="text-lg font-extrabold text-brand-green tracking-tight">ClickG</Text>
        </View>

        {/* Right Actions: Notification Bell + User Profile */}
        <View className="flex-row items-center">
          <TouchableOpacity className="relative p-1.5 mr-2.5" activeOpacity={0.7}>
            <Icon name="bell-outline" size={22} color="#344054" />
            <View className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-slate-50 border border-slate-200 rounded-full py-1 px-2.5"
            activeOpacity={0.8}
            onPress={() => (onSwitchTab ? onSwitchTab('Profile') : navigation.navigate('Profile'))}>
            <View className="w-6 h-6 rounded-full bg-brand-lightGreen items-center justify-center mr-1.5">
              <Icon name="account" size={16} color="#07522C" />
            </View>
            <Text className="text-xs font-semibold text-slate-800 mr-1">Hi, {user?.name || 'Kumar'}</Text>
            <Icon name="chevron-down" size={16} color="#667085" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="p-4 sm:p-5 pb-6"
        showsVerticalScrollIndicator={false}>
        {/* Promotional Banner */}
        <View className="w-full rounded-2xl overflow-hidden mb-4 shadow-sm bg-brand-green">
          <Image
            source={homeBanner}
            className="w-full h-36 sm:h-44"
            resizeMode="cover"
          />
        </View>

        {/* Offline / Online Availability Card */}
        <View
          className={`rounded-2xl border p-4 mb-4 shadow-sm ${
            isOnline
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-red-50/60 border-red-200'
          }`}>
          {/* Top Row: Icon + Title on left, Badge on right */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <View
                className={`w-6 h-6 rounded-full items-center justify-center mr-2 border-2 ${
                  isOnline
                    ? 'border-emerald-300 bg-emerald-100'
                    : 'border-red-300 bg-red-100'
                }`}>
                <View
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOnline ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                />
              </View>
              <Text
                className={`text-base font-bold ${
                  isOnline ? 'text-emerald-900' : 'text-red-900'
                }`}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>

            <View
              className={`px-2.5 py-1 rounded-full ${
                isOnline ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
              <Text
                className={`text-xs font-semibold ${
                  isOnline ? 'text-emerald-800' : 'text-red-700'
                }`}>
                {isOnline ? 'Available' : 'Not Available'}
              </Text>
            </View>
          </View>

          {/* Bottom Row: Explanatory Subtext on left, Toggle Switch on right */}
          <View className="flex-row items-center justify-between">
            <Text className="text-xs sm:text-[13px] text-slate-600 flex-1 pr-2.5">
              {isOnline
                ? "You're online now and ready for jobs."
                : "You're offline now"}
            </Text>

            <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: '#FECDCA', true: '#C8E6D3' }}
              thumbColor={isOnline ? '#07522C' : '#D92D20'}
            />
          </View>
        </View>

        {/* Date Selector Dropdown */}
        <View className="items-end mb-3.5 z-50">
          <View className="relative w-28 sm:w-32 z-50">
            <TouchableOpacity
              className={`flex-row items-center justify-between bg-white border border-slate-300 px-3 py-1.5 shadow-sm ${
                periodDropdownOpen ? 'rounded-t-lg border-b-slate-100' : 'rounded-lg'
              }`}
              activeOpacity={0.8}
              onPress={() => setPeriodDropdownOpen(prev => !prev)}>
              <Text className="text-xs sm:text-[13px] font-semibold text-slate-700">{selectedPeriod}</Text>
              <Icon
                name={periodDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#344054"
              />
            </TouchableOpacity>

            {periodDropdownOpen && (
              <View className="absolute top-9 left-0 right-0 bg-white border border-slate-300 border-t-0 rounded-b-lg shadow-lg z-50">
                {periodOptions.map((option, idx) => (
                  <TouchableOpacity
                    key={option}
                    className={`px-3 py-2 ${
                      idx !== periodOptions.length - 1 ? 'border-b border-slate-100' : ''
                    } ${selectedPeriod === option ? 'bg-slate-50' : ''}`}
                    onPress={() => {
                      setSelectedPeriod(option);
                      setPeriodDropdownOpen(false);
                    }}>
                    <Text
                      className={`text-xs ${
                        selectedPeriod === option
                          ? 'text-brand-green font-bold'
                          : 'text-slate-700 font-medium'
                      }`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 2x3 Metric Cards Grid (Responsive 2-column) */}
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {metrics.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] bg-white rounded-2xl border border-slate-200 p-4 shadow-sm active:scale-[0.98]"
              activeOpacity={0.85}
              onPress={() => {
                if (item.tab && onSwitchTab) {
                  onSwitchTab(item.tab as any);
                } else {
                  navigation.navigate(item.route);
                }
              }}>
              <Text className="text-xs sm:text-[13px] font-medium text-slate-500 mb-2">{item.label}</Text>
              <Text className="text-xl sm:text-2xl font-extrabold text-slate-900">{item.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      {!hideBottomNav && <BottomNavBar currentTab="Home" />}
    </SafeAreaView>
  );
};

export default HomeScreen;
