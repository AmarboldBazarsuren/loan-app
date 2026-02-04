const Loan = require('../models/Loan');

// @desc    Төлбөрийн аргууд
// @route   GET /api/payments/methods
// @access  Private
exports.getPaymentMethods = async (req, res) => {
  try {
    const methods = [
      {
        id: 'qpay',
        name: 'QPay',
        icon: '💳',
        description: 'Бүх банкны апп ашиглан төлөх'
      },
      {
        id: 'bank_transfer',
        name: 'Шилжүүлэг',
        icon: '🏦',
        description: 'Банкны шилжүүлгээр төлөх'
      },
      {
        id: 'card',
        name: 'Карт',
        icon: '💰',
        description: 'Дебит/Кредит картаар төлөх'
      },
      {
        id: 'cash',
        name: 'Бэлэн',
        icon: '💵',
        description: 'Салбар дээр бэлнээр төлөх'
      }
    ];

    res.status(200).json({
      success: true,
      data: methods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Төлбөр эхлүүлэх
// @route   POST /api/payments/initiate
// @access  Private
exports.initiatePayment = async (req, res) => {
  try {
    const { loanId, amount, method } = req.body;

    const loan = await Loan.findById(loanId);

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

    // QPay эсвэл бусад төлбөрийн gateway-тэй холбогдох
    // Энд demo учир зүгээр хариу буцаана
    const paymentReference = `PAY${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    res.status(200).json({
      success: true,
      data: {
        paymentReference,
        amount,
        method,
        qrCode: method === 'qpay' ? 'https://via.placeholder.com/300' : null,
        bankDetails: method === 'bank_transfer' ? {
          accountName: 'Зээлийн Компани ХХК',
          accountNumber: '1234567890',
          bankName: 'Хаан банк'
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Төлбөр баталгаажуулах
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentReference } = req.body;

    // Төлбөр баталгаажуулах логик
    // Demo учир зүгээр амжилттай гэж үзнэ

    res.status(200).json({
      success: true,
      message: 'Төлбөр амжилттай баталгаажлаа',
      data: {
        status: 'completed',
        reference: paymentReference
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Төлбөрийн түүх
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id });

    // Бүх төлбөрүүдийг цуглуулах
    const payments = [];
    loans.forEach(loan => {
      loan.payments.forEach(payment => {
        payments.push({
          ...payment.toObject(),
          loanId: loan._id,
          loanAmount: loan.amount
        });
      });
    });

    // Огноогоор эрэмбэлэх
    payments.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};