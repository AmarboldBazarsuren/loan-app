// src/config/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// API Base URL - Development эсвэл Production
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:5000/api'  // Android Emulator
  : 'https://your-production-api.com/api';

// iOS Simulator бол localhost ашиглах
// const API_BASE_URL = __DEV__ 
//   ? Platform.OS === 'ios' 
//     ? 'http://localhost:5000/api' 
//     : 'http://10.0.2.2:5000/api'
//   : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - JWT token нэмэх
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Алдаа боловсруулах
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Токен хүчингүй болсон үед
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        
        Toast.show({
          type: 'error',
          text1: 'Нэвтрэх хугацаа дууссан',
          text2: 'Дахин нэвтэрнэ үү',
        });
      } catch (e) {
        console.error('Logout error:', e);
      }
    }

    // Алдааны мессеж харуулах
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Алдаа гарлаа. Дахин оролдоно уу.';

    Toast.show({
      type: 'error',
      text1: 'Алдаа',
      text2: errorMessage,
    });

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };