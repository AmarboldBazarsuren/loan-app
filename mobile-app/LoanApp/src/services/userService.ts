// src/services/userService.ts
import api from '../config/api';
import { User } from '../types';

export const userService = {
  uploadIdCard: async (frontImage: any, backImage: any): Promise<User> => {
    try {
      const formData = new FormData();
      
      formData.append('front', {
        uri: frontImage.uri,
        type: frontImage.type || 'image/jpeg',
        name: frontImage.fileName || 'id_front.jpg',
      } as any);
      
      formData.append('back', {
        uri: backImage.uri,
        type: backImage.type || 'image/jpeg',
        name: backImage.fileName || 'id_back.jpg',
      } as any);

      const response: any = await api.post('/users/id-card', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Upload ID card error:', error);
      throw error;
    }
  },

  updateAddress: async (address: {
    city: string;
    district: string;
    street: string;
    detail: string;
  }): Promise<User> => {
    try {
      const response: any = await api.put('/users/address', address);
      return response.data;
    } catch (error) {
      console.error('Update address error:', error);
      throw error;
    }
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImage?: any;
  }): Promise<User> => {
    try {
      const formData = new FormData();
      
      if (data.firstName) formData.append('firstName', data.firstName);
      if (data.lastName) formData.append('lastName', data.lastName);
      if (data.phone) formData.append('phone', data.phone);
      
      if (data.profileImage) {
        formData.append('profileImage', {
          uri: data.profileImage.uri,
          type: data.profileImage.type || 'image/jpeg',
          name: data.profileImage.fileName || 'profile.jpg',
        } as any);
      }

      const response: any = await api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  updatePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    try {
      await api.put('/auth/password', data);
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  updateFCMToken: async (token: string): Promise<void> => {
    try {
      await api.post('/users/fcm-token', { token });
    } catch (error) {
      console.error('Update FCM token error:', error);
    }
  },
};