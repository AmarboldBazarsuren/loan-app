import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';

const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Нэр хамгийн багадаа 2 тэмдэгттэй байх ёстой')
    .required('Нэр оруулна уу'),
  lastName: Yup.string()
    .min(2, 'Овог хамгийн багадаа 2 тэмдэгттэй байх ёстой')
    .required('Овог оруулна уу'),
  email: Yup.string()
    .email('Имэйл хаяг буруу байна')
    .required('Имэйл хаяг оруулна уу'),
  phone: Yup.string()
    .matches(/^[0-9]{8}$/, 'Утасны дугаар 8 оронтой байх ёстой')
    .required('Утасны дугаар оруулна уу'),
  registerNumber: Yup.string()
    .matches(/^[А-ЯӨҮ]{2}[0-9]{8}$/, 'Регистр буруу (жнь: УБ12345678)')
    .required('Регистрийн дугаар оруулна уу'),
  dateOfBirth: Yup.string().required('Төрсөн огноо оруулна уу'),
  password: Yup.string()
    .min(6, 'Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой')
    .required('Нууц үг оруулна уу'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Нууц үг таарахгүй байна')
    .required('Нууц үг давтан оруулна уу'),
});

const RegisterScreen = ({ navigation }: any) => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (values: any, { setSubmitting }: any) => {
    try {
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      enableOnAndroid
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Бүртгүүлэх</Text>
        <Text style={styles.subtitle}>Шинэ хэрэглэгч үүсгэх</Text>
      </View>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          registerNumber: '',
          dateOfBirth: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
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
                name="person-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Нэр"
                placeholderTextColor={colors.gray}
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
              />
            </View>
            {touched.firstName && errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}

            <View style={styles.inputContainer}>
              <Icon
                name="person-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Овог"
                placeholderTextColor={colors.gray}
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
              />
            </View>
            {touched.lastName && errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}

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

            <View style={styles.inputContainer}>
              <Icon
                name="call-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Утасны дугаар (8 орон)"
                placeholderTextColor={colors.gray}
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                keyboardType="phone-pad"
                maxLength={8}
              />
            </View>
            {touched.phone && errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            <View style={styles.inputContainer}>
              <Icon
                name="card-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Регистр (жнь: УБ12345678)"
                placeholderTextColor={colors.gray}
                value={values.registerNumber}
                onChangeText={handleChange('registerNumber')}
                onBlur={handleBlur('registerNumber')}
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>
            {touched.registerNumber && errors.registerNumber && (
              <Text style={styles.errorText}>{errors.registerNumber}</Text>
            )}

            <View style={styles.inputContainer}>
              <Icon
                name="calendar-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Төрсөн огноо (YYYY-MM-DD)"
                placeholderTextColor={colors.gray}
                value={values.dateOfBirth}
                onChangeText={handleChange('dateOfBirth')}
                onBlur={handleBlur('dateOfBirth')}
              />
            </View>
            {touched.dateOfBirth && errors.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            )}

            <View style={styles.inputContainer}>
              <Icon
                name="lock-closed-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Нууц үг"
                placeholderTextColor={colors.gray}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.gray}
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <View style={styles.inputContainer}>
              <Icon
                name="lock-closed-outline"
                size={20}
                color={colors.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Нууц үг давтах"
                placeholderTextColor={colors.gray}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.gray}
                />
              </TouchableOpacity>
            </View>
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.registerButton,
                isSubmitting && styles.registerButtonDisabled,
              ]}
              onPress={handleSubmit as any}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.registerButtonText}>Бүртгүүлэх</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Бүртгэлтэй юу? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Нэвтрэх</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
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
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.sm,
    marginBottom: 10,
    marginLeft: 5,
  },
  registerButton: {
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
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
  },
  loginLink: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;