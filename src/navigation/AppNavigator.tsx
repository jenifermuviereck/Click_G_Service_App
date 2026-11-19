import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Common Screens (Shared across Porter & Service)
import {
  LoginScreen,
  OtpVerificationScreen,
  HomeScreen,
  MainTabsScreen,
  EarningsScreen,
  TransactionDetailsScreen,
  ProfileScreen,
  PersonalDetailsScreen,
  DocumentsVerificationScreen,
  BankDetailsScreen,
  SkillsServicesScreen,
  HelpSupportScreen,
  SettingsScreen,
  NotificationScreen,
  NotificationTestScreen,
} from '../common/screens';

// Service Module Screens
import {
  PartnerRegistrationScreen,
  AcceptRequestScreen,
  ActiveJobScreen,
  CompleteServiceScreen,
  CompletionConfirmedScreen,
  JobSummaryScreen,
  MyJobsScreen,
} from '../service';

// Porter Module Screens
import {
  DriverRegistrationScreen,
  DeliveryRequestScreen,
  PickupStopsScreen,
  PickupVerificationScreen,
  DeliveryNavigationScreen,
  DeliveryConfirmationScreen,
  DeliveryCompletedScreen,
  BatchSummaryScreen,
  PorterDeliveriesScreen,
} from '../porter';

import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}>
        <ActivityIndicator size="large" color="#07522C" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Login'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
        {/* Auth Flows */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="PartnerRegistration" component={PartnerRegistrationScreen} />
        <Stack.Screen name="DriverRegistration" component={DriverRegistrationScreen} />

        {/* Dashboard Main Tabs (Static Bottom Bar, No Slide) */}
        <Stack.Screen name="MainTabs" component={MainTabsScreen} />
        <Stack.Screen name="Home" component={MainTabsScreen} />
        <Stack.Screen name="MyJobs" component={MainTabsScreen} />
        <Stack.Screen name="MyDeliveries" component={MainTabsScreen} />
        <Stack.Screen name="Earnings" component={MainTabsScreen} />
        <Stack.Screen name="Profile" component={MainTabsScreen} />

        {/* Service Jobs Detail Flows */}
        <Stack.Screen name="AcceptRequest" component={AcceptRequestScreen} />
        <Stack.Screen name="ActiveJob" component={ActiveJobScreen} />
        <Stack.Screen name="CompleteService" component={CompleteServiceScreen} />
        <Stack.Screen name="CompletionConfirmed" component={CompletionConfirmedScreen} />
        <Stack.Screen name="JobSummary" component={JobSummaryScreen} />

        {/* Porter Logistics Detail Flows */}
        <Stack.Screen name="DeliveryRequest" component={DeliveryRequestScreen} />
        <Stack.Screen name="PickupStops" component={PickupStopsScreen} />
        <Stack.Screen name="PickupVerification" component={PickupVerificationScreen} />
        <Stack.Screen name="DeliveryNavigation" component={DeliveryNavigationScreen} />
        <Stack.Screen name="DeliveryConfirmation" component={DeliveryConfirmationScreen} />
        <Stack.Screen name="DeliveryCompleted" component={DeliveryCompletedScreen} />
        <Stack.Screen name="BatchSummary" component={BatchSummaryScreen} />
        <Stack.Screen name="PorterDeliveries" component={PorterDeliveriesScreen} />

        {/* Notifications */}
        <Stack.Screen name="Notifications" component={NotificationScreen} />

        {/* Earnings Details */}
        <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />

        {/* Profile & Settings Sub-screens */}
        <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
        <Stack.Screen name="SkillsServices" component={SkillsServicesScreen} />
        <Stack.Screen name="DocumentsVerification" component={DocumentsVerificationScreen} />
        <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />

        {/* Dev Lab */}
        {(__DEV__ && NotificationTestScreen) ? (
          <Stack.Screen
            name="NotificationTest"
            component={NotificationTestScreen}
            options={{ title: '🔬 Notif Lab', headerShown: true }}
          />
        ) : null}

      </Stack.Navigator>
  );
};

export default AppNavigator;
