const User = require('../models/User');
const { uploadImage } = require('../utils/cloudinary');

// @desc    Иргэний үнэмлэх upload
// @route   POST /api/users/id-card
// @access  Private
exports.uploadIdCard = async (req, res) => {
  try {
    if (!req.files || !req.files.front || !req.files.back) {
      return res.status(400).json({
        success: false,
        message: 'Иргэний үнэмлэхний хоёр талыг оруулна уу'
      });
    }

    // Зургууд upload хийх
    const frontResult = await uploadImage(req.files.front[0].buffer, 'loan-app/id-cards');
    const backResult = await uploadImage(req.files.back[0].buffer, 'loan-app/id-cards');

    // Хэрэглэгчийн мэдээлэл шинэчлэх
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        idCardFront: frontResult.secure_url,
        idCardBack: backResult.secure_url,
        verificationStatus: 'pending'
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Иргэний үнэмлэх амжилттай орууллаа. Баталгаажуулалт хийгдэж байна.',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Хаяг шинэчлэх
// @route   PUT /api/users/address
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const { city, district, street, detail } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        address: { city, district, street, detail }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Хаяг амжилттай шинэчлэгдлээ',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Мэдэгдлүүд авах
// @route   GET /api/users/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    // Энэ хэсгийг Notification model үүсгэсний дараа бичнэ
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Мэдэгдэл уншсан гэж тэмдэглэх
// @route   PUT /api/users/notifications/:id/read
// @access  Private
exports.markNotificationRead = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Мэдэгдэл уншигдсан'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    FCM токен шинэчлэх
// @route   POST /api/users/fcm-token
// @access  Private
exports.updateFCMToken = async (req, res) => {
  try {
    const { token } = req.body;

    await User.findByIdAndUpdate(req.user.id, { fcmToken: token });

    res.status(200).json({
      success: true,
      message: 'FCM токен шинэчлэгдлээ'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};