import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../../components/BottomNavBar';

type JobTab = 'Upcoming' | 'Ongoing' | 'Completed';

const MyJobsScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<JobTab>('Upcoming');

  const upcomingJobs = [
    {
      id: 'job-1',
      title: 'Painting Service',
      category: 'Painting Service',
      bookingRef: 'CG-1044',
      area: 'Indiranagar, Bengaluru',
      fullAddress: 'Flat 402, Sunshine Apts, 100ft Road, Indiranagar, Bengaluru - 560038',
      timeStr: 'Today • 4:00 PM',
      scheduledTime: 'Today • 4:00 PM',
      distanceKm: '3.2 km',
      customerName: 'Karthik Rao',
      customerPhone: '+91 98765 11223',
      price: 2400,
      estimatedEarnings: 2400,
      badge: 'Upcoming',
    },
    {
      id: 'job-2',
      title: 'Electrical Wiring',
      category: 'Electrical Wiring',
      bookingRef: 'CG-1045',
      area: 'HSR Layout, Bengaluru',
      fullAddress: 'No 78, 27th Main, Sector 1, HSR Layout, Bengaluru - 560102',
      timeStr: 'Tomorrow • 9:00 AM',
      scheduledTime: 'Tomorrow • 9:00 AM',
      distanceKm: '4.5 km',
      customerName: 'Pooja Hegde',
      customerPhone: '+91 98765 33445',
      price: 950,
      estimatedEarnings: 950,
      badge: 'Upcoming',
    },
  ];

  const ongoingJobs = [
    {
      id: 'job-3',
      title: 'Plumbing Repair',
      category: 'Plumbing Repair',
      bookingRef: 'CG-1042',
      area: 'Koramangala, Bengaluru',
      fullAddress: 'Flat 202, Maple Apartments, 5th Block, Koramangala, Bengaluru - 560095',
      timeStr: 'Today • 10:30 AM',
      scheduledTime: 'Today • 10:30 AM',
      distanceKm: '2.4 km',
      customerName: 'Ananya Sharma',
      customerPhone: '+91 98765 01234',
      price: 1200,
      estimatedEarnings: 1200,
      grossAmount: 1500,
      platformCommission: 300,
      additionalCharges: 500,
      gstAmount: 170,
      netEarnings: 1870,
      badge: 'Service Started',
    },
  ];

  const completedJobs = [
    {
      id: 'job-4',
      title: 'Painting Service',
      bookingRef: 'CG-1039',
      area: 'Indiranagar, Bengaluru',
      timeStr: 'Today • 8:00 AM',
      price: 3200,
      badge: 'Completed',
      grossAmount: 4000,
      commission: 800,
      netEarnings: 3200,
      customer: 'Rahul Mehta',
      description: 'Bedroom wall touch-up completed. Work checked and approved by the customer.',
      txRef: 'TX-1039',
    },
    {
      id: 'job-5',
      title: 'Electrical Wiring',
      bookingRef: 'CG-1040',
      area: 'HSR Layout, Bengaluru',
      timeStr: 'Today • 9:00 AM',
      price: 1650,
      badge: 'Completed',
      grossAmount: 2062.5,
      commission: 412.5,
      netEarnings: 1650,
      customer: 'Priya Sundaram',
      description: 'Main switchboard MCB replacement and circuit safety test.',
      txRef: 'TX-1040',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>My Jobs</Text>
      </View>

      <View style={styles.contentWrapper}>
        {/* 3 Tabs */}
        <View style={styles.tabBar}>
          {(['Upcoming', 'Ongoing', 'Completed'] as JobTab[]).map(tab => {
            const isSelected = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabBtnText, isSelected && styles.tabBtnTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Upcoming Tab */}
          {activeTab === 'Upcoming' && (
            <View>
              <Text style={styles.subheadCountText}>
                {upcomingJobs.length} scheduled {upcomingJobs.length === 1 ? 'job' : 'jobs'}
              </Text>

              {upcomingJobs.map(job => (
                <View key={job.id} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.upcomingBadge}>
                      <Text style={styles.upcomingBadgeText}>{job.badge}</Text>
                    </View>
                  </View>

                  <Text style={styles.jobAreaText}>
                    {job.bookingRef} • {job.area}
                  </Text>

                  <View style={styles.timePriceRow}>
                    <Text style={styles.jobTimeText}>{job.timeStr}</Text>
                    <Text style={styles.jobPriceText}>₹{(job.price ?? 0).toLocaleString()}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('ActiveJob', { job })}>
                    <Text style={styles.actionBtnText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Ongoing Tab */}
          {activeTab === 'Ongoing' && (
            <View>
              <Text style={styles.subheadCountText}>
                {ongoingJobs.length} service in progress
              </Text>

              {ongoingJobs.map(job => (
                <View key={job.id} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.serviceStartedBadge}>
                      <Text style={styles.serviceStartedBadgeText}>{job.badge}</Text>
                    </View>
                  </View>

                  <Text style={styles.jobAreaText}>
                    {job.bookingRef} • {job.area}
                  </Text>

                  <View style={styles.timePriceRow}>
                    <Text style={styles.jobTimeText}>{job.timeStr}</Text>
                    <Text style={styles.jobPriceText}>₹{(job.price ?? 0).toLocaleString()}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('CompleteService', { job })}>
                    <Text style={styles.actionBtnText}>Continue Job</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Completed Tab */}
          {activeTab === 'Completed' && (
            <View>
              <Text style={styles.subheadCountText}>
                {completedJobs.length} completed today
              </Text>

              {completedJobs.map(job => (
                <View key={job.id} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>{job.badge}</Text>
                    </View>
                  </View>

                  <Text style={styles.jobAreaText}>
                    {job.bookingRef} • {job.area}
                  </Text>

                  <View style={styles.timePriceRow}>
                    <Text style={styles.jobTimeText}>{job.timeStr}</Text>
                    <Text style={styles.jobPriceText}>₹{(job.price ?? 0).toLocaleString()}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('JobSummary', { job })}>
                    <Text style={styles.actionBtnText}>View Summary</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

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
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#07522C',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#667085',
  },
  tabBtnTextActive: {
    fontWeight: '700',
    color: '#07522C',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  subheadCountText: {
    fontSize: 12,
    color: '#667085',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 16,
    marginBottom: 14,
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
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D2939',
  },
  upcomingBadge: {
    backgroundColor: '#E7F4EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  upcomingBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#07522C',
  },
  serviceStartedBadge: {
    backgroundColor: '#E7F4EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  serviceStartedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#07522C',
  },
  completedBadge: {
    backgroundColor: '#E7F4EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#07522C',
  },
  jobAreaText: {
    fontSize: 12,
    color: '#667085',
    marginBottom: 10,
  },
  timePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  jobTimeText: {
    fontSize: 12,
    color: '#667085',
  },
  jobPriceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D2939',
  },
  actionBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#07522C',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default MyJobsScreen;
