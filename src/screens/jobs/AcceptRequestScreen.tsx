import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import BottomNavBar from '../../components/BottomNavBar';
import { useJobs } from '../../context/JobContext';
import { ServiceRequest } from '../../types';

const AcceptRequestScreen = () => {
  const navigation = useNavigation<any>();
  const { requests, acceptJob, rejectJob } = useJobs();

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedJobToReject, setSelectedJobToReject] = useState<ServiceRequest | null>(null);

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleAccept = (item: ServiceRequest) => {
    const accepted = acceptJob(item.id);
    showNotification(`Job ${item.bookingRef} accepted`);
    navigation.navigate('ActiveJob', { job: accepted || item });
  };

  const handleOpenRejectModal = (item: ServiceRequest) => {
    setSelectedJobToReject(item);
    setRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (selectedJobToReject) {
      rejectJob(selectedJobToReject.id);
      showNotification(`Request ${selectedJobToReject.bookingRef} rejected`);
    }
    setRejectModalVisible(false);
    setSelectedJobToReject(null);
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Accept Request</Text>
      </View>

      <View className="flex-1 bg-slate-50">
        <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Section Heading */}
        <View className="mb-4">
          <Text className="text-base sm:text-lg font-bold text-slate-900">New requests</Text>
          <Text className="text-xs sm:text-[13px] text-slate-500 mt-0.5">
            Review the service details before accepting a job
          </Text>
        </View>

        {requests.length === 0 ? (
          <View className="items-center justify-center py-16 px-4">
            <Icon name="checkbox-marked-circle-outline" size={48} color="#07522C" />
            <Text className="text-base font-bold text-slate-800 mt-3 mb-1">No pending requests</Text>
            <Text className="text-xs text-slate-500 text-center">
              All incoming service requests have been reviewed.
            </Text>
          </View>
        ) : (
          requests.map(item => (
            <View key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
              {/* Card Top Row */}
              <View className="flex-row justify-between items-center mb-1">
                <View className="flex-row items-center flex-1 mr-2">
                  <Text className="text-sm sm:text-base font-bold text-slate-900 mr-2">{item.category}</Text>
                  <View className="bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Text className="text-[10px] sm:text-xs font-semibold text-emerald-800">{item.distanceKm}</Text>
                  </View>
                </View>
                <View className="bg-slate-100 px-2.5 py-1 rounded-md">
                  <Text className="text-[11px] font-semibold text-slate-600">{item.scheduledTime}</Text>
                </View>
              </View>

              {/* Area location */}
              <Text className="text-xs text-slate-500 mb-3">{item.locationArea}</Text>

              {/* Customer Row */}
              <View className="flex-row items-center bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
                <View className="w-9 h-9 rounded-full bg-brand-lightGreen items-center justify-center mr-2.5">
                  <Text className="text-xs font-bold text-brand-green">{item.customerInitials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs sm:text-sm font-bold text-slate-800">{item.customerName}</Text>
                  <Text className="text-[11px] text-slate-500">{item.customerPhone}</Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center shadow-xs"
                  activeOpacity={0.8}
                  onPress={() => handleCall(item.customerPhone)}>
                  <Icon name="phone-outline" size={16} color="#07522C" />
                </TouchableOpacity>
              </View>

              {/* Description */}
              <Text className="text-xs text-slate-600 mb-4 leading-4">{item.description}</Text>

              {/* Actions Row: Reject / Accept Job */}
              <View className="flex-row gap-2.5">
                <TouchableOpacity
                  className="flex-1 h-11 rounded-xl border border-red-200 bg-red-50/60 items-center justify-center"
                  activeOpacity={0.8}
                  onPress={() => handleOpenRejectModal(item)}>
                  <Text className="text-xs sm:text-sm font-bold text-red-600">Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 h-11 rounded-xl bg-brand-green items-center justify-center shadow-sm"
                  activeOpacity={0.88}
                  onPress={() => handleAccept(item)}>
                  <Text className="text-xs sm:text-sm font-bold text-white">Accept Job</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      </View>

      {/* Reject Confirmation Modal */}
      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}>
        <View className="flex-1 bg-black/50 items-center justify-center p-5">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 relative shadow-xl">
            <TouchableOpacity
              className="absolute top-4 right-4 p-1"
              onPress={() => setRejectModalVisible(false)}>
              <Icon name="close" size={20} color="#667085" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-slate-900 mb-1">Reject this request?</Text>
            <Text className="text-xs font-semibold text-brand-green mb-2">
              {selectedJobToReject?.category} • {selectedJobToReject?.bookingRef}
            </Text>
            <Text className="text-xs sm:text-[13px] text-slate-500 mb-6 leading-5">
              This request will be removed from your list. You won't be assigned this job.
            </Text>

            <TouchableOpacity
              className="bg-red-600 w-full h-12 rounded-xl items-center justify-center mb-2.5 shadow-sm"
              activeOpacity={0.85}
              onPress={handleConfirmReject}>
              <Text className="text-white text-sm font-bold">Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full h-11 items-center justify-center rounded-xl"
              activeOpacity={0.7}
              onPress={() => setRejectModalVisible(false)}>
              <Text className="text-slate-600 text-xs sm:text-sm font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      <BottomNavBar currentTab="Jobs" />
    </SafeAreaView>
  );
};

export default AcceptRequestScreen;
