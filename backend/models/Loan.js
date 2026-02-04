const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanType: {
    type: String,
    enum: ['instant', 'personal', 'business', 'emergency', 'salary_advance'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Зээлийн дүн оруулна уу'],
    min: [10000, 'Хамгийн бага зээл 10,000₮'],
    max: [50000000, 'Хамгийн их зээл 50,000,000₮']
  },
  interestRate: {
    type: Number,
    required: true,
    default: 1.5 // 1.5% сард
  },
  duration: {
    type: Number,
    required: [true, 'Зээлийн хугацаа оруулна уу'],
    min: [1, 'Хамгийн багадаа 1 сар'],
    max: [60, 'Хамгийн ихдээ 60 сар']
  },
  purpose: {
    type: String,
    maxlength: [500, 'Зориулалт хэт урт байна']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'rejected', 'completed', 'defaulted'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectedReason: String,
  disbursedAmount: Number,
  disbursedAt: Date,
  totalRepayment: Number,
  monthlyPayment: Number,
  outstandingBalance: Number,
  nextPaymentDate: Date,
  payments: [{
    amount: Number,
    type: {
      type: String,
      enum: ['monthly', 'partial', 'full']
    },
    date: {
      type: Date,
      default: Date.now
    },
    method: {
      type: String,
      enum: ['bank_transfer', 'card', 'cash', 'qpay']
    },
    reference: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['income_proof', 'employment_letter', 'contract', 'other']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  collateral: {
    type: String,
    description: String,
    estimatedValue: Number,
    images: [String]
  },
  guarantor: {
    name: String,
    phone: String,
    email: String,
    relationship: String,
    address: String
  },
  creditCheckScore: Number,
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: String,
  completedAt: Date
}, { timestamps: true });

// Сард төлөх дүн тооцоолох
loanSchema.methods.calculateMonthlyPayment = function() {
  const monthlyRate = this.interestRate / 100;
  const principal = this.amount;
  const months = this.duration;
  
  // PMT formula
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                        (Math.pow(1 + monthlyRate, months) - 1);
  
  this.monthlyPayment = Math.round(monthlyPayment);
  this.totalRepayment = Math.round(monthlyPayment * months);
  this.outstandingBalance = this.totalRepayment;
  
  return this.monthlyPayment;
};

// Дараагийн төлөлт тооцоолох
loanSchema.methods.calculateNextPayment = function() {
  if (!this.disbursedAt) return null;
  
  const nextDate = new Date(this.disbursedAt);
  const now = new Date();
  
  let monthsPassed = 0;
  while (nextDate <= now) {
    nextDate.setMonth(nextDate.getMonth() + 1);
    monthsPassed++;
  }
  
  this.nextPaymentDate = nextDate;
  return nextDate;
};

// Index үүсгэх - query performance
loanSchema.index({ user: 1, status: 1 });
loanSchema.index({ createdAt: -1 });
loanSchema.index({ status: 1, nextPaymentDate: 1 });

module.exports = mongoose.model('Loan', loanSchema);