// src/services/loanService.ts
import api from '../config/api';
import { LoanType, Loan, CalculateLoanResult } from '../types';

export const loanService = {
  getLoanTypes: async (): Promise<LoanType[]> => {
    try {
      const response: any = await api.get('/loans/types');
      return response.data || [];
    } catch (error) {
      console.error('Get loan types error:', error);
      return [];
    }
  },

  calculateLoan: async (data: {
    amount: number;
    duration: number;
    interestRate: number;
  }): Promise<CalculateLoanResult> => {
    try {
      const response: any = await api.post('/loans/calculate', data);
      return response.data;
    } catch (error) {
      console.error('Calculate loan error:', error);
      throw error;
    }
  },

  requestLoan: async (data: {
    loanType: string;
    amount: number;
    duration: number;
    purpose?: string;
  }): Promise<Loan> => {
    try {
      const response: any = await api.post('/loans/request', data);
      return response.data;
    } catch (error) {
      console.error('Request loan error:', error);
      throw error;
    }
  },

  getMyLoans: async (status?: string): Promise<Loan[]> => {
    try {
      const params = status ? { status } : {};
      const response: any = await api.get('/loans/my-loans', { params });
      return response.data || [];
    } catch (error) {
      console.error('Get my loans error:', error);
      return [];
    }
  },

  getLoanById: async (id: string): Promise<Loan | null> => {
    try {
      const response: any = await api.get(`/loans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get loan by id error:', error);
      return null;
    }
  },

  makePayment: async (
    loanId: string,
    data: {
      amount: number;
      method: string;
      reference?: string;
    }
  ): Promise<Loan> => {
    try {
      const response: any = await api.post(`/loans/${loanId}/payment`, data);
      return response.data;
    } catch (error) {
      console.error('Make payment error:', error);
      throw error;
    }
  },

  uploadDocuments: async (
    loanId: string,
    documents: any[]
  ): Promise<Loan> => {
    try {
      const formData = new FormData();
      
      documents.forEach((doc, index) => {
        formData.append('documents', {
          uri: doc.uri,
          type: doc.type || 'image/jpeg',
          name: doc.fileName || `document_${index}.jpg`,
        } as any);
      });

      const response: any = await api.post(`/loans/${loanId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Upload documents error:', error);
      throw error;
    }
  },
};