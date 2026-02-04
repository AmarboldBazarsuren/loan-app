import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../config/api';
import Toast from 'react-native-toast-message';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Имэйл хаяг буруу байна')
    .required('Имэйл хаяг оруулна уу'),
});

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async (values: any, { setSubmitting }: any) => {
    try {
      await api.post('/auth/forgot-password', values);
      setEmailSent(true);
      Toast.show({
        type: 'success',
        text1: 'Амжилттай',
        text2: 'Нууц үг сэргээх линк таны имэйл рүү илгээгдлээ',
      });
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Алдаа гарлаа. Дахин оролдоно уу.';
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Icon name="mail-outline" size={80} color={colors.primary} />
          <Text style={styles.successTitle}>Имэйл илгээгдлээ</Text>
          <Text style={styles.successText}>
            Нууц үг сэргээх зааварыг таны имэйл хаяг руу илгээлээ. Имэйлээ
            шалгана уу.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backButtonText}>Нэвтрэх хуудас руу буцах</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Нууц үг сэргээх</Text>
        <Text style={styles.subtitle}>
          Бүртгэлтэй имэйл хаягаа оруулна уу
        </Text>
      </View>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleForgotPassword}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Icon
                name="mail-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Имэйл хаяг"
                placeholderTextColor={colors.gray}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit as any}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Илгээх</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  headerBackButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: fontSizes.md,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.sm,
    marginBottom: 10,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 30,
    marginBottom: 15,
  },
  successText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  backButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;