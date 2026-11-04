import React from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  ToastAndroid,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from './Icon';

export interface PickedFile {
  uri: string;
  name: string;
  size: string;
  type: 'image' | 'document';
}

interface UploadPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onPick: (file: PickedFile) => void;
  title?: string;
  allowDocs?: boolean;
}

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
  'https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=800&q=80',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
];

const UploadPickerModal: React.FC<UploadPickerModalProps> = ({
  visible,
  onClose,
  onPick,
  title = 'Upload Photo or File',
  allowDocs = true,
}) => {
  const notify = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', msg);
    }
  };

  const handleSelectOption = (sourceType: 'camera' | 'gallery' | 'document') => {
    if (sourceType === 'camera') {
      const randomImg = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
      notify('Photo captured successfully');
      onPick({
        uri: randomImg,
        name: `doc_photo_${Date.now().toString().slice(-4)}.jpg`,
        size: '2.1 MB',
        type: 'image',
      });
    } else if (sourceType === 'gallery') {
      const randomImg = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
      notify('Image selected from gallery');
      onPick({
        uri: randomImg,
        name: `doc_image_${Date.now().toString().slice(-4)}.jpg`,
        size: '1.6 MB',
        type: 'image',
      });
    } else {
      notify('Document selected');
      onPick({
        uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        name: `verified_doc_${Date.now().toString().slice(-4)}.pdf`,
        size: '480 KB',
        type: 'document',
      });
    }
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 99 }]} className="justify-end">
      {/* Backdrop touch area to dismiss */}
      <Pressable
        style={StyleSheet.absoluteFill}
        className="bg-black/50"
        onPress={onClose}
        accessibilityLabel="Close upload picker"
      />

      {/* Bottom Sheet Card */}
      <View
        className="bg-white rounded-t-3xl p-5 pb-8 border-t border-slate-200 w-full shadow-2xl"
        style={{ zIndex: 10000, elevation: 100 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between pb-4 mb-2 border-b border-slate-100">
          <Text className="text-base sm:text-lg font-bold text-slate-900">{title}</Text>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            className="p-1 -mr-1"
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Icon name="close" size={22} color="#667085" />
          </Pressable>
        </View>

        {/* Options */}
        <View className="gap-3">
          <Pressable
            className="flex-row items-center p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            onPress={() => handleSelectOption('camera')}>
            <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3.5">
              <Icon name="camera-outline" size={22} color="#07522C" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-800">Take Photo</Text>
              <Text className="text-xs text-slate-500">Capture using device camera</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#98A2B3" />
          </Pressable>

          <Pressable
            className="flex-row items-center p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
            onPress={() => handleSelectOption('gallery')}>
            <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3.5">
              <Icon name="image-outline" size={22} color="#07522C" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-800">Choose from Gallery</Text>
              <Text className="text-xs text-slate-500">Select photos from your gallery</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#98A2B3" />
          </Pressable>

          {allowDocs && (
            <Pressable
              className="flex-row items-center p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
              style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
              onPress={() => handleSelectOption('document')}>
              <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3.5">
                <Icon name="file-document-outline" size={22} color="#07522C" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-slate-800">Browse Files</Text>
                <Text className="text-xs text-slate-500">PDF, JPG, PNG up to 10 MB</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#98A2B3" />
            </Pressable>
          )}
        </View>

        {/* Cancel Button */}
        <Pressable
          className="mt-4 h-12 rounded-xl bg-slate-100 items-center justify-center"
          style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
          onPress={onClose}>
          <Text className="text-sm font-bold text-slate-700">Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UploadPickerModal;