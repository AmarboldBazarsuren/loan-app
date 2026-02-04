const User = require('../models/User');
const Loan = require('../models/Loan');
const LoanType = require('../models/LoanType');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const calculateCreditScore = require('../utils/creditScoreCalculator');

// @desc    Dashboard статистик
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const pendingVerifications = await User.countDocuments({ verificationStatus: 'pending' });
    
    const totalLoans = await Loan.countDocuments();
    const activeLoans = await Loan.countDocuments({ status: 'active' });
    const pendingLoans = await Loan.countDocuments({ status: 'pending' });
    const completedLoans = await Loan.countDocuments({ status: 'completed' });
    const defaultedLoans = await Loan.countDocuments({ status: 'defaulted' });

    // Нийт олгосон зээл
    const totalDisbursed = await Loan.aggregate([
      { $match: { status: { $in: ['active', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$disbursedAmount' } } }
    ]);

    // Нийт цуглуулсан төлбөр
    const totalCollected = await Loan.aggregate([
      { $unwind: '$payments' },
      { $match: { 'payments.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$payments.amount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          pendingVerification: pendingVerifications
        },
        loans: {
          total: totalLoans,
          active: activeLoans,
          pending: pendingLoans,
          completed: completedLoans,
          defaulted: defaultedLoans
        },
        financial: {
          totalDisbursed: totalDisbursed[0]?.total || 0,
          totalCollected: totalCollected[0]?.total || 0,
          outstanding: (totalDisbursed[0]?.total || 0) - (totalCollected[0]?.total || 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Бүх хэрэглэгчид
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;

    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.verificationStatus = status;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Хэрэглэгчийн дэлгэрэнгүй
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    // Хэрэглэгчийн зээлүүд
    const loans = await Loan.find({ user: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        loans
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Хэрэглэгч баталгаажуулах
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    user.isVerified = true;
    user.verificationStatus = 'approved';
    
    // Кредит оноо тооцоолох
    user.creditScore = calculateCreditScore(user);
    
    await user.save();

    // Notification илгээх
    await sendEmail({
      email: user.email,
      subject: 'Баталгаажуулалт амжилттай',
      message: 'Таны бүртгэл амжилттай баталгаажлаа. Одоо зээл авах боломжтой.',
      html: '<h2>Баталгаажлаа!</h2><p>Та одоо зээл хүсэх боломжтой болсон.</p>'
    });

    await sendSMS(user.phone, 'Таны бүртгэл амжилттай баталгаажлаа!');

    res.status(200).json({
      success: true,
      message: 'Хэрэглэгч баталгаажлаа',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Хэрэглэгч татгалзах
// @route   PUT /api/admin/users/:id/reject
// @access  Private/Admin
exports.rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    user.verificationStatus = 'rejected';
    await user.save();

    // Notification илгээх
    await sendEmail({
      email: user.email,
      subject: 'Баталгаажуулалт татгалзагдлаа',
      message: `Таны бүртгэл татгалзагдсан. Шалтгаан: ${reason}`,
      html: `<h2>Татгалзагдлаа</h2><p>Шалтгаан: ${reason}</p>`
    });

    res.status(200).json({
      success: true,
      message: 'Хэрэглэгч татгалзагдлаа',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Бүх зээлүүд
// @route   GET /api/admin/loans
// @access  Private/Admin
exports.getAllLoans = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    let loans = await Loan.find(query)
      .populate('user', 'firstName lastName email phone creditScore')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Search by user name
    if (search) {
      loans = loans.filter(loan => {
        const fullName = `${loan.user.firstName} ${loan.user.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
      });
    }

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

// @desc    Зээл зөвшөөрөх
// @route   PUT /api/admin/loans/:id/approve
// @access  Private/Admin
exports.approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('user');

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Зээл олдсонгүй'
      });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Энэ зээлийг зөвшөөрөх боломжгүй'
      });
    }

    loan.status = 'approved';
    loan.approvedBy = req.user.id;
    loan.approvedAt = Date.now();
    loan.disbursedAmount = loan.amount;
    loan.disbursedAt = Date.now();
    
    // Дараагийн төлөлт тооцоолох
    loan.calculateNextPayment();
    
    // Статус active болгох
    loan.status = 'active';
    
    await loan.save();

    // Хэрэглэгчийн мэдээлэл шинэчлэх
    const user = loan.user;
    user.totalBorrowed += loan.amount;
    await user.save();

    // Notification илгээх
    await sendEmail({
      email: user.email,
      subject: 'Зээл зөвшөөрөгдлөө',
      message: `Таны ${loan.amount}₮ зээл зөвшөөрөгдлөө!`,
      html: `
        <h2>Баяр хүргэе!</h2>
        <p>Таны зээл зөвшөөрөгдлөө.</p>
        <p>Дүн: ${loan.amount}₮</p>
        <p>Сард төлөх: ${loan.monthlyPayment}₮</p>
        <p>Хугацаа: ${loan.duration} сар</p>
      `
    });

    await sendSMS(user.phone, `Таны ${loan.amount}₮ зээл зөвшөөрөгдлөө!`);

    res.status(200).json({
      success: true,
      message: 'Зээл зөвшөөрөгдлөө',
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Зээл татгалзах
// @route   PUT /api/admin/loans/:id/reject
// @access  Private/Admin
exports.rejectLoan = async (req, res) => {
  try {
    const { reason } = req.body;

    const loan = await Loan.findById(req.params.id).populate('user');

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Зээл олдсонгүй'
      });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Энэ зээлийг татгалзах боломжгүй'
      });
    }

    loan.status = 'rejected';
    loan.rejectedReason = reason;
    await loan.save();

    // Хэрэглэгчийн идэвхтэй зээл хасах
    const user = loan.user;
    user.activeLoans = Math.max(0, user.activeLoans - 1);
    await user.save();

    // Notification илгээх
    await sendEmail({
      email: user.email,
      subject: 'Зээлийн хүсэлт татгалзагдлаа',
      message: `Таны зээлийн хүсэлт татгалзагдлаа. Шалтгаан: ${reason}`,
      html: `<h2>Татгалзагдлаа</h2><p>Шалтгаан: ${reason}</p>`
    });

    res.status(200).json({
      success: true,
      message: 'Зээл татгалзагдлаа',
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Зээлийн төрөл үүсгэх
// @route   POST /api/admin/loan-types
// @access  Private/Admin
exports.createLoanType = async (req, res) => {
  try {
    const loanType = await LoanType.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Зээлийн төрөл үүсгэгдлээ',
      data: loanType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Зээлийн төрөл засах
// @route   PUT /api/admin/loan-types/:id
// @access  Private/Admin
exports.updateLoanType = async (req, res) => {
  try {
    const loanType = await LoanType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!loanType) {
      return res.status(404).json({
        success: false,
        message: 'Зээлийн төрөл олдсонгүй'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Зээлийн төрөл шинэчлэгдлээ',
      data: loanType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Зээлийн төрөл устгах
// @route   DELETE /api/admin/loan-types/:id
// @access  Private/Admin
exports.deleteLoanType = async (req, res) => {
  try {
    const loanType = await LoanType.findByIdAndDelete(req.params.id);

    if (!loanType) {
      return res.status(404).json({
        success: false,
        message: 'Зээлийн төрөл олдсонгүй'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Зээлийн төрөл устгагдлаа'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};