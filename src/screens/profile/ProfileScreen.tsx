import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import BottomNavBar from '../../components/BottomNavBar';
import { useAuth } from '../../context/AuthContext';

interface ProfileScreenProps {
  hideBottomNav?: boolean;
  onBackToHome?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ hideBottomNav = false, onBackToHome }) => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const menuItems = [
    {
      title: 'Personal Details',
      icon: 'account-outline',
      onPress: () => navigation.navigate('PersonalDetails'),
    },
    {
      title: 'Skills & Services',
      icon: 'wrench-outline',
      onPress: () => {},
    },
    {
      title: 'Documents & Verification',
      icon: 'shield-check-outline',
      onPress: () => navigation.navigate('DocumentsVerification'),
    },
    {
      title: 'Bank Details',
      icon: 'bank-outline',
      onPress: () => navigation.navigate('BankDetails'),
    },
    {
      title: 'Help & Support',
      icon: 'headset',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      title: 'Settings',
      icon: 'cog-outline',
      onPress: () => navigation.navigate('Settings'),
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
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Profile</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View className="flex-row items-center bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="w-14 h-14 rounded-full bg-brand-lightGreen items-center justify-center mr-3.5 border-2 border-brand-green/20">
            <Text className="text-xl font-extrabold text-brand-green">K</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base sm:text-lg font-bold text-slate-900">{user?.name || 'Kumar'}</Text>
            <Text className="text-xs sm:text-[13px] text-slate-500 mb-1">{user?.mobile || '+91 98765 43210'}</Text>
            <View className="self-start bg-emerald-100 px-2 py-0.5 rounded-full">
              <Text className="text-[10px] sm:text-xs font-bold text-emerald-800">Verified partner</Text>
            </View>
          </View>
        </View>

        {/* Menu Navigation Card */}
        <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4 shadow-sm">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center px-4 py-3.5 ${
                index !== menuItems.length - 1 ? 'border-b border-slate-100' : ''
              } active:bg-slate-50`}
              activeOpacity={0.7}
              onPress={item.onPress}>
              <View className="w-8 h-8 rounded-lg bg-emerald-50 items-center justify-center mr-3">
                <Icon name={item.icon} size={18} color="#07522C" />
              </View>
              <Text className="flex-1 text-xs sm:text-sm font-semibold text-slate-800">{item.title}</Text>
              <Icon name="chevron-right" size={18} color="#98A2B3" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Row Card */}
        <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
          <TouchableOpacity
            className="flex-row items-center px-4 py-3.5 active:bg-red-50"
            activeOpacity={0.7}
            onPress={() => setLogoutModalVisible(true)}>
            <View className="w-8 h-8 rounded-lg bg-red-50 items-center justify-center mr-3">
              <Icon name="logout" size={18} color="#D92D20" />
            </View>
            <Text className="flex-1 text-xs sm:text-sm font-bold text-red-600">Logout</Text>
            <Icon name="chevron-right" size={18} color="#98A2B3" />
          </TouchableOpacity>
        </View>

        {/* Version Footer */}
        <Text className="text-center text-[11px] text-slate-400 mb-2">
          ClickG Service Partner • Version 1.0.0
        </Text>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View className="flex-1 bg-black/50 items-center justify-center p-5">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 items-center shadow-xl">
            <View className="w-14 h-14 rounded-full bg-red-100 items-center justify-center mb-4">
              <Icon name="logout" size={26} color="#D92D20" />
            </View>

            <Text className="text-lg font-bold text-slate-900 mb-1.5 text-center">Logout of ClickG?</Text>
            <Text className="text-xs sm:text-sm text-slate-500 text-center mb-6 leading-5">
              You'll need to verify your mobile number again to manage your service jobs.
            </Text>

            <TouchableOpacity
              className="bg-red-600 w-full h-12 rounded-xl items-center justify-center mb-2.5 shadow-sm"
              activeOpacity={0.85}
              onPress={handleConfirmLogout}>
              <Text className="text-white text-sm font-bold">Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full h-11 items-center justify-center rounded-xl"
              activeOpacity={0.8}
              onPress={() => setLogoutModalVisible(false)}>
              <Text className="text-slate-600 text-xs sm:text-sm font-bold">Stay Logged In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      {!hideBottomNav && <BottomNavBar currentTab="Profile" />}
    </SafeAreaView>
  );
};

export default ProfileScreen;
