import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

/**
 * Screen 12 - Pickup Issue Reporting
 * Shows:
 *  - "What went wrong?" / "Shop B"
 *  - Radio options list:
 *     - Shop Closed
 *     - Contact Unavailable
 *     - Incorrect OTP
 *     - Goods Not Available
 *     - Quantity Mismatch
 *     - Other Issue
 *  - Remarks text input
 *  - Add photo (optional) button
 *  - Contact support button
 *  - Submit issue CTA
 */
const ReportPickupIssueScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedIssue, setSelectedIssue] = useState('Shop Closed');
  const [remarks, setRemarks] = useState('');

  const issues = [
    'Shop Closed',
    'Contact Unavailable',
    'Incorrect OTP',
    'Goods Not Available',
    'Quantity Mismatch',
    'Other Issue',
  ];

  const handleSubmit = () => {
    showNotification('Issue reported to dispatch team', 'success');
    navigation.goBack();
  };

  const handleSupport = () => {
    Linking.openURL('tel:+911800123456').catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1 -ml-1 mr-2"
          activeOpacity={0.7}>
          <Icon name="chevron-left" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-slate-800">Report pickup issue</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-black text-slate-900 leading-tight">What went wrong?</Text>
        <Text className="text-sm font-bold text-emerald-800 mt-0.5">Shop B</Text>

        {/* Radio Options List */}
        <View className="mt-4 bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
          {issues.map(item => {
            const isSelected = selectedIssue === item;
            return (
              <TouchableOpacity
                key={item}
                className="flex-row items-center p-3 border-b border-slate-50 last:border-b-0"
                activeOpacity={0.7}
                onPress={() => setSelectedIssue(item)}>
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${
                    isSelected ? 'border-[#07522C]' : 'border-slate-300'
                  }`}>
                  {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-[#07522C]" />}
                </View>
                <Text
                  className={`text-sm ${
                    isSelected ? 'font-bold text-slate-900' : 'text-slate-600'
                  }`}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Remarks Input */}
        <View className="mt-4">
          <Text className="text-xs font-bold text-slate-700 mb-1.5">Remarks</Text>
          <View className="bg-white rounded-xl p-3 border border-slate-200">
            <TextInput
              placeholder="Tap to add remarks"
              placeholderTextColor="#94A3B8"
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={3}
              className="text-xs text-slate-900 p-0 text-top"
            />
          </View>
        </View>

        {/* Add photo optional */}
        <TouchableOpacity
          className="mt-3.5 bg-emerald-50/70 rounded-xl p-3 border border-emerald-200 flex-row items-center justify-center"
          activeOpacity={0.7}
          onPress={() => showNotification('Photo added', 'info')}>
          <Icon name="camera-outline" size={18} color="#07522C" />
          <Text className="text-xs font-bold text-emerald-900 ml-2">Add photo (optional)</Text>
        </TouchableOpacity>

        {/* Contact Support */}
        <TouchableOpacity
          className="mt-2.5 bg-white rounded-xl p-3 border border-slate-200 flex-row items-center justify-center"
          activeOpacity={0.7}
          onPress={handleSupport}>
          <Icon name="headset" size={18} color="#475569" />
          <Text className="text-xs font-bold text-slate-700 ml-2">Contact support</Text>
        </TouchableOpacity>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Pickup 2 of 3 · 1 completed
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={handleSubmit}>
          <Text className="text-base font-bold text-white tracking-wide">Submit issue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReportPickupIssueScreen;
