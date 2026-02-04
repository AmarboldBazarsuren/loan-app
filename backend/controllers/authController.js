const User = require('../models/User');
const generateToken = require('../utils/tokenGenerator');
const sendEmail = require('../utils/sendEmail');
const { uploadImage } = require('../utils/cloudinary');
const crypto = require('crypto');

// @desc    Бүртгүүлэх
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, registerNumber, dateOfBirth } = req.body;

    // Хэрэглэгч байгаа эсэхийг шалгах
    const userExists = await User.findOne({ $or: [{ email }, { phone }, { registerNumber }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Имэйл, утас эсвэл регистрийн дугаар аль хэдийн бүртгэлтэй байна'
      });
    }

    // Хэрэглэгч үүсгэх
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      registerNumber,
      dateOfBirth
    });

    // Токен үүсгэх
    const token = generateToken(user._id);

    // Welcome email илгээх
    await sendEmail({
      email: user.email,
      subject: 'Тавтай морил!',
      message: `Сайн байна уу ${user.firstName}, манай апп-д бүртгүүлсэнд баярлалаа!`,
      html: `<h1>Тавтай морил!</h1><p>Та амжилттай бүртгүүллээ.</p>`
    });

    res.status(201).json({
      success: true,
      message: 'Амжилттай бүртгүүллээ',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          creditScore: user.creditScore
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

// @desc    Нэвтрэх
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Хэрэглэгч олох (password-тай хамт)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Имэйл эсвэл нууц үг буруу байна'
      });
    }

    // Нууц үг шалгах
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Имэйл эсвэл нууц үг буруу байна'
      });
    }

    // Идэвхгүй эсэхийг шалгах
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Таны эрх хаагдсан байна. Админд хандана уу.'
      });
    }

    // Сүүлд нэвтэрсэн огноо шинэчлэх
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Токен үүсгэх
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Амжилттай нэвтэрлээ',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          creditScore: user.creditScore,
          profileImage: user.profileImage
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

// @desc    Өөрийн мэдээлэл авах
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Профайл засах
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const updateData = {
      firstName,
      lastName,
      phone
    };

    // Профайл зураг upload
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'loan-app/profiles');
      updateData.profileImage = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Профайл амжилттай шинэчлэгдлээ',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Нууц үг солих
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Одоогийн нууц үг шалгах
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Одоогийн нууц үг буруу байна'
      });
    }

    // Шинэ нууц үг тохируулах
    user.password = newPassword;
    await user.save();

    // Токен үүсгэх
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Нууц үг амжилттай солигдлоо',
      data: { token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Нууц үг сэргээх хүсэлт
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Имэйл хаяг олдсонгүй'
      });
    }

    // Reset токен үүсгэх
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 минут
    await user.save({ validateBeforeSave: false });

    // Reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email илгээх
    await sendEmail({
      email: user.email,
      subject: 'Нууц үг сэргээх',
      message: `Нууц үг сэргээх линк: ${resetUrl}`,
      html: `
        <h2>Нууц үг сэргээх</h2>
        <p>Доорх товч дээр дарж нууц үгээ сэргээнэ үү:</p>
        <a href="${resetUrl}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Нууц үг сэргээх</a>
        <p>Энэ линк 10 минутын дараа хүчингүй болно.</p>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Нууц үг сэргээх линк таны имэйл рүү илгээгдлээ'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Нууц үг сэргээх
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Токен буруу эсвэл хугацаа дууссан байна'
      });
    }

    // Шинэ нууц үг тохируулах
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Токен үүсгэх
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Нууц үг амжилттай солигдлоо',
      data: { token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Гарах
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // FCM токен устгах
    await User.findByIdAndUpdate(req.user.id, { fcmToken: null });

    res.status(200).json({
      success: true,
      message: 'Амжилттай гарлаа'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};