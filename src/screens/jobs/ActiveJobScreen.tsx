import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { useJobs } from '../../context/JobContext';

const ActiveJobScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activeJob } = useJobs();
  const [timelineExpanded, setTimelineExpanded] = useState(false);

  const rawJob = route?.params?.job || activeJob || {};
  const job = {
    id: rawJob.id || 'req-1',
    bookingRef: rawJob.bookingRef || 'CG-1042',
    category: rawJob.category || rawJob.title || 'Plumbing Repair',
    distanceKm: rawJob.distanceKm || '2.4 km',
    scheduledTime: rawJob.scheduledTime || rawJob.timeStr || 'Today • 10:30 AM',
    fullAddress: rawJob.fullAddress || rawJob.area || 'Flat 202, Maple Apartments, 5th Block, Koramangala, Bengaluru - 560095',
    customerName: rawJob.customerName || rawJob.customer || 'Ananya Sharma',
    customerPhone: rawJob.customerPhone || '+91 98765 01234',
    estimatedEarnings: Number(rawJob.estimatedEarnings ?? rawJob.price ?? 1200),
    acceptedAt: rawJob.acceptedAt || '10:35 AM',
    status: rawJob.status || rawJob.badge || 'accepted',
  };

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleOpenMap = () => {
    const query = encodeURIComponent(job.fullAddress);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  const handleContactCustomer = () => {
    Linking.openURL(`tel:${job.customerPhone}`);
  };

  const handleStartNavigation = () => {
    showNotification('Starting navigation to customer premise');
    navigation.navigate('CompleteService', { job });
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
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Active Job</Text>
      </View>

      <View className="flex-1 bg-slate-50">
        <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Job Details Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-base sm:text-lg font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>{job.category}</Text>
            <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <Text className="text-[10px] sm:text-xs font-bold text-emerald-800">Accepted</Text>
            </View>
          </View>

          <Text className="text-xs text-slate-500 mb-3">Booking ID • {job.bookingRef}</Text>

          <View className="flex-row justify-between pt-3 border-t border-slate-100">
            <View>
              <Text className="text-[11px] text-slate-500 font-medium">Scheduled</Text>
              <Text className="text-xs sm:text-sm font-bold text-slate-800">{job.scheduledTime}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[11px] text-slate-500 font-medium">Estimated earnings</Text>
              <Text className="text-sm sm:text-base font-extrabold text-brand-green">
                ₹{(job.estimatedEarnings ?? 1200).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Service Address Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-2">
            <Icon name="map-marker-outline" size={18} color="#07522C" style={{ marginRight: 6 }} />
            <Text className="text-xs sm:text-sm font-bold text-slate-800">
              Service address • {job.distanceKm} away
            </Text>
          </View>

          <Text className="text-xs sm:text-[13px] text-slate-600 mb-3 leading-5">{job.fullAddress}</Text>

          {/* Action Links */}
          <View className="flex-row gap-4 pt-3 border-t border-slate-100">
            <TouchableOpacity
              className="flex-row items-center py-1"
              activeOpacity={0.7}
              onPress={handleOpenMap}>
              <Icon name="navigation-variant-outline" size={16} color="#07522C" style={{ marginRight: 4 }} />
              <Text className="text-xs font-bold text-brand-green">View Route</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-1"
              activeOpacity={0.7}
              onPress={handleContactCustomer}>
              <Icon name="phone-outline" size={16} color="#07522C" style={{ marginRight: 4 }} />
              <Text className="text-xs font-bold text-brand-green">Contact Customer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* In Progress Timeline Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <Text className="text-sm sm:text-base font-bold text-slate-900 mb-3">In progress</Text>

          {!timelineExpanded ? (
            /* Collapsed State */
            <TouchableOpacity
              className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl p-3"
              activeOpacity={0.8}
              onPress={() => setTimelineExpanded(true)}>
              <View className="w-7 h-7 rounded-full bg-brand-green items-center justify-center mr-3">
                <Text className="text-white text-xs font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs sm:text-sm font-bold text-slate-800">Accepted</Text>
                <Text className="text-[11px] text-slate-500">{job.acceptedAt || '10:05 AM'}</Text>
              </View>
              <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full mr-1.5">
                <Text className="text-[10px] font-bold text-emerald-800">Current</Text>
              </View>
              <Icon name="chevron-down" size={20} color="#344054" />
            </TouchableOpacity>
          ) : (
            /* Expanded State */
            <View>
              {[
                { step: 1, title: 'Accepted', time: job.acceptedAt || '10:05 AM', current: true },
                { step: 2, title: 'On the Way', time: 'Pending', current: false },
                { step: 3, title: 'Arrived', time: 'Pending', current: false },
                { step: 4, title: 'Service Started', time: 'Pending', current: false },
                { step: 5, title: 'Service Completed', time: 'Submit completion to finish', current: false },
              ].map((item, idx) => (
                <View
                  key={item.step}
                  className={`flex-row items-center py-2.5 ${
                    idx < 4 ? 'border-b border-slate-100' : ''
                  }`}>
                  <View
                    className={`w-7 h-7 rounded-full items-center justify-center mr-3 ${
                      item.current ? 'bg-brand-green' : 'bg-slate-200'
                    }`}>
                    <Text
                      className={`text-xs font-bold ${
                        item.current ? 'text-white' : 'text-slate-600'
                      }`}>
                      {item.step}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-xs sm:text-sm ${
                        item.current ? 'font-bold text-slate-900' : 'font-medium text-slate-500'
                      }`}>
                      {item.title}
                    </Text>
                    <Text className="text-[11px] text-slate-400">{item.time}</Text>
                  </View>
                  {item.current && (
                    <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <Text className="text-[10px] font-bold text-emerald-800">Current</Text>
                    </View>
                  )}
                  {idx === 0 && (
                    <TouchableOpacity
                      onPress={() => setTimelineExpanded(false)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      className="ml-2">
                      <Icon name="chevron-up" size={20} color="#344054" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      </View>

      {/* Bottom Start Navigation Button */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="p-4 bg-white border-t border-slate-100">
        <TouchableOpacity
          className="bg-brand-green w-full h-12 rounded-xl items-center justify-center shadow-md shadow-brand-green/20"
          activeOpacity={0.88}
          onPress={handleStartNavigation}>
          <Text className="text-white text-[15px] font-bold">Start Navigation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ActiveJobScreen;
