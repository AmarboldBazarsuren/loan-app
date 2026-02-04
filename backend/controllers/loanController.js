const Loan = require('../models/Loan');
const LoanType = require('../models/LoanType');
const User = require('../models/User');
const { uploadImage } = require('../utils/cloudinary');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

// @desc    Зээлийн төрлүүд авах
// @route   GET /api/loans/types
// @access  Private
exports.getLoanTypes = async (req, res) => {
  try {
    const loanTypes = await LoanType.find({ isActive: true }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: loanTypes.length,
      data: loanTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Зээл тооцоолох
// @route   POST /api/loans/calculate
// @access  Private
exports.calculateLoan = async (req, res) => {
  try {
    const { amount, duration, interestRate } = req.body;

    const monthlyRate = interestRate / 100;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
                          (Math.pow(1 + monthlyRate, duration) - 1);
    const totalRepayment = monthlyPayment * duration;
    const totalInterest = totalRepayment - amount;

    res.status(200).json({
      success: true,
      data: {
        loanAmount: amount,
        duration: duration,
        interestRate: interestRate,
        monthlyPayment: Math.round(monthlyPayment),
        totalRepayment: Math.round(totalRepayment),
        totalInterest: Math.round(totalInterest)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Зээл хүсэх
// @route   POST /api/loans/request
// @access  Private
exports.requestLoan = async (req, res) => {
  try {
    const { loanType, amount, duration, purpose } = req.body;

    // Хэрэглэгч баталгаажсан эсэхийг шалгах
    const user = await User.findById(req.user.id);
    
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Та эхлээд баталгаажуулалт хийлгэнэ үү'
      });
    }

    // Зээлийн төрөл шалгах
    const loanTypeData = await LoanType.findOne({ nameEn: loanType, isActive: true });

    if (!loanTypeData) {
      return res.status(404).json({
        success: false,
        message: 'Зээлийн төрөл олдсонгүй'
      });
    }

    // Дүн шалгах
    if (amount < loanTypeData.minAmount || amount > loanTypeData.maxAmount) {
      return res.status(400).json({
        success: false,
        message: `Зээлийн дүн ${loanTypeData.minAmount}₮ - ${loanTypeData.maxAmount}₮ хооронд байх ёстой`
      });
    }

    // Хугацаа шалгах
    if (duration < loanTypeData.minDuration || duration > loanTypeData.maxDuration) {
      return res.status(400).json({
        success: false,
        message: `Зээлийн хугацаа ${loanTypeData.minDuration} - ${loanTypeData.maxDuration} сарын хооронд байх ёстой`
      });
    }

    // Зээл үүсгэх
    const loan = await Loan.create({
      user: req.user.id,
      loanType,
      amount,
      duration,
      purpose,
      interestRate: loanTypeData.interestRate
    });

    // Сард төлөх дүн тооцоолох
    loan.calculateMonthlyPayment();
    await loan.save();

    // Идэвхтэй зээлийн тоо нэмэх
    user.activeLoans += 1;
    await user.save();

    // Notification илгээх
    await sendEmail({
      email: user.email,
      subject: 'Зээлийн хүсэлт хүлээн авлаа',
      message: `Таны ${amount}₮ зээлийн хүсэлт хүлээн авлаа. Удахгүй шийдвэрлэгдэх болно.`,
      html: `<h2>Зээлийн хүсэлт</h2><p>Дүн: ${amount}₮</p><p>Хугацаа: ${duration} сар</p>`
    });

    res.status(201).json({
      success: true,
      message: 'Зээлийн хүсэлт амжилттай илгээгдлээ',
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Миний зээлүүд
// @route   GET /api/loans/my-loans
// @access  Private
exports.getMyLoans = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const loans = await Loan.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Loan.countDocuments(query);

    res.status(200).json({
      success: true,
      count: loans.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: loans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Зээлийн дэлгэрэнгүй
// @route   GET /api/loans/:id
// @access  Private
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('user', 'firstName lastName email phone');

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Зээл олдсонгүй'
      });
    }

    // Өөрийн зээл эсэхийг шалгах (admin биш бол)
    if (loan.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Танд энэ зээлийн мэдээлэл үзэх эрх байхгүй'
      });
    }

    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Төлбөр төлөх
// @route   POST /api/loans/:id/payment
// @access  Private
exports.makePayment = async (req, res) => {
  try {
    const { amount, method, reference } = req.body;

    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Зээл олдсонгүй'
      });
    }

    // Өөрийн зээл эсэхийг шалгах
    if (loan.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Энэ зээлд төлбөр төлөх эрхгүй'
      });
    }

    // Зээл идэвхтэй эсэхийг шалгах
    if (loan.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Энэ зээл идэвхгүй байна'
      });
    }

    // Төлбөр нэмэх
    loan.payments.push({
      amount,
      method,
      reference,
      type: amount >= loan.monthlyPayment ? 'monthly' : 'partial',
      status: 'completed'
    });

    // Үлдэгдэл тооцоолох
    loan.outstandingBalance -= amount;

    // Бүрэн төлөгдсөн эсэхийг шалгах
    if (loan.outstandingBalance <= 0) {
      loan.status = 'completed';
      loan.completedAt = Date.now();
      loan.outstandingBalance = 0;

      // Хэрэглэгчийн мэдээлэл шинэчлэх
      const user = await User.findById(req.user.id);
      user.activeLoans -= 1;
      user.totalRepaid += loan.totalRepayment;
      await user.save();
    } else {
      // Дараагийн төлөлт тооцоолох
      loan.calculateNextPayment();
    }

    await loan.save();

    // Notification илгээх
    const user = await User.findById(req.user.id);
    await sendSMS(user.phone, `Таны ${amount}₮ төлбөр амжилттай баталгаажлаа. Үлдэгдэл: ${loan.outstandingBalance}₮`);

    res.status(200).json({
      success: true,
      message: 'Төлбөр амжилттай төлөгдлөө',
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Баримт бичиг upload
// @route   POST /api/loans/:id/documents
// @access  Private
exports.uploadDocuments = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Зээл олдсонгүй'
      });
    }

    // Өөрийн зээл эсэхийг шалгах
    if (loan.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Энэ зээлд баримт оруулах эрхгүй'
      });
    }

    // Файлууд upload хийх
    const uploadPromises = req.files.map(async (file) => {
      const result = await uploadImage(file.buffer, 'loan-app/documents');
      return {
        type: req.body.type || 'other',
        url: result.secure_url
      };
    });

    const documents = await Promise.all(uploadPromises);

    // Баримтууд нэмэх
    loan.documents.push(...documents);
    await loan.save();

    res.status(200).json({
      success: true,
      message: 'Баримт бичиг амжилттай орууллаа',
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};