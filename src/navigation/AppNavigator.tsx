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

// Porter Module Screens (20-Screen Trip & Delivery Journey + Registrations)
import {
  DriverRegistrationScreen,
  TripRequestScreen,
  TripRequestDetailsScreen,
  TripAcceptedScreen,
  ActiveTripOverviewScreen,
  PickupDetailsScreen,
  NavigateToPickupScreen,
  VerifyPickupScreen,
  GoodsDetailsPhotoScreen,
  ConfirmQuantityScreen,
  ConfirmLoadingScreen,
  ReportPickupIssueScreen,
  AllPickupsCompletedScreen,
  FinalDestinationDetailsScreen,
  NavigateToCustomerScreen,
  DeliveryGoodsSummaryScreen,
  DeliveryConfirmationScreen,
  VerifyReceiverScreen,
  CustomerSignatureScreen,
  TripCompletedScreen,
  DeliveryRequestScreen,
  PickupStopsScreen,
  PickupVerificationScreen,
  DeliveryNavigationScreen,
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

      {/* Porter 20-Screen Trip & Delivery Journey */}
      <Stack.Screen name="TripRequest" component={TripRequestScreen} />
      <Stack.Screen name="TripRequestDetails" component={TripRequestDetailsScreen} />
      <Stack.Screen name="TripAccepted" component={TripAcceptedScreen} />
      <Stack.Screen name="ActiveTripOverview" component={ActiveTripOverviewScreen} />
      <Stack.Screen name="PickupDetails" component={PickupDetailsScreen} />
      <Stack.Screen name="NavigateToPickup" component={NavigateToPickupScreen} />
      <Stack.Screen name="VerifyPickup" component={VerifyPickupScreen} />
      <Stack.Screen name="GoodsDetailsPhoto" component={GoodsDetailsPhotoScreen} />
      <Stack.Screen name="ConfirmQuantity" component={ConfirmQuantityScreen} />
      <Stack.Screen name="ConfirmLoading" component={ConfirmLoadingScreen} />
      <Stack.Screen name="ReportPickupIssue" component={ReportPickupIssueScreen} />
      <Stack.Screen name="AllPickupsCompleted" component={AllPickupsCompletedScreen} />
      <Stack.Screen name="FinalDestinationDetails" component={FinalDestinationDetailsScreen} />
      <Stack.Screen name="NavigateToCustomer" component={NavigateToCustomerScreen} />
      <Stack.Screen name="DeliveryGoodsSummary" component={DeliveryGoodsSummaryScreen} />
      <Stack.Screen name="DeliveryConfirmation" component={DeliveryConfirmationScreen} />
      <Stack.Screen name="VerifyReceiver" component={VerifyReceiverScreen} />
      <Stack.Screen name="CustomerSignature" component={CustomerSignatureScreen} />
      <Stack.Screen name="TripCompleted" component={TripCompletedScreen} />

      {/* Route Aliases & Legacy Flows for Compatibility */}
      <Stack.Screen name="DeliveryRequest" component={TripRequestScreen} />
      <Stack.Screen name="PickupStops" component={ActiveTripOverviewScreen} />
      <Stack.Screen name="PickupVerification" component={VerifyPickupScreen} />
      <Stack.Screen name="DeliveryNavigation" component={NavigateToPickupScreen} />
      <Stack.Screen name="DeliveryCompleted" component={TripCompletedScreen} />
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
