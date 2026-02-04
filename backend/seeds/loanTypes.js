const mongoose = require('mongoose');
const LoanType = require('../models/LoanType');
require('dotenv').config();

const loanTypes = [
  {
    name: 'Шуурхай зээл',
    nameEn: 'instant',
    description: 'Хэдхэн минутын дотор зээл авах боломжтой. Баталгаа шаардлагагүй.',
    icon: '⚡',
    color: '#FF6B6B',
    minAmount: 10000,
    maxAmount: 500000,
    minDuration: 1,
    maxDuration: 6,
    interestRate: 2.5,
    processingFee: 1000,
    requiresCollateral: false,
    requiresGuarantor: false,
    minCreditScore: 300,
    isActive: true,
    features: [
      'Шуурхай зөвшөөрөл',
      'Баталгаа шаардлагагүй',
      'Онлайн бүртгэл',
      'Богино хугацаа'
    ],
    order: 1
  },
  {
    name: 'Хувийн зээл',
    nameEn: 'personal',
    description: 'Хувийн хэрэгцээнд зориулсан уян хатан нөхцөлтэй зээл.',
    icon: '👤',
    color: '#4ECDC4',
    minAmount: 100000,
    maxAmount: 10000000,
    minDuration: 6,
    maxDuration: 36,
    interestRate: 1.5,
    processingFee: 5000,
    requiresCollateral: false,
    requiresGuarantor: false,
    minCreditScore: 400,
    isActive: true,
    features: [
      'Урт хугацаа',
      'Бага хүү',
      'Уян хатан төлбөр',
      'Том дүнгийн зээл'
    ],
    order: 2
  },
  {
    name: 'Бизнес зээл',
    nameEn: 'business',
    description: 'Бизнес эрхлэгчдэд зориулсан том хэмжээний зээл.',
    icon: '💼',
    color: '#45B7D1',
    minAmount: 500000,
    maxAmount: 50000000,
    minDuration: 12,
    maxDuration: 60,
    interestRate: 1.2,
    processingFee: 10000,
    requiresCollateral: true,
    requiresGuarantor: true,
    minCreditScore: 600,
    isActive: true,
    features: [
      'Том дүн',
      'Урт хугацаа',
      'Бизнес зөвлөгөө',
      'Тусгай хүү'
    ],
    order: 3
  },
  {
    name: 'Яаралтай зээл',
    nameEn: 'emergency',
    description: 'Яаралтай тусламж хэрэгтэй үед богино хугацаанд олгох зээл.',
    icon: '🚨',
    color: '#F95959',
    minAmount: 50000,
    maxAmount: 2000000,
    minDuration: 1,
    maxDuration: 12,
    interestRate: 2.0,
    processingFee: 2000,
    requiresCollateral: false,
    requiresGuarantor: false,
    minCreditScore: 350,
    isActive: true,
    features: [
      '24/7 зөвшөөрөл',
      'Шуурхай олголт',
      'Энгийн шаардлага',
      'Уян хатан нөхцөл'
    ],
    order: 4
  },
  {
    name: 'Цалингийн урьдчилгаа',
    nameEn: 'salary_advance',
    description: 'Цалин хүлээлгүй, урьдчилж авах боломж.',
    icon: '💰',
    color: '#96CEB4',
    minAmount: 50000,
    maxAmount: 1000000,
    minDuration: 1,
    maxDuration: 3,
    interestRate: 1.0,
    processingFee: 500,
    requiresCollateral: false,
    requiresGuarantor: false,
    minCreditScore: 300,
    isActive: true,
    features: [
      'Бага хүү',
      'Богино хугацаа',
      'Хялбар нөхцөл',
      'Шуурхай'
    ],
    order: 5
  }
];

const seedLoanTypes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB холбогдлоо');

    await LoanType.deleteMany();
    console.log('Хуучин өгөгдөл устгагдлаа');

    await LoanType.insertMany(loanTypes);
    console.log('Зээлийн төрлүүд амжилттай нэмэгдлээ');

    process.exit(0);
  } catch (error) {
    console.error('Алдаа:', error);
    process.exit(1);
  }
};

seedLoanTypes();