import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '../config/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  creditScore: number;
  profileImage?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  totalBorrowed?: number;
  totalRepaid?: number;
  activeLoans?: number;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  registerNumber: string;
  dateOfBirth: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userData'),
      ]);

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        // Хэрэглэгчийн мэдээлэл шинэчлэх
        await refreshUser();
      }
    } catch (error) {
      console.error('Load stored user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response: any = await api.post('/auth/login', { email, password });
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
        
        Toast.show({
          type: 'success',
          text1: 'Амжилттай',
          text2: `Тавтай морил, ${userData.firstName}!`,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response: any = await api.post('/auth/register', userData);
      
      if (response.success && response.data) {
        const { token, user: newUser } = response.data;
        
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(newUser));
        
        setUser(newUser);
        
        Toast.show({
          type: 'success',
          text1: 'Амжилттай бүртгэгдлээ',
          text2: 'Тавтай морил!',
        });
      }
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      setUser(null);
      
      Toast.show({
        type: 'success',
        text1: 'Амжилттай гарлаа',
      });
    }
  };

  const refreshUser = async () => {
    try {
      const response: any = await api.get('/auth/me');
      if (response.success && response.data) {
        setUser(response.data);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};