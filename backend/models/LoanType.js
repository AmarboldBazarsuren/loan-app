const mongoose = require('mongoose');

const loanTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  nameEn: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: String,
  color: {
    type: String,
    default: '#4CAF50'
  },
  minAmount: {
    type: Number,
    required: true,
    default: 10000
  },
  maxAmount: {
    type: Number,
    required: true,
    default: 10000000
  },
  minDuration: {
    type: Number,
    required: true,
    default: 1
  },
  maxDuration: {
    type: Number,
    required: true,
    default: 60
  },
  interestRate: {
    type: Number,
    required: true,
    default: 1.5
  },
  processingFee: {
    type: Number,
    default: 0
  },
  requiresCollateral: {
    type: Boolean,
    default: false
  },
  requiresGuarantor: {
    type: Boolean,
    default: false
  },
  minCreditScore: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [String],
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('LoanType', loanTypeSchema);