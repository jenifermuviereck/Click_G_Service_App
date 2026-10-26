import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import ClickGLogo from '../../components/ClickGLogo';
import BottomNavBar from '../../components/BottomNavBar';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user, isOnline, toggleOnlineStatus } = useAuth();
  const { dashboardCounts } = useJobs();
  const [selectedPeriod, setSelectedPeriod] = useState('Today');

  const metrics = [
    { label: 'Assigned Job', count: dashboardCounts.assigned, route: 'AcceptRequest' },
    { label: 'Accept/Reject', count: dashboardCounts.acceptReject, route: 'AcceptRequest' },
    { label: 'In Progress', count: dashboardCounts.inProgress, route: 'ActiveJob' },
    { label: 'Pending Job', count: dashboardCounts.pending, route: 'AcceptRequest' },
    { label: 'Completed Jobs', count: dashboardCounts.completed, route: 'Earnings' },
    { label: 'Re Assigned Job', count: dashboardCounts.reAssigned, route: 'AcceptRequest' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        {/* ClickG Brand Logo */}
        <View style={styles.headerBrandRow}>
          <View style={styles.logoBadge}>
            <Icon name="truck-fast" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.headerBrandText}>ClickG</Text>
        </View>

        {/* Right Actions: Notification Bell + User Profile */}
        <View style={styles.headerRightActions}>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
            <Icon name="bell-outline" size={22} color="#344054" />
            <View style={styles.bellBadgeDot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileBadge}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatarImgCircle}>
              <Icon name="account" size={16} color="#07522C" />
            </View>
            <Text style={styles.profileNameText}>Hi, {user?.name || 'Kumar'}</Text>
            <Icon name="chevron-down" size={16} color="#667085" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Promotional Banner */}
        <View style={styles.promoCard}>
          <View style={styles.promoTextCol}>
            <Text style={styles.promoTitle}>Grow Your Business with ClickG</Text>
            <Text style={styles.promoSubtitle}>Join 200+ service partners earning daily!</Text>
          </View>
          <View style={styles.promoIllustrationBox}>
            <View style={styles.partnerFigure}>
              <Icon name="account-group" size={42} color="#A7F3D0" />
            </View>
          </View>
        </View>

        {/* Offline / Online Availability Card */}
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityLeft}>
            <View style={styles.statusIndicatorRow}>
              <View
                style={[
                  styles.statusDot,
                  isOnline ? styles.statusDotOnline : styles.statusDotOffline,
                ]}
              />
              <Text style={styles.statusTitleText}>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>
            <Text style={styles.statusSubText}>
              {isOnline ? "You're online now" : "You're offline now"}
            </Text>
          </View>

          <View style={styles.availabilityRight}>
            <View
              style={[
                styles.availabilityTag,
                isOnline ? styles.tagOnline : styles.tagOffline,
              ]}>
              <Text
                style={[
                  styles.tagText,
                  isOnline ? styles.tagTextOnline : styles.tagTextOffline,
                ]}>
                {isOnline ? 'Available' : 'Not Available'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: '#E4E7EC', true: '#07522C' }}
              thumbColor={isOnline ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Date Selector Dropdown */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.dateDropdownBtn} activeOpacity={0.8}>
            <Text style={styles.dateDropdownText}>{selectedPeriod}</Text>
            <Icon name="chevron-down" size={16} color="#344054" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* 2x3 Metric Cards Grid */}
        <View style={styles.metricGrid}>
          {metrics.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.metricCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(item.route)}>
              <Text style={styles.metricLabel}>{item.label}</Text>
              <Text style={styles.metricCount}>{item.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar currentTab="Home" />
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#07522C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  headerBrandText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#07522C',
    letterSpacing: -0.3,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellBtn: {
    position: 'relative',
    padding: 6,
    marginRight: 10,
  },
  bellBadgeDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  avatarImgCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#C8E6D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  profileNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
    marginRight: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#07522C',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
  },
  promoTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#D1E9DB',
    lineHeight: 16,
  },
  promoIllustrationBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerFigure: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  availabilityLeft: {
    flex: 1,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotOnline: {
    backgroundColor: '#10B981',
  },
  statusDotOffline: {
    backgroundColor: '#EF4444',
  },
  statusTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
  },
  statusSubText: {
    fontSize: 12,
    color: '#667085',
  },
  availabilityRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  tagOnline: {
    backgroundColor: '#E7F4EB',
  },
  tagOffline: {
    backgroundColor: '#FEE4E2',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tagTextOnline: {
    color: '#07522C',
  },
  tagTextOffline: {
    color: '#D92D20',
  },
  filterRow: {
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  dateDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateDropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#344054',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#667085',
    marginBottom: 8,
  },
  metricCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1D2939',
  },
});

export default HomeScreen;
