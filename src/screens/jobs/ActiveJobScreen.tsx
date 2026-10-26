import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../components/Icon';
import { useJobs } from '../../context/JobContext';

const ActiveJobScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { activeJob } = useJobs();

  const job = route?.params?.job || activeJob || {
    id: 'req-1',
    bookingRef: 'CG-1042',
    category: 'Plumbing Repair',
    distanceKm: '2.4 km',
    scheduledTime: 'Today • 10:30 AM',
    fullAddress: 'Flat 202, Maple Apartments, 5th Block, Koramangala, Bengaluru - 560095',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98765 01234',
    estimatedEarnings: 1200,
    acceptedAt: '10:35 AM',
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
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Job</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.jobCategory}>{job.category}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Accepted</Text>
            </View>
          </View>

          <Text style={styles.bookingRefText}>Booking ID • {job.bookingRef}</Text>

          <View style={styles.scheduledRow}>
            <View>
              <Text style={styles.scheduleLabel}>Scheduled</Text>
              <Text style={styles.scheduleValue}>{job.scheduledTime}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.earningsLabel}>Estimated earnings</Text>
              <Text style={styles.earningsValue}>₹{job.estimatedEarnings.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Service Address Card */}
        <View style={styles.card}>
          <View style={styles.addressHeaderRow}>
            <Icon name="map-marker-outline" size={18} color="#07522C" style={{ marginRight: 6 }} />
            <Text style={styles.addressSectionTitle}>Service address • {job.distanceKm} away</Text>
          </View>

          <Text style={styles.fullAddressText}>{job.fullAddress}</Text>

          {/* Action Links: View Route & Contact Customer */}
          <View style={styles.addressActionsRow}>
            <TouchableOpacity style={styles.actionLink} activeOpacity={0.7} onPress={handleOpenMap}>
              <Icon name="navigation-variant-outline" size={16} color="#07522C" style={{ marginRight: 4 }} />
              <Text style={styles.actionLinkText}>View Route</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionLink}
              activeOpacity={0.7}
              onPress={handleContactCustomer}>
              <Icon name="phone-outline" size={16} color="#07522C" style={{ marginRight: 4 }} />
              <Text style={styles.actionLinkText}>Contact Customer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* In Progress Timeline Card */}
        <View style={styles.card}>
          <Text style={styles.timelineTitle}>In progress</Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineStepBadge}>
              <Text style={styles.timelineStepNum}>1</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStepTitle}>Accepted</Text>
              <Text style={styles.timelineStepTime}>{job.acceptedAt || '10:35 AM'}</Text>
            </View>
            <Icon name="chevron-down" size={20} color="#07522C" />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Start Navigation Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.startNavBtn}
          activeOpacity={0.88}
          onPress={handleStartNavigation}>
          <Text style={styles.startNavBtnText}>Start Navigation</Text>
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
    marginBottom: 4,
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
  bookingRefText: {
    fontSize: 12,
    color: '#667085',
    marginBottom: 14,
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
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#344054',
  },
  fullAddressText: {
    fontSize: 13,
    color: '#475467',
    lineHeight: 18,
    marginBottom: 14,
  },
  addressActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#07522C',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineStepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#07522C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  timelineStepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineContent: {
    flex: 1,
  },
  timelineStepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
  },
  timelineStepTime: {
    fontSize: 11,
    color: '#667085',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  startNavBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#07522C',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startNavBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ActiveJobScreen;
