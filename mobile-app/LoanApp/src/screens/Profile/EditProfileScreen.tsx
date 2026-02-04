// src/screens/Profile/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { pickImageFromCamera, pickImageFromLibrary, showImagePickerOptions } from '../../utils/imagePicker';
import Toast from 'react-native-toast-message';

const Tab = createMaterialTopTabNavigator();

const EditProfileScreen = ({ navigation, route }: any) => {
  const initialTab = route.params?.tab || 'profile';

  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarIndicatorStyle: { backgroundColor: colors.primary },
        tabBarLabelStyle: { fontSize: fontSizes.sm, fontWeight: '600' },
        tabBarStyle: { backgroundColor: colors.white },
      }}
    >
      <Tab.Screen name="profile" component={ProfileTab} options={{ title: 'Профайл' }} />
      <Tab.Screen name="verification" component={VerificationTab} options={{ title: 'Баталгаажуулалт' }} />
      <Tab.Screen name="address" component={AddressTab} options={{ title: 'Хаяг' }} />
    </Tab.Navigator>
  );
};

// Profile Tab
const ProfileTab = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = () => {
    showImagePickerOptions(
      async () => {
        const image = await pickImageFromCamera();
        if (image) setProfileImage(image);
      },
      async () => {
        const image = await pickImageFromLibrary();
        if (image) setProfileImage(image);
      }
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const data = await userService.updateProfile({
        firstName,
        lastName,
        phone,
        profileImage,
      });

      updateUser(data);
      await refreshUser();

      Toast.show({
        type: 'success',
        text1: 'Амжилттай',
        text2: 'Профайл шинэчлэгдлээ',
      });
    } catch (error) {
      console.error('Update profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handlePickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage.uri }} style={styles.avatar} />
          ) : user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={50} color={colors.gray} />
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Icon name="camera" size={20} color={colors.white} />
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>Зураг солих</Text>
      </View>

      <Input
        label="Нэр"
        value={firstName}
        onChangeText={setFirstName}
        leftIcon="person-outline"
        placeholder="Нэр оруулах"
      />

      <Input
        label="Овог"
        value={lastName}
        onChangeText={setLastName}
        leftIcon="person-outline"
        placeholder="Овог оруулах"
      />

      <Input
        label="Утасны дугаар"
        value={phone}
        onChangeText={setPhone}
        leftIcon="call-outline"
        placeholder="Утасны дугаар"
        keyboardType="phone-pad"
        maxLength={8}
      />

      <Input
        label="Имэйл"
        value={user?.email}
        editable={false}
        leftIcon="mail-outline"
      />

      <Button
        title="Хадгалах"
        onPress={handleSave}
        loading={loading}
        style={styles.saveButton}
      />

      <LoadingOverlay visible={loading} message="Хадгалж байна..." />
    </ScrollView>
  );
};

