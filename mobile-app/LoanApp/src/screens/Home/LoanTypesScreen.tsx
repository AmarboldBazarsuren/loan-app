// src/screens/Home/LoanTypesScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { loanService } from '../../services/loanService';
import { LoanType } from '../../types';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import LoanTypeCard from '../../components/loan/LoanTypeCard';

const LoanTypesScreen = ({ navigation }: any) => {
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLoanTypes();
  }, []);

  const loadLoanTypes = async () => {
    try {
      const data = await loanService.getLoanTypes();
      setLoanTypes(data);
    } catch (error) {
      console.error('Load loan types error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLoanTypes();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Зээлийн төрлүүд</Text>
        <Text style={styles.subtitle}>
          Өөрт тохирох зээлийн төрлөө сонгоно уу
        </Text>
      </View>

      {loanTypes.map((loanType) => (
        <LoanTypeCard
          key={loanType._id}
          loanType={loanType}
          onPress={() =>
            navigation.navigate('LoanRequest', { loanType: loanType.nameEn })
          }
        />
      ))}
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
});

export default LoanTypesScreen;