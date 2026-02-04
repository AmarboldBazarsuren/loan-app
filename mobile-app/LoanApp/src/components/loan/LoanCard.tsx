// src/components/loan/LoanCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Loan } from '../../types';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import { formatMoney, getLoanStatusText, getLoanStatusColor } from '../../utils/formatters';

interface LoanCardProps {
  loan: Loan;
  onPress: () => void;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, onPress }) => {
  const statusColor = getLoanStatusColor(loan.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View>
          <Text style={styles.amount}>{formatMoney(loan.amount)}</Text>
          <Text style={styles.type}>{loan.loanType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {getLoanStatusText(loan.status)}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Сард төлөх</Text>
          <Text style={styles.infoValue}>{formatMoney(loan.monthlyPayment)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Үлдэгдэл</Text>
          <Text style={styles.infoValue}>{formatMoney(loan.outstandingBalance)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Хугацаа</Text>
          <Text style={styles.infoValue}>{loan.duration} сар</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  amount: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  type: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.text,
  },
});

export default LoanCard;