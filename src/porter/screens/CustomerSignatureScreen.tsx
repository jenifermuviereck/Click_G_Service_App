import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/Icon';
import showNotification from '../../common/utils/notification';

/**
 * Screen 19 - Customer Signature
 * Shows:
 *  - "One last confirmation."
 *  - Receiver name input ("Dinesh Kumar")
 *  - Customer signature box with "Clear signature"
 *  - Green banner: "Receiver OTP verified · confirm signature to complete the trip."
 *  - Confirm signature CTA (moves to Screen 20: TripCompleted)
 */
const CustomerSignatureScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [receiverName, setReceiverName] = useState('Dinesh Kumar');
  const [isSigned, setIsSigned] = useState(true);

  const handleConfirmSignature = () => {
    showNotification('Trip completed successfully!', 'success');
    navigation.navigate('TripCompleted');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-slate-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-1 -ml-1 mr-2"
          activeOpacity={0.7}>
          <Icon name="chevron-left" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-slate-800">Customer signature</Text>
      </View>

      <ScrollView className="flex-1 bg-slate-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-black text-slate-900 leading-tight">
          One last confirmation.
        </Text>

        {/* Receiver Name */}
        <View className="mt-5">
          <Text className="text-xs font-bold text-slate-700 mb-1.5">Receiver name</Text>
          <View className="bg-white rounded-xl p-3 border border-slate-200">
            <TextInput
              value={receiverName}
              onChangeText={setReceiverName}
              className="text-sm font-bold text-slate-900 p-0"
            />
          </View>
        </View>

        {/* Signature Box */}
        <View className="mt-5">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-bold text-slate-700">Customer signature</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsSigned(false);
                showNotification('Signature cleared', 'info');
              }}>
              <Text className="text-xs font-bold text-[#07522C]">Clear signature</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="w-full h-44 rounded-2xl bg-white border border-slate-200 items-center justify-center relative shadow-sm overflow-hidden"
            activeOpacity={0.8}
            onPress={() => setIsSigned(true)}>
            {isSigned ? (
              <View className="items-center justify-center">
                {/* Styled Signature stroke visual */}
                <View className="w-48 h-12 relative items-center justify-center">
                  <Text className="text-3xl italic font-serif text-slate-800 tracking-widest font-black">
                    Dinesh K.
                  </Text>
                  <View className="absolute bottom-1 w-40 h-[2px] bg-slate-700 -rotate-2" />
                </View>
              </View>
            ) : (
              <View className="items-center">
                <Icon name="draw" size={28} color="#94A3B8" />
                <Text className="text-xs text-slate-400 mt-2">Sign inside this box</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Green Verified Banner */}
        <View className="mt-5 bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 flex-row items-center">
          <Icon name="check-circle" size={18} color="#07522C" />
          <Text className="text-xs text-emerald-950 font-medium ml-2.5 flex-1">
            Receiver OTP verified · confirm signature to complete the trip.
          </Text>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="px-4 py-3 bg-white border-t border-slate-100">
        <Text className="text-[11px] font-medium text-slate-400 text-center mb-2">
          PT1025 · Receiver verification · Step 2 of 2
        </Text>
        <TouchableOpacity
          className="w-full bg-[#07522C] py-3.5 rounded-xl items-center justify-center shadow-sm"
          activeOpacity={0.85}
          onPress={handleConfirmSignature}>
          <Text className="text-base font-bold text-white tracking-wide">Confirm signature</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CustomerSignatureScreen;
