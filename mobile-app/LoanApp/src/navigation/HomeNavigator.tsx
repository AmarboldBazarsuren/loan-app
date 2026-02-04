import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import LoanTypesScreen from '../screens/Home/LoanTypesScreen';
import LoanCalculatorScreen from '../screens/Home/LoanCalculatorScreen';
import LoanRequestScreen from '../screens/Home/LoanRequestScreen';
import { colors } from '../theme/colors';

const Stack = createStackNavigator();

const HomeNavigator = () => {
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
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoanTypes"
        component={LoanTypesScreen}
        options={{ title: 'Зээлийн төрлүүд' }}
      />
      <Stack.Screen
        name="LoanCalculator"
        component={LoanCalculatorScreen}
        options={{ title: 'Зээл тооцоолуур' }}
      />
      <Stack.Screen
        name="LoanRequest"
        component={LoanRequestScreen}
        options={{ title: 'Зээл хүсэх' }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;