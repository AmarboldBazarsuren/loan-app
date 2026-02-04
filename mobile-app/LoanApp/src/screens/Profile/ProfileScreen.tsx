// src/screens/Profile/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import { formatPhone } from '../../utils/formatters';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Гарах', 'Та гарахдаа итгэлтэй байна уу?', [
      { text: 'Болих', style: 'cancel' },
      {
        text: 'Тийм',
        onPress: async () => {
          await logout();
        },
        style: 'destructive',
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Профайл засах',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'card-outline',
      title: 'Баталгаажуулалт',
      onPress: () => navigation.navigate('EditProfile', { tab: 'verification' }),
      badge: !user?.isVerified ? 'Шаардлагатай' : undefined,
    },
    {
      icon: 'settings-outline',
      title: 'Тохиргоо',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Тусламж',
      onPress: () => {},
    },
    {
      icon: 'information-circle-outline',
      title: 'Апп-н тухай',
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Icon name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.phone}>{formatPhone(user?.phone || '')}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.creditScore || 0}</Text>
              <Text style={styles.statLabel}>Кредит оноо</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user?.activeLoans || 0}</Text>
              <Text style={styles.statLabel}>Идэвхтэй зээл</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {!user?.isVerified && (
          <TouchableOpacity
            style={styles.verificationBanner}
            onPress={() => navigation.navigate('EditProfile', { tab: 'verification' })}
          >
            <Icon name="alert-circle" size={24} color={colors.warning} />
            <View style={styles.verificationText}>
              <Text style={styles.verificationTitle}>Баталгаажуулалт шаардлагатай</Text>
              <Text style={styles.verificationSubtitle}>
                Зээл авахын тулд баталгаажуулалт хийлгэнэ үү
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.warning} />
          </TouchableOpacity>
        )}

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Icon name={item.icon} size={22} color={colors.primary} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Icon name="chevron-forward" size={20} color={colors.gray} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Гарах</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white + '30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  avatarText: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  name: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  email: {
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 3,
  },
  phone: {
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.white + '50',
  },
  statValue: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '10',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  verificationText: {
    flex: 1,
    marginLeft: 12,
  },
  verificationTitle: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.warning,
    marginBottom: 3,
  },
  verificationSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  menu: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    color: colors.white,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutText: {
    fontSize: fontSizes.md,
    color: colors.error,
    fontWeight: '600',
    marginLeft: 8,
  },
  version: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfileScreen;