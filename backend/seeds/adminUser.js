const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB холбогдлоо');

    // Админ хэрэглэгч байгаа эсэхийг шалгах
    const adminExists = await User.findOne({ email: 'admin@loanapp.mn' });

    if (adminExists) {
      console.log('Админ хэрэглэгч аль хэдийн байна');
      process.exit(0);
    }

    // Админ үүсгэх
    const admin = await User.create({
      firstName: 'Админ',
      lastName: 'Хэрэглэгч',
      email: 'admin@loanapp.mn',
      phone: '99999999',
      password: 'admin123456',
      registerNumber: 'УБ99999999',
      dateOfBirth: new Date('1990-01-01'),
      role: 'admin',
      isVerified: true,
      verificationStatus: 'approved',
      isActive: true
    });

    console.log('Админ хэрэглэгч амжилттай үүсгэгдлээ');
    console.log('Имэйл: admin@loanapp.mn');
    console.log('Нууц үг: admin123456');

    process.exit(0);
  } catch (error) {
    console.error('Алдаа:', error);
    process.exit(1);
  }
};

createAdmin();