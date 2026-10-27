import React, { useState } from 'react';
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
              <Text style={styles.earningsValue}>₹{(job.estimatedEarnings ?? 1200).toLocaleString()}</Text>
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

        {/* In Progress Timeline Card (Matches Figma Information Card) */}
        <View style={styles.card}>
          <Text style={styles.timelineTitle}>In progress</Text>

          {!timelineExpanded ? (
            /* Collapsed State */
            <TouchableOpacity
              style={styles.timelineItem}
              activeOpacity={0.8}
              onPress={() => setTimelineExpanded(true)}>
              <View style={styles.timelineStepBadgeActive}>
                <Text style={styles.timelineStepNumActive}>1</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineStepTitle}>Accepted</Text>
                <Text style={styles.timelineStepTime}>{job.acceptedAt || '10:05 AM'}</Text>
              </View>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
              <Icon name="chevron-down" size={20} color="#344054" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          ) : (
            /* Expanded State */
            <View>
              {[
                { step: 1, title: 'Accepted', time: job.acceptedAt || '10:05 AM', current: true, done: true },
                { step: 2, title: 'On the Way', time: 'Pending', current: false, done: false },
                { step: 3, title: 'Arrived', time: 'Pending', current: false, done: false },
                { step: 4, title: 'Service Started', time: 'Pending', current: false, done: false },
                { step: 5, title: 'Service Completed', time: 'Submit completion to finish', current: false, done: false },
              ].map((item, idx) => (
                <View
                  key={item.step}
                  style={[
                    styles.timelineItemExpanded,
                    idx < 4 && styles.timelineItemBorder,
                  ]}>
                  <View
                    style={[
                      styles.timelineStepBadge,
                      item.current ? styles.timelineStepBadgeActive : styles.timelineStepBadgePending,
                    ]}>
                    <Text
                      style={[
                        styles.timelineStepNum,
                        item.current ? styles.timelineStepNumActive : styles.timelineStepNumPending,
                      ]}>
                      {item.step}
                    </Text>
                  </View>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineStepTitle,
                        !item.current && styles.timelineStepTitlePending,
                      ]}>
                      {item.title}
                    </Text>
                    <Text style={styles.timelineStepTime}>{item.time}</Text>
                  </View>
                  {item.current && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                  {idx === 0 && (
                    <TouchableOpacity
                      onPress={() => setTimelineExpanded(false)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{ marginLeft: 6 }}>
                      <Icon name="chevron-up" size={20} color="#344054" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
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
  timelineItemExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timelineItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  timelineStepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timelineStepBadgeActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#07522C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timelineStepBadgePending: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timelineStepNum: {
    fontSize: 12,
    fontWeight: '700',
  },
  timelineStepNumActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  timelineStepNumPending: {
    color: '#667085',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineContent: {
    flex: 1,
  },
  timelineStepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D2939',
  },
  timelineStepTitlePending: {
    fontSize: 13,
    fontWeight: '500',
    color: '#667085',
  },
  timelineStepTime: {
    fontSize: 11,
    color: '#667085',
    marginTop: 2,
  },
  currentBadge: {
    backgroundColor: '#ECFDF3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A6F4C5',
    marginRight: 4,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#027A48',
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