// Verification Tab
const VerificationTab = () => {
  const { user, refreshUser } = useAuth();
  const [frontImage, setFrontImage] = useState<any>(null);
  const [backImage, setBackImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePickFront = () => {
    showImagePickerOptions(
      async () => {
        const image = await pickImageFromCamera();
        if (image) setFrontImage(image);
      },
      async () => {
        const image = await pickImageFromLibrary();
        if (image) setFrontImage(image);
      }
    );
  };

  const handlePickBack = () => {
    showImagePickerOptions(
      async () => {
        const image = await pickImageFromCamera();
        if (image) setBackImage(image);
      },
      async () => {
        const image = await pickImageFromLibrary();
        if (image) setBackImage(image);
      }
    );
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage) {
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: 'Иргэний үнэмлэхний хоёр талыг оруулна уу',
      });
      return;
    }

    try {
      setLoading(true);
      await userService.uploadIdCard(frontImage, backImage);
      await refreshUser();

      Toast.show({
        type: 'success',
        text1: 'Амжилттай',
        text2: 'Баталгаажуулалт илгээгдлээ',
      });
    } catch (error) {
      console.error('Upload ID card error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (user?.verificationStatus === 'approved') return colors.success;
    if (user?.verificationStatus === 'rejected') return colors.error;
    return colors.warning;
  };

  const getStatusText = () => {
    if (user?.verificationStatus === 'approved') return 'Баталгаажсан';
    if (user?.verificationStatus === 'rejected') return 'Татгалзсан';
    return 'Хүлээгдэж буй';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.statusCard, { backgroundColor: getStatusColor() + '10' }]}>
        <Icon name="information-circle" size={24} color={getStatusColor()} />
        <View style={styles.statusText}>
          <Text style={[styles.statusTitle, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          <Text style={styles.statusSubtitle}>
            {user?.verificationStatus === 'approved'
              ? 'Та баталгаажсан байна'
              : user?.verificationStatus === 'rejected'
              ? 'Таны баталгаажуулалт татгалзагдлаа'
              : 'Баталгаажуулалт хянагдаж байна'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Иргэний үнэмлэх</Text>
      <Text style={styles.sectionSubtitle}>
        Иргэний үнэмлэхний урд ба хойд талын зургийг оруулна уу
      </Text>

      <View style={styles.idCardContainer}>
        <TouchableOpacity style={styles.idCard} onPress={handlePickFront}>
          {frontImage ? (
            <Image source={{ uri: frontImage.uri }} style={styles.idCardImage} />
          ) : user?.idCardFront ? (
            <Image source={{ uri: user.idCardFront }} style={styles.idCardImage} />
          ) : (
            <View style={styles.idCardPlaceholder}>
              <Icon name="card-outline" size={40} color={colors.gray} />
              <Text style={styles.idCardText}>Урд тал</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.idCard} onPress={handlePickBack}>
          {backImage ? (
            <Image source={{ uri: backImage.uri }} style={styles.idCardImage} />
          ) : user?.idCardBack ? (
            <Image source={{ uri: user.idCardBack }} style={styles.idCardImage} />
          ) : (
            <View style={styles.idCardPlaceholder}>
              <Icon name="card-outline" size={40} color={colors.gray} />
              <Text style={styles.idCardText}>Ар тал</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {user?.verificationStatus !== 'approved' && (
        <Button
          title="Баталгаажуулалт илгээх"
          onPress={handleSubmit}
          loading={loading}
          style={styles.saveButton}
        />
      )}

      <LoadingOverlay visible={loading} message="Илгээж байна..." />
    </ScrollView>
  );
};

// Address Tab
const AddressTab = () => {
  const { user, refreshUser } = useAuth();
  const [city, setCity] = useState(user?.address?.city || '');
  const [district, setDistrict] = useState(user?.address?.district || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [detail, setDetail] = useState(user?.address?.detail || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await userService.updateAddress({ city, district, street, detail });
      await refreshUser();

      Toast.show({
        type: 'success',
        text1: 'Амжилттай',
        text2: 'Хаяг шинэчлэгдлээ',
      });
    } catch (error) {
      console.error('Update address error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Input
        label="Хот/Аймаг"
        value={city}
        onChangeText={setCity}
        leftIcon="location-outline"
        placeholder="Хот/Аймаг"
      />

      <Input
        label="Дүүрэг/Сум"
        value={district}
        onChangeText={setDistrict}
        leftIcon="location-outline"
        placeholder="Дүүрэг/Сум"
      />

      <Input
        label="Гудамж/Хороо"
        value={street}
        onChangeText={setStreet}
        leftIcon="location-outline"
        placeholder="Гудамж/Хороо"
      />

      <Input
        label="Дэлгэрэнгүй хаяг"
        value={detail}
        onChangeText={setDetail}
        leftIcon="home-outline"
        placeholder="Байр, тоот, давхар..."
        multiline
        numberOfLines={3}
      />

      <Button
        title="Хадгалах"
        onPress={handleSave}
        loading={loading}
        style={styles.saveButton}
      />

      <LoadingOverlay visible={loading} message="Хадгалж байна..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.border,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarHint: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 10,
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  statusText: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: 3,
  },
  statusSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  idCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  idCard: {
    width: '48%',
    aspectRatio: 1.6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  idCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  idCardPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  idCardText: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    marginTop: 8,
  },
});

export default EditProfileScreen;