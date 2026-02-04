// src/screens/Loans/PaymentScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { loanService } from '../../services/loanService';
import { paymentService } from '../../services/paymentService';
import { Loan, PaymentMethod } from '../../types';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import { formatMoney } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import Toast from 'react-native-toast-message';

const PaymentScreen = ({ navigation, route }: any) => {
  const { loanId } = route.params;
  const [loan, setLoan] = useState<Loan | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loanData, methodsData] = await Promise.all([
        loanService.getLoanById(loanId),
        paymentService.getPaymentMethods(),
      ]);

      setLoan(loanData);
      setPaymentMethods(methodsData);

      if (loanData) {
        setAmount(loanData.monthlyPayment.toString());
      }
      if (methodsData.length > 0) {
        setSelectedMethod(methodsData[0]);
      }
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!loan || !selectedMethod) return;

    const amountNum = parseInt(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: 'Дүн буруу байна',
      });
      return;
    }

    if (amountNum > loan.outstandingBalance) {
      Toast.show({
        type: 'error',
        text1: 'Алдаа',
        text2: 'Төлөх дүн үлдэгдлээс их байна',
      });
      return;
    }

    Alert.alert(
      'Төлбөр баталгаажуулах',
      `Та ${formatMoney(amountNum)} төлбөр төлөхдөө итгэлтэй байна уу?`,
      [
        { text: 'Болих', style: 'cancel' },
        {
          text: 'Тийм',
          onPress: async () => {
            try {
              setProcessing(true);

              // Төлбөр эхлүүлэх
              const paymentData = await paymentService.initiatePayment({
                loanId: loan._id,
                amount: amountNum,
                method: selectedMethod.id,
              });

              // Төлбөр хийх
              await loanService.makePayment(loan._id, {
                amount: amountNum,
                method: selectedMethod.id,
                reference: paymentData.paymentReference,
              });

              Toast.show({
                type: 'success',
                text1: 'Амжилттай',
                text2: 'Төлбөр амжилттай төлөгдлөө',
              });

              navigation.goBack();
            } catch (error) {
              console.error('Payment error:', error);
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const setQuickAmount = (multiplier: number) => {
    if (loan) {
      setAmount((loan.monthlyPayment * multiplier).toString());
    }
  };

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  if (!loan) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Зээл олдсонгүй</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.sectionTitle}>Зээлийн мэдээлэл</Text>
        <View style={styles.loanInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Үлдэгдэл:</Text>
            <Text style={styles.infoValue}>
              {formatMoney(loan.outstandingBalance)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Сард төлөх:</Text>
            <Text style={styles.infoValue}>{formatMoney(loan.monthlyPayment)}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Төлбөрийн дүн</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0"
        />

        <View style={styles.quickAmounts}>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => setQuickAmount(1)}
          >
            <Text style={styles.quickAmountText}>1 сар</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => setQuickAmount(3)}
          >
            <Text style={styles.quickAmountText}>3 сар</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => setAmount(loan.outstandingBalance.toString())}
          >
            <Text style={styles.quickAmountText}>Бүгд</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Төлбөрийн хэрэгсэл</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod?.id === method.id && styles.methodCardSelected,
            ]}
            onPress={() => setSelectedMethod(method)}
          >
            <View style={styles.methodLeft}>
              <View
                style={[
                  styles.methodIcon,
                  selectedMethod?.id === method.id && styles.methodIconSelected,
                ]}
              >
                <Text style={styles.methodEmoji}>{method.icon}</Text>
              </View>
              <View>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
            </View>
            {selectedMethod?.id === method.id && (
              <Icon name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </Card>

      <Button
        title={`${formatMoney(parseInt(amount) || 0)} төлөх`}
        onPress={handlePayment}
        loading={processing}
        disabled={!amount || parseInt(amount) <= 0}
        style={styles.payButton}
      />

      <LoadingOverlay visible={processing} message="Төлбөр боловсруулж байна..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  loanInfo: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  amountInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickAmountText: {
    fontSize: fontSizes.sm,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  methodIconSelected: {
    backgroundColor: colors.primary + '20',
  },
  methodEmoji: {
    fontSize: 24,
  },
  methodName: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
  },
  methodDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  payButton: {
    marginTop: 10,
    marginBottom: 30,
  },
});

export default PaymentScreen;