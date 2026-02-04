import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../../context/AuthContext';
import { loanService } from '../../services/loanService';
import { LoanType, Loan } from '../../types';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [typesData, loansData] = await Promise.all([
        loanService.getLoanTypes(),
        loanService.getMyLoans('active'),
      ]);
      setLoanTypes(typesData);
      setActiveLoans(loansData);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('mn-MN').format(amount) + '₮';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Сайн байна уу,</Text>
            <Text style={styles.userName}>{user?.firstName}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-outline" size={24} color={colors.white} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Animatable.View animation="fadeInUp" delay={300} style={styles.creditScoreCard}>
          <Text style={styles.creditScoreLabel}>Кредит оноо</Text>
          <Text style={styles.creditScoreValue}>{user?.creditScore || 0}</Text>
          <View style={styles.creditScoreBar}>
            <View
              style={[
                styles.creditScoreBarFill,
                { width: `${((user?.creditScore || 0) / 1000) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.creditScoreRange}>300 - 1000</Text>
        </Animatable.View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.quickActions}>
          <QuickActionCard
            icon="calculator"
            title="Тооцоолуур"
            color="#FF6B6B"
            onPress={() => navigation.navigate('LoanCalculator')}
          />
          <QuickActionCard
            icon="card"
            title="Зээл хүсэх"
            color="#4ECDC4"
            onPress={() => navigation.navigate('LoanRequest')}
          />
          <QuickActionCard
            icon="list"
            title="Миний зээл"
            color="#45B7D1"
            onPress={() => navigation.navigate('LoansTab')}
          />
        </View>

        {activeLoans.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Идэвхтэй зээл</Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoansTab')}>
                <Text style={styles.seeAll}>Бүгдийг үзэх</Text>
              </TouchableOpacity>
            </View>
            {activeLoans.map((loan) => (
              <LoanCard key={loan._id} loan={loan} navigation={navigation} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Зээлийн төрлүүд</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoanTypes')}>
              <Text style={styles.seeAll}>Бүгдийг үзэх</Text>
            </TouchableOpacity>
          </View>
          {loanTypes.slice(0, 3).map((type) => (
            <LoanTypeCard
              key={type._id}
              loanType={type}
              navigation={navigation}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const QuickActionCard = ({ icon, title, color, onPress }: any) => (
  <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
      <Icon name={icon} size={24} color={colors.white} />
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
  </TouchableOpacity>
);

const LoanCard = ({ loan, navigation }: any) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('mn-MN').format(amount) + '₮';
  };

  return (
    <TouchableOpacity
      style={styles.loanCard}
      onPress={() => navigation.navigate('LoansTab', {
        screen: 'LoanDetail',
        params: { loanId: loan._id },
      })}
    >
      <View style={styles.loanCardHeader}>
        <View>
          <Text style={styles.loanCardAmount}>{formatMoney(loan.amount)}</Text>
          <Text style={styles.loanCardType}>{loan.loanType}</Text>
        </View>
        <View style={[styles.statusBadge, styles.statusActive]}>
          <Text style={styles.statusText}>Идэвхтэй</Text>
        </View>
      </View>
      <View style={styles.loanCardFooter}>
        <View style={styles.loanCardInfo}>
          <Text style={styles.loanCardInfoLabel}>Сард төлөх</Text>
          <Text style={styles.loanCardInfoValue}>
            {formatMoney(loan.monthlyPayment)}
          </Text>
        </View>
        <View style={styles.loanCardInfo}>
          <Text style={styles.loanCardInfoLabel}>Үлдэгдэл</Text>
          <Text style={styles.loanCardInfoValue}>
            {formatMoney(loan.outstandingBalance)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const LoanTypeCard = ({ loanType, navigation }: any) => (
  <TouchableOpacity
    style={styles.loanTypeCard}
    onPress={() =>
      navigation.navigate('LoanRequest', { loanType: loanType.nameEn })
    }
  >
    <View style={styles.loanTypeCardLeft}>
      <View
        style={[
          styles.loanTypeIcon,
          { backgroundColor: loanType.color + '20' },
        ]}
      >
        <Text style={styles.loanTypeEmoji}>{loanType.icon}</Text>
      </View>
      <View style={styles.loanTypeInfo}>
        <Text style={styles.loanTypeName}>{loanType.name}</Text>
        <Text style={styles.loanTypeDescription} numberOfLines={2}>
          {loanType.description}
        </Text>
      </View>
    </View>
    <Icon name="chevron-forward" size={20} color={colors.gray} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: fontSizes.md,
    color: colors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 5,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  creditScoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    backdropFilter: 'blur(10px)',
  },
  creditScoreLabel: {
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 5,
  },
  creditScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 15,
  },
  creditScoreBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  creditScoreBarFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  creditScoreRange: {
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
  content: {
    padding: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: fontSizes.sm,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  loanCard: {
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
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  loanCardAmount: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  loanCardType: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: colors.success + '20',
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.success,
  },
  loanCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loanCardInfo: {
    flex: 1,
  },
  loanCardInfoLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  loanCardInfoValue: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  loanTypeCard: {
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
  loanTypeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loanTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  loanTypeEmoji: {
    fontSize: 24,
  },
  loanTypeInfo: {
    flex: 1,
  },
  loanTypeName: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  loanTypeDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

export default HomeScreen;