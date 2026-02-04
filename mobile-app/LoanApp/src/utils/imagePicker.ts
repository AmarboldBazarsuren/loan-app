// src/utils/imagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Зөвшөөрөл шаардлагатай',
        'Камер ашиглахын тулд зөвшөөрөл өгнө үү'
      );
      return false;
    }
  }
  return true;
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Зөвшөөрөл шаардлагатай',
        'Зургийн сан ашиглахын тулд зөвшөөрөл өгнө үү'
      );
      return false;
    }
  }
  return true;
};

export const pickImageFromCamera = async (): Promise<any | null> => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) return null;

  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }
    return null;
  } catch (error) {
    console.error('Camera error:', error);
    return null;
  }
};

export const pickImageFromLibrary = async (): Promise<any | null> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) return null;

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }
    return null;
  } catch (error) {
    console.error('Image picker error:', error);
    return null;
  }
};

export const showImagePickerOptions = (
  onCameraPress: () => void,
  onLibraryPress: () => void
) => {
  Alert.alert('Зураг сонгох', 'Зураг хаанаас авах вэ?', [
    {
      text: 'Камер',
      onPress: onCameraPress,
    },
    {
      text: 'Зургийн сан',
      onPress: onLibraryPress,
    },
    {
      text: 'Болих',
      style: 'cancel',
    },
  ]);
};