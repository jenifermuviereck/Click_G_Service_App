import React from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from './Icon';
import showNotification from '../common/utils/notification';

export interface PickedFile {
  uri: string;
  name: string;
  size: string;
  type?: string;
}

interface UploadPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onPick: (file: PickedFile) => void;
  title?: string;
  allowDocs?: boolean;
}

const UploadPickerModal: React.FC<UploadPickerModalProps> = ({
  visible,
  onClose,
  onPick,
  title = 'Upload Photo or File',
  allowDocs = true,
}) => {
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Click G needs access to your camera to take document and profile photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const handleSelectOption = async (sourceType: 'camera' | 'gallery' | 'document') => {
    onClose();

    try {
      if (sourceType === 'camera') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
          showNotification('Camera permission is required');
          return;
        }

        const result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          saveToPhotos: false,
        });

        if (result.didCancel) return;
        if (result.errorCode) {
          showNotification(result.errorMessage || 'Camera error');
          return;
        }

        if (result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          if (asset.uri) {
            onPick({
              uri: asset.uri,
              name: asset.fileName || `camera_${Date.now()}.jpg`,
              size: asset.fileSize ? `${(asset.fileSize / 1024).toFixed(0)} KB` : '1.2 MB',
              type: asset.type || 'image/jpeg',
            });
          }
        }
      } else {
        const result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          selectionLimit: 1,
        });

        if (result.didCancel) return;
        if (result.errorCode) {
          showNotification(result.errorMessage || 'Gallery error');
          return;
        }

        if (result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          if (asset.uri) {
            onPick({
              uri: asset.uri,
              name: asset.fileName || `file_${Date.now()}.jpg`,
              size: asset.fileSize ? `${(asset.fileSize / 1024).toFixed(0)} KB` : '1.2 MB',
              type: asset.type || 'image/jpeg',
            });
          }
        }
      }
    } catch (err: any) {
      console.warn('[UploadPickerModal] error:', err);
      showNotification('Failed to pick file');
    }
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