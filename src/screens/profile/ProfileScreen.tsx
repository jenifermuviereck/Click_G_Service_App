import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import BottomNavBar from '../../components/BottomNavBar';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const menuItems = [
    {
      title: 'Personal Details',
      icon: 'account-outline',
      onPress: () => navigation.navigate('PersonalDetails'),
    },
    {
      title: 'Skills & Services',
      icon: 'wrench-outline',
      onPress: () => {},
    },
    {
      title: 'Documents & Verification',
      icon: 'shield-check-outline',
      onPress: () => navigation.navigate('DocumentsVerification'),
    },
    {
      title: 'Bank Details',
      icon: 'bank-outline',
      onPress: () => navigation.navigate('BankDetails'),
    },
    {
      title: 'Help & Support',
      icon: 'headset',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      title: 'Settings',
      icon: 'cog-outline',
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>K</Text>
          </View>
          <View style={styles.profileInfoCol}>
            <Text style={styles.profileName}>{user?.name || 'Kumar'}</Text>
            <Text style={styles.profilePhone}>{user?.mobile || '+91 98765 43210'}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>Verified partner</Text>
            </View>
          </View>
        </View>

        {/* Menu Navigation Card */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuRow,
                index === menuItems.length - 1 && { borderBottomWidth: 0 },
              ]}
              activeOpacity={0.7}
              onPress={item.onPress}>
              <Icon name={item.icon} size={20} color="#07522C" style={styles.menuIcon} />
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Icon name="chevron-right" size={18} color="#98A2B3" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Row Card */}
        <View style={styles.logoutCard}>
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => setLogoutModalVisible(true)}>
            <Icon name="logout" size={20} color="#D92D20" style={styles.menuIcon} />
            <Text style={[styles.menuTitle, { color: '#D92D20' }]}>Logout</Text>
            <Icon name="chevron-right" size={18} color="#98A2B3" />
          </TouchableOpacity>
        </View>

        {/* Version Footer */}
        <Text style={styles.versionFooter}>ClickG Service Partner • Version 1.0.0</Text>
      </ScrollView>

      {/* Logout Confirmation Modal (Screen 6 of Image 2) */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.logoutIconCircle}>
              <Icon name="logout" size={24} color="#D92D20" />
            </View>

            <Text style={styles.modalTitle}>Logout of ClickG?</Text>
            <Text style={styles.modalDesc}>
              You'll need to verify your mobile number again to manage your service jobs.
            </Text>

            <TouchableOpacity
              style={styles.confirmLogoutBtn}
              activeOpacity={0.85}
              onPress={handleConfirmLogout}>
              <Text style={styles.confirmLogoutBtnText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.stayLoggedInBtn}
              activeOpacity={0.8}
              onPress={() => setLogoutModalVisible(false)}>
              <Text style={styles.stayLoggedInBtnText}>Stay Logged In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      <BottomNavBar currentTab="Profile" />
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E7F4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: '#07522C',
  },
  profileInfoCol: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D2939',
  },
  profilePhone: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
    marginBottom: 6,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E7F4EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#07522C',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECF0',
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAECF0',
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  menuIcon: {
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#344054',
  },
  versionFooter: {
    fontSize: 11,
    color: '#98A2B3',
    textAlign: 'center',
    marginTop: 6,
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
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE4E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 6,
  },
  modalDesc: {
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  confirmLogoutBtn: {
    width: '100%',
    height: 46,
    backgroundColor: '#D92D20',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  confirmLogoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stayLoggedInBtn: {
    width: '100%',
    height: 46,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stayLoggedInBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
  },
});

export default ProfileScreen;
