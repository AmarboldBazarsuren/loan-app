import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <Animatable.View
        animation="fadeInDown"
        delay={300}
        style={styles.header}
      >
        <Text style={styles.logo}>💰</Text>
        <Text style={styles.title}>Зээлийн Апп</Text>
        <Text style={styles.subtitle}>
          Хурдан, найдвартай, хялбар зээл
        </Text>
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        delay={600}
        style={styles.footer}
      >
        <View style={styles.features}>
          <FeatureItem icon="⚡" text="Шуурхай зөвшөөрөл" />
          <FeatureItem icon="🔒" text="Найдвартай систем" />
          <FeatureItem icon="💳" text="Олон төлбөрийн хэрэгсэл" />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Нэвтрэх</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>Бүртгүүлэх</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
};

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  features: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WelcomeScreen;