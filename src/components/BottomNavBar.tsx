import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import { useModule } from '../context/ModuleContext';

interface BottomNavBarProps {
  currentTab?: 'Home' | 'Jobs' | 'Earnings' | 'Profile';
  onTabChange?: (tab: 'Home' | 'Jobs' | 'Earnings' | 'Profile') => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab = 'Home', onTabChange }) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { isPorter, jobTabLabel } = useModule();

  const tabs: Array<{
    name: 'Home' | 'Jobs' | 'Earnings' | 'Profile';
    label: string;
    icon: string;
    activeIcon: string;
    route: string;
  }> = [
    {
      name: 'Home',
      label: 'Home',
      icon: 'home-variant-outline',
      activeIcon: 'home-variant',
      route: 'Home',
    },
    {
      name: 'Jobs',
      label: jobTabLabel,
      icon: isPorter ? 'package-variant-closed' : 'briefcase-outline',
      activeIcon: isPorter ? 'package-variant-closed' : 'briefcase',
      route: isPorter ? 'MyDeliveries' : 'MyJobs',
    },
    {
      name: 'Earnings',
      label: 'Earnings',
      icon: 'wallet-outline',
      activeIcon: 'wallet',
      route: 'Earnings',
    },
    {
      name: 'Profile',
      label: 'Profile',
      icon: 'account-outline',
      activeIcon: 'account',
      route: 'Profile',
    },
  ];

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 6) }}
      className="bg-white border-t border-slate-100 shadow-sm">
      <View className="flex-row h-16 items-center justify-around px-3">
        {tabs.map(tab => {
          const isActive = currentTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              className="items-center justify-center flex-1 py-1"
              activeOpacity={0.7}
              onPress={() => {
                if (onTabChange) {
                  onTabChange(tab.name);
                } else if (!isActive) {
                  navigation.navigate(tab.route);
                }
              }}>
              <View
                className={`items-center justify-center px-4 py-1 rounded-2xl ${
                  isActive ? 'bg-[#EBF6F0]' : 'bg-transparent'
                }`}>
                <Icon
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={22}
                  color={isActive ? '#07522C' : '#64748B'}
                />
                <Text
                  className={`text-[11px] mt-0.5 ${
                    isActive ? 'text-[#07522C] font-bold' : 'text-slate-500 font-medium'
                  }`}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavBar;
