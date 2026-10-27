import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import UploadPickerModal from '../../components/UploadPickerModal';
import { useAuth } from '../../context/AuthContext';

const PersonalDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.name || 'Kumar');
  const [mobile] = useState(user?.mobile || '+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'kumar@gmail.com');
  const [address, setAddress] = useState('18, 6th Cross, BTM Layout');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [pincode, setPincode] = useState('560076');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const showNotification = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleSave = async () => {
    await updateUser({
      name: fullName,
      email,
      city,
    });
    showNotification('Personal details updated successfully');
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Top Header - Left-aligned Title with Back Button */}
      <View className="flex-row items-center px-4 py-3.5 bg-white border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1.5 -ml-1 mr-3"
          activeOpacity={0.7}>
          <Icon name="arrow-left" size={24} color="#07522C" />
        </TouchableOpacity>
        <Text className="text-lg sm:text-xl font-bold text-slate-900">Personal Details</Text>
      </View>

      <ScrollView contentContainerClassName="p-4 sm:p-5 pb-6" showsVerticalScrollIndicator={false}>
        {/* Profile Photo Upload */}
        {profilePhoto ? (
          <View className="flex-row items-center bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 mb-5">
            <Image
              source={{ uri: profilePhoto }}
              className="w-14 h-14 rounded-full border border-emerald-400 mr-3.5"
            />
            <View className="flex-1">
              <Text className="text-xs sm:text-sm font-bold text-slate-800">Profile Photo Added</Text>
              <Text className="text-[11px] text-emerald-800">Ready to update</Text>
            </View>
            <TouchableOpacity
              className="p-2 bg-white rounded-lg border border-slate-200 mr-2"
              onPress={() => setIsPickerVisible(true)}>
              <Text className="text-xs font-bold text-brand-green">Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-white rounded-lg border border-rose-200"
              onPress={() => setProfilePhoto(null)}>
              <Icon name="trash-can-outline" size={18} color="#D92D20" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="flex-row items-center justify-center border border-dashed border-emerald-300 bg-emerald-50/50 rounded-2xl py-4 mb-5"
            activeOpacity={0.8}
            onPress={() => setIsPickerVisible(true)}>
            <Icon name="camera-outline" size={20} color="#07522C" style={{ marginRight: 8 }} />
            <Text className="text-xs sm:text-sm font-bold text-brand-green">Add Profile Photo (optional)</Text>
          </TouchableOpacity>
        )}

        {/* Full Name */}
        <Text className="text-xs font-semibold text-slate-700 mb-1.5">Full Name *</Text>
        <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-4 justify-center">
          <TextInput
            className="text-xs sm:text-sm text-slate-900 p-0"
            value={fullName}
            onChangeText={v => setFullName(v.replace(/[^a-zA-Z\s]/g, ''))}
            placeholder="Full Name"
            placeholderTextColor="#98A2B3"
          />
        </View>

        {/* Mobile Number */}
        <Text className="text-xs font-semibold text-slate-700 mb-1.5">Mobile Number *</Text>
        <View className="border border-slate-200 rounded-xl px-3.5 h-12 bg-slate-100 mb-1 justify-center">
          <TextInput
            className="text-xs sm:text-sm text-slate-500 p-0"
            value={mobile}
            editable={false}
            placeholder="+91 Mobile"
            placeholderTextColor="#98A2B3"
          />
        </View>
        <Text className="text-[11px] text-slate-400 mb-4">Verified • Your registered mobile number</Text>

        {/* Email */}
        <Text className="text-xs font-semibold text-slate-700 mb-1.5">Email (optional)</Text>
        <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white mb-5 justify-center">
          <TextInput
            className="text-xs sm:text-sm text-slate-900 p-0"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            placeholderTextColor="#98A2B3"
            keyboardType="email-address"
          />
        </View>

        {/* Residential Address Section */}
        <Text className="text-sm sm:text-base font-bold text-slate-900 mb-3 pt-2">Residential address</Text>

        <Text className="text-xs font-semibold text-slate-700 mb-1.5">Address *</Text>
        <View className="border border-slate-300 rounded-xl p-3.5 h-20 bg-white mb-4">
          <TextInput
            className="text-xs sm:text-sm text-slate-900 p-0 flex-1"
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            placeholderTextColor="#98A2B3"
            multiline
          />
        </View>

        {/* City and PIN Code Row */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-xs font-semibold text-slate-700 mb-1.5">City *</Text>
            <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white justify-center">
              <TextInput
                className="text-xs sm:text-sm text-slate-900 p-0"
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor="#98A2B3"
              />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-xs font-semibold text-slate-700 mb-1.5">PIN Code *</Text>
            <View className="border border-slate-300 rounded-xl px-3.5 h-12 bg-white justify-center">
              <TextInput
                className="text-xs sm:text-sm text-slate-900 p-0"
                value={pincode}
                onChangeText={v => setPincode(v.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="560076"
                placeholderTextColor="#98A2B3"
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={6}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Save Button */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="p-4 bg-white border-t border-slate-100">
        <TouchableOpacity
          className="bg-brand-green w-full h-12 rounded-xl items-center justify-center shadow-md shadow-brand-green/20"
          activeOpacity={0.88}
          onPress={handleSave}>
          <Text className="text-white text-[15px] font-bold">Save Changes</Text>
        </TouchableOpacity>
      </View>

      <UploadPickerModal
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onPick={file => setProfilePhoto(file.uri)}
        title="Upload Profile Photo"
        allowDocs={false}
      />
    </SafeAreaView>
  );
};

export default PersonalDetailsScreen;
