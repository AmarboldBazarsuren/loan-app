// src/screens/Loans/MyLoansScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loanService } from '../../services/loanService';
import { Loan } from '../../types';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import LoanCard from '../../components/loan/LoanCard';

const MyLoansScreen = ({ navigation }: any) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statuses = [
    { key: 'all', label: 'Бүгд' },
    { key: 'pending', label: 'Хүлээгдэж буй' },
    { key: 'active', label: 'Идэвхтэй' },
    { key: 'completed', label: 'Дууссан' },
    { key: 'rejected', label: 'Татгалзсан' },
  ];

  useFocusEffect(
    useCallback(() => {
      loadLoans();
    }, [selectedStatus])
  );

  const loadLoans = async () => {
    try {
      const status = selectedStatus === 'all' ? undefined : selectedStatus;
      const data = await loanService.getMyLoans(status);
      setLoans(data);
    } catch (error) {
      console.error('Load loans error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLoans();
  };

  const renderStatusFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {statuses.map((status) => (
        <TouchableOpacity
          key={status.key}
          style={[
            styles.filterButton,
            selectedStatus === status.key && styles.filterButtonActive,
          ]}
          onPress={() => {
            setSelectedStatus(status.key);
            setLoading(true);
          }}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedStatus === status.key && styles.filterButtonTextActive,
            ]}
          >
            {status.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderStatusFilter()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Зээл байхгүй байна</Text>
            <Text style={styles.emptyText}>
              Та одоогоор зээл авч байгаагүй байна
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('HomeTab', { screen: 'LoanRequest' })}
            >
              <Text style={styles.emptyButtonText}>Зээл хүсэх</Text>
            </TouchableOpacity>
          </View>
        ) : (
          loans.map((loan) => (
            <LoanCard
              key={loan._id}
              loan={loan}
              onPress={() =>
                navigation.navigate('LoanDetail', { loanId: loan._id })
              }
            />
          ))
        )}
      </ScrollView>
    </View>
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
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: fontSizes.sm,
    color: colors.text,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
});

export default MyLoansScreen;