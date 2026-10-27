import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();

  const [jobAlerts, setJobAlerts] = useState(true);
  const [paymentUpdates, setPaymentUpdates] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Settings</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <Text className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5">Notifications</Text>
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
          <View className="flex-row justify-between items-center py-1">
            <View className="flex-1 pr-3">
              <Text className="text-xs sm:text-sm font-semibold text-slate-900 mb-0.5">Job request alerts</Text>
              <Text className="text-xs text-slate-500 leading-4">Get notified when a new service request arrives.</Text>
            </View>
            <Switch
              value={jobAlerts}
              onValueChange={setJobAlerts}
              trackColor={{ false: '#E4E7EC', true: '#07522C' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View className="h-px bg-slate-100 my-3" />

          <View className="flex-row justify-between items-center py-1">
            <View className="flex-1 pr-3">
              <Text className="text-xs sm:text-sm font-semibold text-slate-900 mb-0.5">Payment updates</Text>
              <Text className="text-xs text-slate-500 leading-4">Receive updates when your earnings are paid.</Text>
            </View>
            <Switch
              value={paymentUpdates}
              onValueChange={setPaymentUpdates}
              trackColor={{ false: '#E4E7EC', true: '#07522C' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Privacy & Account Section */}
        <Text className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5">Privacy &amp; account</Text>
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
          <TouchableOpacity className="flex-row justify-between items-center py-1.5 active:opacity-70" activeOpacity={0.7}>
            <Text className="text-xs sm:text-sm font-medium text-slate-700">Terms of Service</Text>
            <View className="flex-row items-center">
              <Text className="text-xs text-slate-400 mr-1">View</Text>
              <Icon name="chevron-right" size={18} color="#98A2B3" />
            </View>
          </TouchableOpacity>

          <View className="h-px bg-slate-100 my-2.5" />

          <TouchableOpacity className="flex-row justify-between items-center py-1.5 active:opacity-70" activeOpacity={0.7}>
            <Text className="text-xs sm:text-sm font-medium text-slate-700">Privacy Policy</Text>
            <View className="flex-row items-center">
              <Text className="text-xs text-slate-400 mr-1">View</Text>
              <Icon name="chevron-right" size={18} color="#98A2B3" />
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text className="text-xs sm:text-sm font-bold text-slate-900 mb-2.5">About</Text>
        <View className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs text-slate-500">App</Text>
            <Text className="text-xs sm:text-sm font-semibold text-slate-900">ClickG Service Partner</Text>
          </View>

          <View className="flex-row justify-between pt-2">
            <Text className="text-xs text-slate-500">Version</Text>
            <Text className="text-xs sm:text-sm font-semibold text-slate-900">1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
