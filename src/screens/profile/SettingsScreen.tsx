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

const SettingsScreen = () => {
  const navigation = useNavigation<any>();

  const [jobAlerts, setJobAlerts] = useState(true);
  const [paymentUpdates, setPaymentUpdates] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="arrow-left" size={22} color="#07522C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <Text style={styles.sectionHeading}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.settingTitle}>Job request alerts</Text>
              <Text style={styles.settingDesc}>Get notified when a new service request arrives.</Text>
            </View>
            <Switch
              value={jobAlerts}
              onValueChange={setJobAlerts}
              trackColor={{ false: '#E4E7EC', true: '#07522C' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.settingTitle}>Payment updates</Text>
              <Text style={styles.settingDesc}>Receive updates when your earnings are paid.</Text>
            </View>
            <Switch
              value={paymentUpdates}
              onValueChange={setPaymentUpdates}
              trackColor={{ false: '#E4E7EC', true: '#07522C' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Privacy & Account Section */}
        <Text style={styles.sectionHeading}>Privacy &amp; account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
            <Text style={styles.linkTitle}>Terms of Service</Text>
            <View style={styles.linkRight}>
              <Text style={styles.viewText}>View</Text>
              <Icon name="chevron-right" size={18} color="#98A2B3" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
            <Text style={styles.linkTitle}>Privacy Policy</Text>
            <View style={styles.linkRight}>
              <Text style={styles.viewText}>View</Text>
              <Icon name="chevron-right" size={18} color="#98A2B3" />
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text style={styles.sectionHeading}>About</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>App</Text>
            <Text style={styles.aboutValue}>ClickG Service Partner</Text>
          </View>

          <View style={[styles.aboutRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
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
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2939',
    marginBottom: 10,
    marginTop: 6,
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D2939',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: '#667085',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F4F7',
    marginVertical: 12,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  linkTitle: {
    fontSize: 14,
    color: '#344054',
    fontWeight: '500',
  },
  linkRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    fontSize: 13,
    color: '#667085',
    marginRight: 4,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  aboutLabel: {
    fontSize: 13,
    color: '#667085',
  },
  aboutValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D2939',
  },
});

export default SettingsScreen;
