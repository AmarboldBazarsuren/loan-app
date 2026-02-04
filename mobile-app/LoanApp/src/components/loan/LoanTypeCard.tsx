// src/components/loan/LoanTypeCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LoanType } from '../../types';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import { formatMoney } from '../../utils/formatters';

interface LoanTypeCardProps {
  loanType: LoanType;
  onPress: () => void;
}

const LoanTypeCard: React.FC<LoanTypeCardProps> = ({ loanType, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardLeft}>
        <View style={[styles.iconContainer, { backgroundColor: loanType.color + '20' }]}>
          <Text style={styles.emoji}>{loanType.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{loanType.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {loanType.description}
          </Text>
          <View style={styles.amountRange}>
            <Text style={styles.amountText}>
              {formatMoney(loanType.minAmount)} - {formatMoney(loanType.maxAmount)}
            </Text>
          </View>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.gray} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  amountRange: {
    flexDirection: 'row',
  },
  amountText: {
    fontSize: fontSizes.xs,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default LoanTypeCard;