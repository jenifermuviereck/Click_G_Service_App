import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { useJobs } from '../../context/JobContext';

const CompleteServiceScreen = () => {
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
  const [beforePhotos, setBeforePhotos] = useState<string[]>(['photo-1', 'photo-2']);
  const [afterPhotos, setAfterPhotos] = useState<string[]>(['photo-3', 'photo-4']);

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleUploadPhoto = (type: 'before' | 'after') => {
    showNotification(`Photo selected for ${type} service`);
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
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Service</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Service Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.jobCategory}>{job.category}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Service finished</Text>
            </View>
          </View>

          <View style={styles.scheduledRow}>
            <View>
              <Text style={styles.scheduleLabel}>Scheduled</Text>
              <Text style={styles.scheduleValue}>{job.scheduledTime}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.earningsLabel}>Estimated earnings</Text>
              <Text style={styles.earningsValue}>₹{(job.estimatedEarnings ?? 1200).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Before Completion Photos */}
        <View style={styles.photoSection}>
          <Text style={styles.photoSectionTitle}>Before Completion photo</Text>
          <View style={styles.photoSlotsRow}>
            <TouchableOpacity
              style={styles.photoSlot}
              activeOpacity={0.8}
              onPress={() => handleUploadPhoto('before')}>
              <Icon name="tray-arrow-up" size={20} color="#667085" />
              <Text style={styles.photoSlotText}>Tap to upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoSlot}
              activeOpacity={0.8}
              onPress={() => handleUploadPhoto('before')}>
              <Icon name="tray-arrow-up" size={20} color="#667085" />
              <Text style={styles.photoSlotText}>Tap to upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.photoSlot, styles.addPhotoSlot]}
              activeOpacity={0.8}
              onPress={() => handleUploadPhoto('before')}>
              <Icon name="plus" size={22} color="#667085" />
              <Text style={styles.photoSlotText}>Add Images</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* After Completion Photos */}
        <View style={styles.photoSection}>
          <Text style={styles.photoSectionTitle}>After Completion photo</Text>
          <View style={styles.photoSlotsRow}>
            <TouchableOpacity
              style={styles.photoSlot}
              activeOpacity={0.8}
              onPress={() => handleUploadPhoto('after')}>
              <Icon name="tray-arrow-up" size={20} color="#667085" />
              <Text style={styles.photoSlotText}>Tap to upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.photoSlot}
              activeOpacity={0.8}
              onPress={() => handleUploadPhoto('after')}>
              <Icon name="tray-arrow-up" size={20} color="#667085" />
              <Text style={styles.photoSlotText}>Tap to upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.photoSlot, styles.addPhotoSlot]}
              activeOpacity={0.8}
              onPress={() => handleUploadPhoto('after')}>
              <Icon name="plus" size={22} color="#667085" />
              <Text style={styles.photoSlotText}>Add Images</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Verification Checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          activeOpacity={0.8}
          onPress={() => setIsCustomerChecked(!isCustomerChecked)}>
          <View
            style={[
              styles.checkboxBox,
              isCustomerChecked && styles.checkboxBoxChecked,
            ]}>
            {isCustomerChecked && <Icon name="check" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>
            Work completed and checked with customer
          </Text>
        </TouchableOpacity>

        {/* Price Breakdown Card */}
        <View style={styles.card}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Gross Service Amount</Text>
            <Text style={styles.breakdownValue}>₹{(job.grossAmount ?? 1500).toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Platform Commission (20%)</Text>
            <Text style={styles.breakdownDeduction}>- ₹{(job.platformCommission ?? 300).toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Additional Charges</Text>
            <Text style={styles.breakdownValue}>₹{(job.additionalCharges ?? 500).toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>GST 18%</Text>
            <Text style={styles.breakdownValue}>₹{(job.gstAmount ?? 170).toLocaleString()}</Text>
          </View>
          <View style={[styles.breakdownRow, styles.netEarningsRow]}>
            <Text style={styles.netEarningsLabel}>Net Partner Earnings</Text>
            <Text style={styles.netEarningsValue}>₹{(job.netEarnings ?? 1870).toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Submit Completion Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.88}
          onPress={handleSubmitCompletion}>
          <Text style={styles.submitBtnText}>Submit Completion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#07522C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobCategory: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D2939',
  },
  statusBadge: {
    backgroundColor: '#E7F4EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#07522C',
  },
  scheduledRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  scheduleLabel: {
    fontSize: 11,
    color: '#667085',
  },
  scheduleValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
    marginTop: 2,
  },
  earningsLabel: {
    fontSize: 11,
    color: '#667085',
  },
  earningsValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#07522C',
    marginTop: 2,
  },
  photoSection: {
    marginBottom: 16,
  },
  photoSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 10,
  },
  photoSlotsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoSlot: {
    flex: 1,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  addPhotoSlot: {
    backgroundColor: '#F9FAFB',
    borderStyle: 'dashed',
  },
  photoSlotText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#667085',
    marginTop: 4,
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxBoxChecked: {
    backgroundColor: '#07522C',
    borderColor: '#07522C',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#344054',
    fontWeight: '500',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#667085',
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
  },
  breakdownDeduction: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D92D20',
  },
  netEarningsRow: {
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    marginTop: 6,
    paddingTop: 12,
  },
  netEarningsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
  },
  netEarningsValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#07522C',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  submitBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#07522C',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CompleteServiceScreen;
