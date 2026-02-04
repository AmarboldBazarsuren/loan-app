const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Нэр оруулна уу'],
    trim: true,
    maxlength: [50, 'Нэр хэт урт байна']
  },
  lastName: {
    type: String,
    required: [true, 'Овог оруулна уу'],
    trim: true,
    maxlength: [50, 'Овог хэт урт байна']
  },
  email: {
    type: String,
    required: [true, 'Имэйл оруулна уу'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Имэйл хаяг буруу байна']
  },
  phone: {
    type: String,
    required: [true, 'Утасны дугаар оруулна уу'],
    unique: true,
    match: [/^[0-9]{8}$/, 'Утасны дугаар 8 оронтой байх ёстой']
  },
  password: {
    type: String,
    required: [true, 'Нууц үг оруулна уу'],
    minlength: [6, 'Нууц үг 6-аас дээш тэмдэгттэй байх ёстой'],
    select: false
  },
  registerNumber: {
    type: String,
    required: [true, 'Регистрийн дугаар оруулна уу'],
    unique: true,
    uppercase: true,
    match: [/^[А-ЯӨҮ]{2}[0-9]{8}$/, 'Регистрийн дугаар буруу байна']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Төрсөн он сар өдөр оруулна уу']
  },
  address: {
    city: String,
    district: String,
    street: String,
    detail: String
  },
  profileImage: {
    type: String,
    default: null
  },
  idCardFront: String,
  idCardBack: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  creditScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 1000
  },
  totalBorrowed: {
    type: Number,
    default: 0
  },
  totalRepaid: {
    type: Number,
    default: 0
  },
  activeLoans: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  fcmToken: String, // Push notification
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Password hash хийх
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password шалгах method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Нас тооцоолох
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);