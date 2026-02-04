// src/screens/Loans/LoanDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { loanService } from '../../services/loanService';
import { Loan, Payment } from '../../types';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import {
  formatMoney,
  formatDate,
  formatDateTime,
  getLoanStatusText,
  getLoanStatusColor,
} from '../../utils/formatters';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const LoanDetailScreen = ({ navigation, route }: any) => {
  const { loanId } = route.params;
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLoan();
  }, [loanId]);

  const loadLoan = async () => {
    try {
      const data = await loanService.getLoanById(loanId);
      setLoan(data);
    } catch (error) {
      console.error('Load loan error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLoan();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!loan) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Зээл олдсонгүй</Text>
      </View>
    );
  }

  const statusColor = getLoanStatusColor(loan.status);
  const canMakePayment = loan.status === 'active';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <View>
            <Text style={styles.amount}>{formatMoney(loan.amount)}</Text>
            <Text style={styles.loanType}>{loan.loanType}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getLoanStatusText(loan.status)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Сард төлөх</Text>
            <Text style={styles.infoValue}>{formatMoney(loan.monthlyPayment)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Үлдэгдэл</Text>
            <Text style={styles.infoValue}>
              {formatMoney(loan.outstandingBalance)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Нийт төлөх</Text>
            <Text style={styles.infoValue}>{formatMoney(loan.totalRepayment)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Хугацаа</Text>
            <Text style={styles.infoValue}>{loan.duration} сар</Text>
          </View>
        </View>

        {loan.nextPaymentDate && canMakePayment && (
          <View style={styles.nextPayment}>
            <Icon name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.nextPaymentText}>
              Дараагийн төлбөр: {formatDate(loan.nextPaymentDate)}
            </Text>
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Дэлгэрэнгүй</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Хүү:</Text>
          <Text style={styles.detailValue}>{loan.interestRate}% / сар</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Үүсгэсэн:</Text>
          <Text style={styles.detailValue}>{formatDate(loan.createdAt)}</Text>
        </View>
        {loan.approvedAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Зөвшөөрсөн:</Text>
            <Text style={styles.detailValue}>{formatDate(loan.approvedAt)}</Text>
          </View>
        )}
        {loan.disbursedAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Олгосон:</Text>
            <Text style={styles.detailValue}>{formatDate(loan.disbursedAt)}</Text>
          </View>
        )}
        {loan.purpose && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Зориулалт:</Text>
            <Text style={styles.detailValue}>{loan.purpose}</Text>
          </View>
        )}
        {loan.rejectedReason && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Татгалзсан шалтгаан:</Text>
            <Text style={[styles.detailValue, { color: colors.error }]}>
              {loan.rejectedReason}
            </Text>
          </View>
        )}
      </Card>

      {loan.payments && loan.payments.length > 0 && (
        <Card>
          <Text style={styles.sectionTitle}>Төлбөрийн түүх</Text>
          {loan.payments.map((payment: Payment, index: number) => (
            <View key={payment._id || index} style={styles.paymentItem}>
              <View style={styles.paymentLeft}>
                <View
                  style={[
                    styles.paymentIcon,
                    {
                      backgroundColor:
                        payment.status === 'completed'
                          ? colors.success + '20'
                          : colors.warning + '20',
                    },
                  ]}
                >
                  <Icon
                    name={
                      payment.status === 'completed'
                        ? 'checkmark-circle'
                        : 'time-outline'
                    }
                    size={20}
                    color={
                      payment.status === 'completed' ? colors.success : colors.warning
                    }
                  />
                </View>
                <View>
                  <Text style={styles.paymentAmount}>
                    {formatMoney(payment.amount)}
                  </Text>
                  <Text style={styles.paymentDate}>
                    {formatDateTime(payment.date)}
                  </Text>
                </View>
              </View>
              <View style={styles.paymentMethod}>
                <Text style={styles.paymentMethodText}>{payment.method}</Text>
              </View>
            </View>
          ))}
        </Card>
      )}

      {canMakePayment && (
        <Button
          title="Төлбөр төлөх"
          onPress={() => navigation.navigate('Payment', { loanId: loan._id })}
          style={styles.paymentButton}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  headerCard: {
    margin: 20,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  amount: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  loanType: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  infoItem: {
    width: '50%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  nextPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 12,
  },
  nextPaymentText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentAmount: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
  },
  paymentDate: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  paymentMethod: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  paymentMethodText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  paymentButton: {
    margin: 20,
    marginTop: 10,
  },
});

export default LoanDetailScreen;