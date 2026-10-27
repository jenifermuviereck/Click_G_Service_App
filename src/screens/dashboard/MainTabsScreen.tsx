import React, { useState, useEffect, useRef } from 'react';
import { View, BackHandler, ToastAndroid, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import BottomNavBar from '../../components/BottomNavBar';
import HomeScreen from './HomeScreen';
import MyJobsScreen from '../jobs/MyJobsScreen';
import EarningsScreen from '../earnings/EarningsScreen';
import ProfileScreen from '../profile/ProfileScreen';

type TabType = 'Home' | 'Jobs' | 'Earnings' | 'Profile';

const MainTabsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // Determine initial tab from route params or route name
  const getInitialTab = (): TabType => {
    if (route.params?.tab) return route.params.tab;
    if (route.name === 'MyJobs') return 'Jobs';
    if (route.name === 'Earnings') return 'Earnings';
    if (route.name === 'Profile') return 'Profile';
    return 'Home';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab());
  const lastBackPressRef = useRef<number>(0);

  // Sync route params when navigated with new tab params
  useEffect(() => {
    if (route.params?.tab && route.params.tab !== activeTab) {
      setActiveTab(route.params.tab);
    }
  }, [route.params?.tab]);

  // Handle Android Hardware Back Press
  useEffect(() => {
    const onBackPress = () => {
      // If user is on any other tab (Jobs, Earnings, Profile), return to Home first
      if (activeTab !== 'Home') {
        setActiveTab('Home');
        return true;
      }

      // If user is on Home tab, require double back press to exit
      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        BackHandler.exitApp();
        return true;
      }

      lastBackPressRef.current = now;
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      }
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Content Area - Switches smoothly without moving the bottom nav bar */}
      <View className="flex-1 bg-slate-50">
        {activeTab === 'Home' && (
          <HomeScreen hideBottomNav onSwitchTab={setActiveTab} />
        )}
        {activeTab === 'Jobs' && (
          <MyJobsScreen hideBottomNav onBackToHome={() => setActiveTab('Home')} />
        )}
        {activeTab === 'Earnings' && (
          <EarningsScreen hideBottomNav onBackToHome={() => setActiveTab('Home')} />
        )}
        {activeTab === 'Profile' && (
          <ProfileScreen hideBottomNav onBackToHome={() => setActiveTab('Home')} />
        )}
      </View>

      {/* Permanently Static Bottom Navigation Bar (does not slide on tab changes) */}
      <BottomNavBar currentTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
};

export default MainTabsScreen;
