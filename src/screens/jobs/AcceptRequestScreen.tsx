import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accept Request</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section Heading */}
        <View style={styles.subHeader}>
          <Text style={styles.subTitle}>New requests</Text>
          <Text style={styles.subDesc}>Review the service details before accepting a job</Text>
        </View>

        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="checkbox-marked-circle-outline" size={48} color="#07522C" />
            <Text style={styles.emptyTitle}>No pending requests</Text>
            <Text style={styles.emptySubtitle}>All incoming service requests have been reviewed.</Text>
          </View>
        ) : (
          requests.map(item => (
            <View key={item.id} style={styles.requestCard}>
              {/* Card Top Row */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.titleWithBadge}>
                  <Text style={styles.categoryTitle}>{item.category}</Text>
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceBadgeText}>{item.distanceKm}</Text>
                  </View>
                </View>
                <View style={styles.timeTag}>
                  <Text style={styles.timeTagText}>{item.scheduledTime}</Text>
                </View>
              </View>

              {/* Area location */}
              <Text style={styles.locationText}>{item.locationArea}</Text>

              {/* Customer Row */}
              <View style={styles.customerRow}>
                <View style={styles.customerAvatar}>
                  <Text style={styles.customerAvatarText}>{item.customerInitials}</Text>
                </View>
                <View style={styles.customerInfoCol}>
                  <Text style={styles.customerName}>{item.customerName}</Text>
                  <Text style={styles.customerPhone}>{item.customerPhone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.callIconBtn}
                  activeOpacity={0.8}
                  onPress={() => handleCall(item.customerPhone)}>
                  <Icon name="phone-outline" size={18} color="#07522C" />
                </TouchableOpacity>
              </View>

              {/* Description */}
              <Text style={styles.descriptionText}>{item.description}</Text>

              {/* Actions Row: Reject / Accept Job */}
              <View style={styles.cardActionRow}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  activeOpacity={0.8}
                  onPress={() => handleOpenRejectModal(item)}>
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acceptJobBtn}
                  activeOpacity={0.88}
                  onPress={() => handleAccept(item)}>
                  <Text style={styles.acceptJobBtnText}>Accept Job</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Reject Confirmation Modal (Screen 3 of Image 3) */}
      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {/* Close Cross */}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setRejectModalVisible(false)}>
              <Icon name="close" size={20} color="#D92D20" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Reject this request?</Text>
            <Text style={styles.modalSubtitle}>
              {selectedJobToReject?.category} • {selectedJobToReject?.bookingRef}
            </Text>
            <Text style={styles.modalMessage}>
              This request will be removed from your list. You won't be assigned this job.
            </Text>

            {/* Confirm Reject Button */}
            <TouchableOpacity
              style={styles.confirmRejectBtn}
              activeOpacity={0.85}
              onPress={handleConfirmReject}>
              <Text style={styles.confirmRejectBtnText}>Confirm</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelLinkBtn}
              activeOpacity={0.7}
              onPress={() => setRejectModalVisible(false)}>
              <Text style={styles.cancelLinkText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      <BottomNavBar currentTab="Jobs" />
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
  subHeader: {
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D2939',
  },
  subDesc: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  requestCard: {
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
    marginBottom: 6,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D2939',
  },
  distanceBadge: {
    backgroundColor: '#E7F4EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  distanceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#07522C',
  },
  timeTag: {
    backgroundColor: '#F2F4F7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeTagText: {
    fontSize: 11,
    color: '#667085',
    fontWeight: '500',
  },
  locationText: {
    fontSize: 12,
    color: '#667085',
    marginBottom: 12,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E7F4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  customerAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#07522C',
  },
  customerInfoCol: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D2939',
  },
  customerPhone: {
    fontSize: 12,
    color: '#667085',
  },
  callIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 13,
    color: '#344054',
    lineHeight: 18,
    marginBottom: 16,
  },
  cardActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
  acceptJobBtn: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#07522C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptJobBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D2939',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#667085',
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D2939',
    marginTop: 10,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667085',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  confirmRejectBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#D92D20',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  confirmRejectBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelLinkBtn: {
    paddingVertical: 8,
  },
  cancelLinkText: {
    fontSize: 14,
    color: '#344054',
    fontWeight: '600',
  },
});

export default AcceptRequestScreen;
