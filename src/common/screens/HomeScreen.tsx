import React, { useState, useEffect } from 'react';
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
import NotificationHistoryModal from '../../components/NotificationHistoryModal';
import notificationHistoryService from '../../services/notifications/notificationHistoryService';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useModule } from '../../context/ModuleContext';

const homeBanner = require('../../assets/home_banner.png');

interface HomeScreenProps {
  hideBottomNav?: boolean;
  onSwitchTab?: (tab: 'Home' | 'Jobs' | 'Earnings' | 'Profile') => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ hideBottomNav = false, onSwitchTab }) => {
  const navigation = useNavigation<any>();
  const { user, isOnline, toggleOnlineStatus } = useAuth();
  const { dashboardCounts, refreshJobs } = useJobs();
  const { activeModule, setActiveModule, isPorter } = useModule();

  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(1);

  const periodOptions = ['Today', 'Yesterday', 'Weekly', 'Custom'];

  const updateUnreadCount = async () => {
    try {
      const count = await notificationHistoryService.getUnreadCount();
      setUnreadNotifCount(count > 0 ? count : 1);
    } catch {
      setUnreadNotifCount(1);
    }
  };

  useEffect(() => {
    updateUnreadCount();
    refreshJobs();
  }, []);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const partnerName = user?.name || 'Kumar';

  // Metrics based on active module (Porter vs Service)
  const metrics = isPorter
    ? [
        { label: 'Assigned Orders', count: 10, route: 'DeliveryRequest' },
        { label: 'Accept/Reject', count: 5, route: 'DeliveryRequest' },
        { label: 'In Progress', count: 2, route: 'DeliveryNavigation' },
        { label: 'Pending Orders', count: 2, route: 'PickupStops' },
        { label: 'Completed', count: 1, route: 'BatchSummary' },
        { label: 'Re Assigned Orders', count: 0, route: 'PickupStops' },
      ]
    : [
        { label: 'Assigned Job', count: dashboardCounts.assigned || 10, route: 'AcceptRequest' },
        { label: 'Accept/Reject', count: dashboardCounts.acceptReject || 5, route: 'AcceptRequest' },
        { label: 'In Progress', count: dashboardCounts.inProgress || 2, route: 'ActiveJob' },
        { label: 'Pending Job', count: dashboardCounts.pending || 2, route: 'AcceptRequest' },
        { label: 'Completed Jobs', count: dashboardCounts.completed || 1, route: 'Earnings', tab: 'Earnings' },
        { label: 'Re Assigned Job', count: dashboardCounts.reAssigned || 0, route: 'AcceptRequest' },
      ];

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={hideBottomNav ? ['left', 'right'] : ['top', 'left', 'right']}>
      {/* Top Header: Avatar + Greeting + Notification Bell (Matching Screenshot 4) */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-slate-100">
        <View className="flex-row items-center flex-1 mr-3">
          {/* User Avatar Circle */}
          <TouchableOpacity
            className="w-11 h-11 rounded-full bg-slate-200 border-2 border-emerald-100 items-center justify-center mr-3 overflow-hidden shadow-sm"
            activeOpacity={0.8}
            onPress={() => (onSwitchTab ? onSwitchTab('Profile') : navigation.navigate('Profile'))}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>

          {/* Greeting Text */}
          <View>
            <Text className="text-base font-bold text-slate-900 tracking-tight">
              {getGreeting()}, {partnerName}
            </Text>
            <Text className="text-[11px] font-medium text-slate-400">
              {isPorter ? 'ClickG Porter Partner' : 'ClickG Service Specialist'}
            </Text>
          </View>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity
          className="relative p-2 rounded-full bg-slate-50 border border-slate-100"
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell-outline" size={22} color="#1E293B" />
          {unreadNotifCount > 0 && (
            <View className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}>
        
        {/* Module Switcher (Service vs Porter) - Matching Screenshot 4 */}
        <View className="flex-row gap-3 mb-4">
          {/* Service Module Card */}
          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center py-3.5 px-3 rounded-2xl border ${
              activeModule === 'service'
                ? 'bg-brand-green border-brand-green shadow-sm'
                : 'bg-[#DDF0E6] border-[#D1EAD9]'
            }`}
            activeOpacity={0.85}
            onPress={() => setActiveModule('service')}>
            <View className="mr-2">
              <Icon
                name="hammer-wrench"
                size={20}
                color={activeModule === 'service' ? '#FFFFFF' : '#07522C'}
              />
            </View>
            <Text
              className={`text-sm font-bold ${
                activeModule === 'service' ? 'text-white' : 'text-brand-green'
              }`}>
              Service
            </Text>
          </TouchableOpacity>

          {/* Porter Module Card */}
          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center py-3.5 px-3 rounded-2xl border ${
              activeModule === 'porter'
                ? 'bg-brand-green border-brand-green shadow-sm'
                : 'bg-[#DDF0E6] border-[#D1EAD9]'
            }`}
            activeOpacity={0.85}
            onPress={() => setActiveModule('porter')}>
            <View className="mr-2">
              <Icon
                name="truck-fast"
                size={20}
                color={activeModule === 'porter' ? '#FFFFFF' : '#07522C'}
              />
            </View>
            <Text
              className={`text-sm font-bold ${
                activeModule === 'porter' ? 'text-white' : 'text-brand-green'
              }`}>
              Porter
            </Text>
          </TouchableOpacity>
        </View>

        {/* Promotional Banner */}
        <View className="w-full rounded-2xl overflow-hidden mb-4 shadow-sm bg-brand-green">
          <Image
            source={homeBanner}
            className="w-full h-36 sm:h-40"
            resizeMode="cover"
          />
        </View>

        {/* Offline / Online Availability Card (Matching Screenshot 4) */}
        <View className="rounded-2xl border border-slate-200/80 bg-white p-4 mb-4 shadow-sm">
          {/* Top Row: Icon + Title on left, Pill Badge on right */}
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center">
              <View
                className={`w-6 h-6 rounded-full items-center justify-center mr-2 border-2 ${
                  isOnline
                    ? 'border-emerald-300 bg-emerald-100'
                    : 'border-red-300 bg-red-100'
                }`}>
                <View
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? 'bg-brand-green' : 'bg-red-600'
                  }`}
                />
              </View>
              <Text
                className={`text-base font-bold ${
                  isOnline ? 'text-brand-green' : 'text-red-600'
                }`}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>

            <View
              className={`px-3 py-1 rounded-full ${
                isOnline ? 'bg-[#DDF0E6]' : 'bg-[#FEE4E2]'
              }`}>
              <Text
                className={`text-xs font-bold ${
                  isOnline ? 'text-brand-green' : 'text-red-700'
                }`}>
                {isOnline ? 'Available' : 'Not Available'}
              </Text>
            </View>
          </View>

          {/* Bottom Row: Explanatory Subtext on left, Native Toggle Switch on right */}
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-slate-500 font-medium flex-1 pr-2">
              {isOnline
                ? isPorter
                  ? "You're online and ready for deliveries."
                  : "You're online and ready for service jobs."
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

        {/* Date Selector Dropdown (Matching Screenshot 4) */}
        <View className="items-end mb-3.5 z-50">
          <View className="relative w-28 sm:w-32 z-50">
            <TouchableOpacity
              className={`flex-row items-center justify-between bg-white border border-slate-300 px-3 py-1.5 shadow-sm ${
                periodDropdownOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl'
              }`}
              onPress={() => setPeriodDropdownOpen(!periodDropdownOpen)}
              activeOpacity={0.8}>
              <Text className="text-xs font-semibold text-slate-700">{selectedPeriod}</Text>
              <Icon
                name={periodDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#475467"
              />
            </TouchableOpacity>

            {periodDropdownOpen && (
              <View className="absolute top-[34px] left-0 right-0 bg-white border border-slate-300 border-t-0 rounded-b-xl shadow-md z-50">
                {periodOptions.map((opt, i) => (
                  <TouchableOpacity
                    key={opt}
                    className={`px-3 py-2 ${
                      i !== periodOptions.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                    onPress={() => {
                      setSelectedPeriod(opt);
                      setPeriodDropdownOpen(false);
                    }}>
                    <Text
                      className={`text-xs ${
                        selectedPeriod === opt
                          ? 'font-bold text-brand-green'
                          : 'font-medium text-slate-600'
                      }`}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 6 Grid Metrics (Matching Screenshot 4) */}
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {metrics.map(item => (
            <TouchableOpacity
              key={item.label}
              className="w-[48%] bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm"
              activeOpacity={0.7}
              onPress={() => {
                if (item.tab && onSwitchTab) {
                  onSwitchTab(item.tab as any);
                } else {
                  navigation.navigate(item.route);
                }
              }}>
              <Text
                className="text-xs font-medium text-slate-500 mb-1.5"
                numberOfLines={2}>
                {item.label}
              </Text>
              <Text className="text-2xl font-black text-brand-green tracking-tight">
                {item.count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Notification Center Modal */}
      <NotificationHistoryModal
        visible={notificationModalVisible}
        onClose={() => {
          setNotificationModalVisible(false);
          updateUnreadCount();
        }}
        onNavigateToJob={() => navigation.navigate(isPorter ? 'DeliveryRequest' : 'AcceptRequest')}
      />

      {/* Bottom Navigation Bar */}
      {!hideBottomNav && <BottomNavBar currentTab="Home" />}
    </SafeAreaView>
  );
};

export default HomeScreen;
