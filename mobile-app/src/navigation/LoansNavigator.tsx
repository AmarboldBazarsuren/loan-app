import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyLoansScreen from '../screens/Loans/MyLoansScreen';
import LoanDetailScreen from '../screens/Loans/LoanDetailScreen';
import PaymentScreen from '../screens/Loans/PaymentScreen';
import { colors } from '../theme/colors';

const Stack = createStackNavigator();

const LoansNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="MyLoans"
        component={MyLoansScreen}
        options={{ title: 'Миний зээлүүд' }}
      />
      <Stack.Screen
        name="LoanDetail"
        component={LoanDetailScreen}
        options={{ title: 'Зээлийн дэлгэрэнгүй' }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Төлбөр төлөх' }}
      />
    </Stack.Navigator>
  );
};

export default LoansNavigator;