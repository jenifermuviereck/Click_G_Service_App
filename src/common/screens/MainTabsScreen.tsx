import React, { useState, useEffect, useRef } from 'react';
import { View, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import BottomNavBar from '../../components/BottomNavBar';
import HomeScreen from './HomeScreen';
import EarningsScreen from './EarningsScreen';
import ProfileScreen from './ProfileScreen';
import { MyJobsScreen } from '../../service';
import { PorterDeliveriesScreen } from '../../porter';
import showNotification from '../utils/notification';
import { useModule } from '../../context/ModuleContext';

type TabType = 'Home' | 'Jobs' | 'Earnings' | 'Profile';

const MainTabsScreen = () => {
  const route = useRoute<any>();
  const { isPorter } = useModule();

  // Determine initial tab from route params or route name
  const getInitialTab = (): TabType => {
    if (route.params?.tab) return route.params.tab;
    if (route.name === 'MyJobs' || route.name === 'MyDeliveries') return 'Jobs';
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
      showNotification('Press back again to exit', 'info');
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
          isPorter ? (
            <PorterDeliveriesScreen hideBottomNav onBackToHome={() => setActiveTab('Home')} />
          ) : (
            <MyJobsScreen hideBottomNav onBackToHome={() => setActiveTab('Home')} />
          )
        )}
        {activeTab === 'Earnings' && (
          <EarningsScreen hideBottomNav onBackToHome={() => setActiveTab('Home')} />
        )}
        {activeTab === 'Profile' && (
          <ProfileScreen hideBottomNav onBackToHome={() => setActiveTab('Home')} />
        )}
      </View>

      {/* Permanently Static Bottom Navigation Bar */}
      <BottomNavBar currentTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
};

export default MainTabsScreen;
