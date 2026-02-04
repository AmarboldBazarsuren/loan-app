const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT токен шалгах middleware
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Header-ээс токен авах
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Токен байхгүй бол алдаа
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Нэвтрэх эрхгүй байна'
      });
    }

    // Токен шалгах
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Хэрэглэгч олох
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Хэрэглэгч олдсонгүй'
      });
    }

    // Хэрэглэгч идэвхгүй эсэхийг шалгах
    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Таны эрх хаагдсан байна'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Токен буруу эсвэл хүчингүй болсон'
    });
  }
};

// Admin эрх шалгах
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Танд энэ үйлдэл хийх эрх байхгүй'
      });
    }
    next();
  };
};