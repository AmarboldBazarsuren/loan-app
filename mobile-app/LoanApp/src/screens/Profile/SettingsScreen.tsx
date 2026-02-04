// src/screens/Profile/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { userService } from '../../services/userService';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import Toast from 'react-native-toast-message';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: 'Бүх талбарыг бөглөнө үү',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: 'Нууц үг таарахгүй байна',
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: 'Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой',
      });
      return;
    }

    try {
      setLoading(true);
      await userService.updatePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      Toast.show({
        type: 'success',
        text1: 'Амжилттай',
        text2: 'Нууц үг солигдлоо',
      });
    } catch (error) {
      console.error('Change password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const SettingItem = ({
    icon,
    title,
    value,
    onValueChange,
  }: {
    icon: string;
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={22} color={colors.primary} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary + '50' }}
        thumbColor={value ? colors.primary : colors.gray}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Мэдэгдэл</Text>
        <View style={styles.card}>
          <SettingItem
            icon="notifications-outline"
            title="Push мэдэгдэл"
            value={notifications}
            onValueChange={setNotifications}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="mail-outline"
            title="Имэйл мэдэгдэл"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="chatbubble-outline"
            title="SMS мэдэгдэл"
            value={smsNotifications}
            onValueChange={setSmsNotifications}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Нууц үг солих</Text>
        <View style={styles.card}>
          <Input
            label="Одоогийн нууц үг"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
            placeholder="Одоогийн нууц үг"
          />

          <Input
            label="Шинэ нууц үг"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
            placeholder="Шинэ нууц үг"
          />

          <Input
            label="Нууц үг давтах"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
            placeholder="Нууц үг давтах"
          />

          <Button
            title="Солих"
            onPress={handleChangePassword}
            loading={loading}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Нууцлал</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>Үйлчилгээний нөхцөл</Text>
            <Icon name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.linkItem}>
            <Text style={styles.linkText}>Нууцлалын бодлого</Text>
            <Icon name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>
      </View>

      <LoadingOverlay visible={loading} message="Хадгалж байна..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: fontSizes.md,
    color: colors.text,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkText: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
});

export default SettingsScreen;