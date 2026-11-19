import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';

const HelpSupportScreen = () => {
  const navigation = useNavigation<any>();

  const handleCall = () => {
    Linking.openURL('tel:08045678900');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:partners@clickg.in');
  };

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
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Help &amp; Support</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-12" showsVerticalScrollIndicator={false}>
        <Text className="text-lg sm:text-xl font-bold text-slate-900 mb-1">How can we help?</Text>
        <Text className="text-xs sm:text-[13px] text-slate-500 mb-5 leading-5">
          For help with bookings, payments or verification, contact the partner support team.
        </Text>

        {/* Call Partner Support Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Icon name="phone-outline" size={18} color="#07522C" style={{ marginRight: 6 }} />
            <Text className="text-xs sm:text-sm font-bold text-slate-900">Call partner support</Text>
          </View>

          <View className="flex-row justify-between mb-1">
            <Text className="text-xs text-slate-500">Phone</Text>
            <Text className="text-xs sm:text-sm font-bold text-slate-900">080 4567 8900</Text>
          </View>
          <Text className="text-[11px] text-slate-400 mb-3.5">Monday - Saturday • 9:00 AM - 6:00 PM</Text>

          <TouchableOpacity
            className="w-full h-11 bg-brand-green rounded-xl items-center justify-center shadow-xs"
            activeOpacity={0.85}
            onPress={handleCall}>
            <Text className="text-white text-xs sm:text-sm font-bold">Call Support</Text>
          </TouchableOpacity>
        </View>

        {/* Email Support Card */}
        <TouchableOpacity
          className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm"
          activeOpacity={0.9}
          onPress={handleEmail}>
          <View className="flex-row items-center mb-2">
            <Icon name="email-outline" size={18} color="#07522C" style={{ marginRight: 6 }} />
            <Text className="text-xs sm:text-sm font-bold text-slate-900">Email support</Text>
          </View>

          <Text className="text-xs sm:text-sm font-bold text-brand-green mb-1">partners@clickg.in</Text>
          <Text className="text-xs text-slate-500 leading-4">
            Include your booking ID or partner reference so we can help you faster.
          </Text>
        </TouchableOpacity>

        {/* Common Questions Section */}
        <Text className="text-sm sm:text-base font-bold text-slate-900 mb-3">Common questions</Text>

        <View className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <Text className="text-xs sm:text-sm font-bold text-slate-900 mb-1">When will I receive my payment?</Text>
          <Text className="text-xs text-slate-600 leading-4">
            Check the expected settlement date in Earnings &gt; Transaction Details.
          </Text>

          <View className="h-px bg-slate-100 my-3" />

          <Text className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Why is my verification pending?</Text>
          <Text className="text-xs text-slate-600 leading-4">
            Document review usually takes 1-2 working days after submission.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;
