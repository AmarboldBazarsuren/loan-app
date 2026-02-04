// src/types/index.ts
export interface User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  registerNumber: string;
  dateOfBirth: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  creditScore: number;
  totalBorrowed: number;
  totalRepaid: number;
  activeLoans: number;
  profileImage?: string;
  idCardFront?: string;
  idCardBack?: string;
  address?: {
    city: string;
    district: string;
    street: string;
    detail: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoanType {
  _id: string;
  name: string;
  nameEn: 'instant' | 'personal' | 'business' | 'emergency' | 'salary_advance';
  description: string;
  icon: string;
  color: string;
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
  interestRate: number;
  processingFee: number;
  requiresCollateral: boolean;
  requiresGuarantor: boolean;
  minCreditScore: number;
  isActive: boolean;
  features: string[];
  order: number;
}

export interface Loan {
  _id: string;
  user: string | User;
  loanType: string;
  amount: number;
  interestRate: number;
  duration: number;
  purpose?: string;
  status: 'pending' | 'approved' | 'active' | 'rejected' | 'completed' | 'defaulted';
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  disbursedAmount?: number;
  disbursedAt?: string;
  totalRepayment: number;
  monthlyPayment: number;
  outstandingBalance: number;
  nextPaymentDate?: string;
  payments: Payment[];
  documents: LoanDocument[];
  creditCheckScore?: number;
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  amount: number;
  type: 'monthly' | 'partial' | 'full';
  date: string;
  method: 'bank_transfer' | 'card' | 'cash' | 'qpay';
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface LoanDocument {
  _id: string;
  type: 'income_proof' | 'employment_letter' | 'contract' | 'other';
  url: string;
  uploadedAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CalculateLoanResult {
  loanAmount: number;
  duration: number;
  interestRate: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
}