// src/screens/Home/LoanRequestScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { loanService } from '../../services/loanService';
import { useAuth } from '../../context/AuthContext';
import { LoanType } from '../../types';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import { formatMoney } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import Toast from 'react-native-toast-message';

const LoanRequestScreen = ({ navigation, route }: any) => {
  const { user } = useAuth();
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType | null>(null);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLoanTypes();
  }, []);

  useEffect(() => {
    if (route.params?.loanType) {
      const type = loanTypes.find((t) => t.nameEn === route.params.loanType);
      if (type) {
        setSelectedLoanType(type);
      }
    }
    if (route.params?.amount) {
      setAmount(route.params.amount.toString());
    }
    if (route.params?.duration) {
      setDuration(route.params.duration.toString());
    }
  }, [route.params, loanTypes]);

  const loadLoanTypes = async () => {
    try {
      setLoading(true);
      const data = await loanService.getLoanTypes();
      setLoanTypes(data);
      if (data.length > 0 && !selectedLoanType) {
        setSelectedLoanType(data[0]);
      }
    } catch (error) {
      console.error('Load loan types error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user?.isVerified) {
      Alert.alert(
        'Баталгаажуулалт шаардлагатай',
        'Зээл хүсэхийн тулд эхлээд баталгаажуулалт хийлгэнэ үү.',
        [
          { text: 'Болих', style: 'cancel' },
          {
            text: 'Баталгаажуулах',
            onPress: () => navigation.navigate('ProfileTab'),
          },
        ]
      );
      return;
    }

    if (!selectedLoanType) {
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: 'Зээлийн төрөл сонгоно уу',
      });
      return;
    }

    const amountNum = parseInt(amount);
    const durationNum = parseInt(duration);

    if (
      isNaN(amountNum) ||
      amountNum < selectedLoanType.minAmount ||
      amountNum > selectedLoanType.maxAmount
    ) {
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: `Зээлийн дүн ${formatMoney(selectedLoanType.minAmount)} - ${formatMoney(selectedLoanType.maxAmount)} хооронд байх ёстой`,
      });
      return;
    }

    if (
      isNaN(durationNum) ||
      durationNum < selectedLoanType.minDuration ||
      durationNum > selectedLoanType.maxDuration
    ) {
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: `Хугацаа ${selectedLoanType.minDuration} - ${selectedLoanType.maxDuration} сарын хооронд байх ёстой`,
      });
      return;
    }

    try {
      setSubmitting(true);
      await loanService.requestLoan({
        loanType: selectedLoanType.nameEn,
        amount: amountNum,
        duration: durationNum,
        purpose,
      });

      Toast.show({
        type: 'success',
        text1: 'Амжилттай',
        text2: 'Зээлийн хүсэлт илгээгдлээ',
      });

      navigation.navigate('LoansTab');
    } catch (error) {
      console.error('Request loan error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.sectionTitle}>Зээлийн төрөл</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLoanType?._id}
            onValueChange={(value) => {
              const type = loanTypes.find((t) => t._id === value);
              setSelectedLoanType(type || null);
            }}
            style={styles.picker}
          >
            {loanTypes.map((type) => (
              <Picker.Item
                key={type._id}
                label={`${type.icon} ${type.name}`}
                value={type._id}
              />
            ))}
          </Picker>
        </View>

        {selectedLoanType && (
          <View style={styles.loanTypeInfo}>
            <Text style={styles.infoText}>{selectedLoanType.description}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Дүн:</Text>
              <Text style={styles.infoValue}>
                {formatMoney(selectedLoanType.minAmount)} -{' '}
                {formatMoney(selectedLoanType.maxAmount)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Хугацаа:</Text>
              <Text style={styles.infoValue}>
                {selectedLoanType.minDuration} - {selectedLoanType.maxDuration} сар
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Хүү:</Text>
              <Text style={styles.infoValue}>
                {selectedLoanType.interestRate}% / сар
              </Text>
            </View>
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Зээлийн дүн</Text>
        <TextInput
          style={styles.input}
          placeholder="Дүн оруулах"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        {selectedLoanType && (
          <Text style={styles.hint}>
            {formatMoney(selectedLoanType.minAmount)} -{' '}
            {formatMoney(selectedLoanType.maxAmount)}
          </Text>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Хугацаа (сараар)</Text>
        <TextInput
          style={styles.input}
          placeholder="Хугацаа оруулах"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        {selectedLoanType && (
          <Text style={styles.hint}>
            {selectedLoanType.minDuration} - {selectedLoanType.maxDuration} сар
          </Text>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Зориулалт (заавал биш)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Зээлийн зориулалт..."
          value={purpose}
          onChangeText={setPurpose}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </Card>

      <Button
        title="Зээл хүсэх"
        onPress={handleSubmit}
        loading={submitting}
        style={styles.submitButton}
      />

      <LoadingOverlay visible={submitting} message="Хүсэлт илгээж байна..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  loanTypeInfo: {
    marginTop: 15,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSizes.sm,
    color: colors.text,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    fontSize: fontSizes.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
  },
  hint: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginTop: 8,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 30,
  },
});

export default LoanRequestScreen;