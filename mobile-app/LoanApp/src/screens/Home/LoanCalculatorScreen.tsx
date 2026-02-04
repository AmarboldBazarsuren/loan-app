// src/screens/Home/LoanCalculatorScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { loanService } from '../../services/loanService';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import { formatMoney } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Toast from 'react-native-toast-message';

const LoanCalculatorScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState(1000000);
  const [duration, setDuration] = useState(12);
  const [interestRate, setInterestRate] = useState(1.5);
  const [result, setResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    calculateLoan();
  }, [amount, duration, interestRate]);

  const calculateLoan = async () => {
    try {
      setCalculating(true);
      const data = await loanService.calculateLoan({
        amount,
        duration,
        interestRate,
      });
      setResult(data);
    } catch (error) {
      console.error('Calculate error:', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleAmountChange = (text: string) => {
    const num = parseInt(text.replace(/[^0-9]/g, '')) || 0;
    setAmount(Math.min(Math.max(num, 10000), 50000000));
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.sectionTitle}>Зээлийн дүн</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.amountInput}
            value={formatMoney(amount)}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
        </View>
        <Slider
          style={styles.slider}
          minimumValue={10000}
          maximumValue={50000000}
          value={amount}
          onValueChange={setAmount}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
          step={10000}
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>10,000₮</Text>
          <Text style={styles.rangeLabel}>50,000,000₮</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Хугацаа</Text>
        <View style={styles.durationDisplay}>
          <Text style={styles.durationValue}>{duration}</Text>
          <Text style={styles.durationUnit}>сар</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={60}
          value={duration}
          onValueChange={setDuration}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
          step={1}
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>1 сар</Text>
          <Text style={styles.rangeLabel}>60 сар</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Сарын хүү</Text>
        <View style={styles.durationDisplay}>
          <Text style={styles.durationValue}>{interestRate.toFixed(1)}</Text>
          <Text style={styles.durationUnit}>%</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={5.0}
          value={interestRate}
          onValueChange={setInterestRate}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
          step={0.1}
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>0.5%</Text>
          <Text style={styles.rangeLabel}>5.0%</Text>
        </View>
      </Card>

      {result && (
        <Card style={styles.resultCard}>
          <Text style={styles.resultTitle}>Тооцооны үр дүн</Text>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Сард төлөх:</Text>
            <Text style={styles.resultValue}>{formatMoney(result.monthlyPayment)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Нийт буцаан төлөх:</Text>
            <Text style={styles.resultValue}>{formatMoney(result.totalRepayment)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Нийт хүү:</Text>
            <Text style={[styles.resultValue, { color: colors.error }]}>
              {formatMoney(result.totalInterest)}
            </Text>
          </View>
        </Card>
      )}

      <Button
        title="Зээл хүсэх"
        onPress={() => navigation.navigate('LoanRequest', { amount, duration, interestRate })}
        style={styles.applyButton}
      />
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
  inputContainer: {
    marginBottom: 10,
  },
  amountInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  rangeLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  durationDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  durationValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  durationUnit: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  resultCard: {
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resultTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  resultValue: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  applyButton: {
    marginTop: 10,
    marginBottom: 30,
  },
});

export default LoanCalculatorScreen;