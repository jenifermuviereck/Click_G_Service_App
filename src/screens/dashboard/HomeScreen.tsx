import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import ClickGLogo from '../../components/ClickGLogo';
import BottomNavBar from '../../components/BottomNavBar';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';

const homeBanner = require('../../data/home.png');

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user, isOnline, toggleOnlineStatus } = useAuth();
  const { dashboardCounts } = useJobs();
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);

  const periodOptions = ['Today', 'Yesterday', 'Weekly', 'Custom'];

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
        {/* Promotional Banner with data/home.png */}
        <View style={styles.bannerContainer}>
          <Image
            source={homeBanner}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Offline / Online Availability Card (Matches Figma Status Card) */}
        <View style={styles.statusCard}>
          {/* Top Row: Icon + Title on left, Badge on right */}
          <View style={styles.statusTopRow}>
            <View style={styles.statusTitleGroup}>
              <View
                style={[
                  styles.statusRing,
                  isOnline ? styles.statusRingOnline : styles.statusRingOffline,
                ]}>
                <View
                  style={[
                    styles.statusInnerDot,
                    isOnline ? styles.statusInnerDotOnline : styles.statusInnerDotOffline,
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.statusTitleText,
                  isOnline ? styles.statusTitleOnline : styles.statusTitleOffline,
                ]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                isOnline ? styles.statusBadgeOnline : styles.statusBadgeOffline,
              ]}>
              <Text
                style={[
                  styles.statusBadgeText,
                  isOnline ? styles.statusBadgeTextOnline : styles.statusBadgeTextOffline,
                ]}>
                {isOnline ? 'Available' : 'Not Available'}
              </Text>
            </View>
          </View>

          {/* Bottom Row: Explanatory Subtext on left, Toggle Switch on right */}
          <View style={styles.statusBottomRow}>
            <Text style={styles.statusSubText}>
              {isOnline
                ? "You're online now and ready for jobs."
                : "You're offline now"}
            </Text>

            <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: '#FECDCA', true: '#C8E6D3' }}
              thumbColor={isOnline ? '#07522C' : '#D92D20'}
            />
          </View>
        </View>

        {/* Date Selector Dropdown (Matches Figma Comple...) */}
        <View style={styles.filterRow}>
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[
                styles.dateDropdownBtn,
                periodDropdownOpen && styles.dateDropdownBtnOpen,
              ]}
              activeOpacity={0.8}
              onPress={() => setPeriodDropdownOpen(prev => !prev)}>
              <Text style={styles.dateDropdownText}>{selectedPeriod}</Text>
              <Icon
                name={periodDropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#344054"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>

            {periodDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {periodOptions.map((option, idx) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      idx === periodOptions.length - 1 && { borderBottomWidth: 0 },
                      selectedPeriod === option && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedPeriod(option);
                      setPeriodDropdownOpen(false);
                    }}>
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedPeriod === option && styles.dropdownItemTextActive,
                      ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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
  bannerContainer: {
    width: '100%',
    aspectRatio: 358 / 119,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#07522C',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAECF0',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statusTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusRing: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statusRingOnline: {
    borderColor: '#12B76A',
  },
  statusRingOffline: {
    borderColor: '#F04438',
  },
  statusInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusInnerDotOnline: {
    backgroundColor: '#12B76A',
  },
  statusInnerDotOffline: {
    backgroundColor: '#F04438',
  },
  statusTitleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusTitleOnline: {
    color: '#07522C',
  },
  statusTitleOffline: {
    color: '#D92D20',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusBadgeOnline: {
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
  },
  statusBadgeOffline: {
    borderColor: '#D0D5DD',
    backgroundColor: '#FFFFFF',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadgeTextOnline: {
    color: '#07522C',
  },
  statusBadgeTextOffline: {
    color: '#F04438',
  },
  statusBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusSubText: {
    fontSize: 13,
    color: '#475467',
    flex: 1,
    paddingRight: 10,
  },
  filterRow: {
    alignItems: 'flex-end',
    marginBottom: 14,
    zIndex: 100,
  },
  dropdownWrapper: {
    position: 'relative',
    width: 120,
    zIndex: 100,
  },
  dateDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateDropdownBtnOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: '#F2F4F7',
  },
  dateDropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#344054',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 999,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  dropdownItemActive: {
    backgroundColor: '#F8F9FA',
  },
  dropdownItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#344054',
  },
  dropdownItemTextActive: {
    color: '#07522C',
    fontWeight: '700',
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
