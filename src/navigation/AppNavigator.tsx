import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import PartnerRegistrationScreen from '../screens/auth/PartnerRegistrationScreen';
import HomeScreen from '../screens/dashboard/HomeScreen';
import AcceptRequestScreen from '../screens/jobs/AcceptRequestScreen';
import MyJobsScreen from '../screens/jobs/MyJobsScreen';
import ActiveJobScreen from '../screens/jobs/ActiveJobScreen';
import CompleteServiceScreen from '../screens/jobs/CompleteServiceScreen';
import CompletionConfirmedScreen from '../screens/jobs/CompletionConfirmedScreen';
import JobSummaryScreen from '../screens/jobs/JobSummaryScreen';
import EarningsScreen from '../screens/earnings/EarningsScreen';
import TransactionDetailsScreen from '../screens/earnings/TransactionDetailsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PersonalDetailsScreen from '../screens/profile/PersonalDetailsScreen';
import DocumentsVerificationScreen from '../screens/profile/DocumentsVerificationScreen';
import BankDetailsScreen from '../screens/profile/BankDetailsScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
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
    <NavigationContainer>
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

        {/* Dashboard & Jobs Flows */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MyJobs" component={MyJobsScreen} />
        <Stack.Screen name="AcceptRequest" component={AcceptRequestScreen} />
        <Stack.Screen name="ActiveJob" component={ActiveJobScreen} />
        <Stack.Screen name="CompleteService" component={CompleteServiceScreen} />
        <Stack.Screen name="CompletionConfirmed" component={CompletionConfirmedScreen} />
        <Stack.Screen name="JobSummary" component={JobSummaryScreen} />

        {/* Earnings & Transactions */}
        <Stack.Screen name="Earnings" component={EarningsScreen} />
        <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />

        {/* Profile & Settings Sub-screens */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
        <Stack.Screen name="DocumentsVerification" component={DocumentsVerificationScreen} />
        <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
