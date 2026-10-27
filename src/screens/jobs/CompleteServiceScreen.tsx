import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';
import UploadPickerModal, { PickedFile } from '../../components/UploadPickerModal';
import { useJobs } from '../../context/JobContext';

const CompleteServiceScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { completeJob, activeJob } = useJobs();

  const rawJob = route?.params?.job || activeJob || {};
  const job = {
    id: rawJob.id || 'req-1',
    bookingRef: rawJob.bookingRef || 'CG-1042',
    category: rawJob.category || rawJob.title || 'Plumbing Repair',
    scheduledTime: rawJob.scheduledTime || rawJob.timeStr || 'Today • 10:30 AM',
    estimatedEarnings: Number(rawJob.estimatedEarnings ?? rawJob.price ?? 1200),
    grossAmount: Number(rawJob.grossAmount ?? (rawJob.price ? Math.round(rawJob.price * 1.25) : 1500)),
    platformCommission: Number(rawJob.platformCommission ?? (rawJob.price ? Math.round(rawJob.price * 0.25) : 300)),
    additionalCharges: Number(rawJob.additionalCharges ?? 500),
    gstAmount: Number(rawJob.gstAmount ?? 170),
    netEarnings: Number(rawJob.netEarnings ?? rawJob.price ?? 1870),
  };

  const [isCustomerChecked, setIsCustomerChecked] = useState(true);
  const [beforePhotos, setBeforePhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  ]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [uploadTarget, setUploadTarget] = useState<'before' | 'after' | null>(null);

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handlePhotoPicked = (file: PickedFile) => {
    if (uploadTarget === 'before') {
      if (beforePhotos.length < 3) {
        setBeforePhotos(prev => [...prev, file.uri]);
        showNotification('Before-service photo added');
      }
    } else if (uploadTarget === 'after') {
      if (afterPhotos.length < 3) {
        setAfterPhotos(prev => [...prev, file.uri]);
        showNotification('After-service photo added');
      }
    }
    setUploadTarget(null);
  };

  const handleRemovePhoto = (type: 'before' | 'after', index: number) => {
    if (type === 'before') {
      setBeforePhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setAfterPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmitCompletion = () => {
    if (!isCustomerChecked) {
      showNotification('Please confirm work is verified with customer');
      return;
    }

    const completed = completeJob(job.id);
    navigation.navigate('CompletionConfirmed', { job: completed || job });
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
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Complete Service</Text>
      </View>

      <View className="flex-1 bg-slate-50">
        <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Service Summary Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-base sm:text-lg font-bold text-slate-900">{job.category}</Text>
            <View className="bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <Text className="text-[10px] sm:text-xs font-bold text-emerald-800">Service finished</Text>
            </View>
          </View>

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

        {/* Before Completion Photos */}
        <View className="mb-4">
          <Text className="text-xs sm:text-sm font-bold text-slate-800 mb-2.5">
            Before Completion photo ({beforePhotos.length}/3)
          </Text>
          <View className="flex-row gap-2.5">
            {[0, 1, 2].map(slotIdx => {
              const photoUri = beforePhotos[slotIdx];
              if (photoUri) {
                return (
                  <View
                    key={slotIdx}
                    className="flex-1 h-20 sm:h-24 rounded-xl border border-emerald-300 bg-white overflow-hidden relative">
                    <Image source={{ uri: photoUri }} className="w-full h-full" resizeMode="cover" />
                    <TouchableOpacity
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 items-center justify-center"
                      onPress={() => handleRemovePhoto('before', slotIdx)}>
                      <Icon name="close" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                );
              }
              return (
                <TouchableOpacity
                  key={slotIdx}
                  className="flex-1 h-20 sm:h-24 rounded-xl border border-dashed border-slate-300 bg-white items-center justify-center p-2"
                  activeOpacity={0.8}
                  onPress={() => setUploadTarget('before')}>
                  <Icon name="tray-arrow-up" size={20} color="#667085" />
                  <Text className="text-[11px] text-slate-500 mt-1">Tap to upload</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* After Completion Photos */}
        <View className="mb-4">
          <Text className="text-xs sm:text-sm font-bold text-slate-800 mb-2.5">
            After Completion photo ({afterPhotos.length}/3)
          </Text>
          <View className="flex-row gap-2.5">
            {[0, 1, 2].map(slotIdx => {
              const photoUri = afterPhotos[slotIdx];
              if (photoUri) {
                return (
                  <View
                    key={slotIdx}
                    className="flex-1 h-20 sm:h-24 rounded-xl border border-emerald-300 bg-white overflow-hidden relative">
                    <Image source={{ uri: photoUri }} className="w-full h-full" resizeMode="cover" />
                    <TouchableOpacity
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 items-center justify-center"
                      onPress={() => handleRemovePhoto('after', slotIdx)}>
                      <Icon name="close" size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                );
              }
              return (
                <TouchableOpacity
                  key={slotIdx}
                  className="flex-1 h-20 sm:h-24 rounded-xl border border-dashed border-slate-300 bg-white items-center justify-center p-2"
                  activeOpacity={0.8}
                  onPress={() => setUploadTarget('after')}>
                  <Icon name="tray-arrow-up" size={20} color="#667085" />
                  <Text className="text-[11px] text-slate-500 mt-1">Tap to upload</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Customer Verification Checkbox */}
        <TouchableOpacity
          className="flex-row items-center bg-white rounded-xl border border-slate-200 p-3.5 mb-4"
          activeOpacity={0.8}
          onPress={() => setIsCustomerChecked(!isCustomerChecked)}>
          <View
            className={`w-5 h-5 rounded-md items-center justify-center mr-3 border ${
              isCustomerChecked
                ? 'bg-brand-green border-brand-green'
                : 'bg-white border-slate-300'
            }`}>
            {isCustomerChecked && <Icon name="check" size={14} color="#FFFFFF" />}
          </View>
          <Text className="text-xs sm:text-[13px] font-medium text-slate-700 flex-1">
            Work completed and checked with customer
          </Text>
        </TouchableOpacity>

        {/* Price Breakdown Card */}
        <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-600">Gross Service Amount</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{(job.grossAmount ?? 1500).toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-600">Platform Commission (20%)</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-red-600">
              - ₹{(job.platformCommission ?? 300).toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-600">Additional Charges</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{(job.additionalCharges ?? 500).toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between py-1.5 border-b border-slate-100">
            <Text className="text-xs sm:text-[13px] text-slate-600">GST 18%</Text>
            <Text className="text-xs sm:text-[13px] font-semibold text-slate-900">
              ₹{(job.gstAmount ?? 170).toLocaleString()}
            </Text>
          </View>
          <View className="flex-row justify-between pt-3">
            <Text className="text-xs sm:text-sm font-bold text-brand-green">Net Partner Earnings</Text>
            <Text className="text-sm sm:text-base font-extrabold text-brand-green">
              ₹{(job.netEarnings ?? 1870).toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>
      </View>

      {/* Bottom Submit Completion Button */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="p-4 bg-white border-t border-slate-100">
        <TouchableOpacity
          className="bg-brand-green w-full h-12 rounded-xl items-center justify-center shadow-md shadow-brand-green/20"
          activeOpacity={0.88}
          onPress={handleSubmitCompletion}>
          <Text className="text-white text-[15px] font-bold">Submit Completion</Text>
        </TouchableOpacity>
      </View>

      <UploadPickerModal
        visible={uploadTarget !== null}
        onClose={() => setUploadTarget(null)}
        onPick={handlePhotoPicked}
        title={uploadTarget === 'before' ? 'Upload Before-Service Photo' : 'Upload After-Service Photo'}
        allowDocs={false}
      />
    </SafeAreaView>
  );
};

export default CompleteServiceScreen;
