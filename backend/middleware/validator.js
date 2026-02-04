const Joi = require('joi');

// Бүртгэл validation
exports.validateRegister = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required()
      .messages({
        'string.empty': 'Нэр оруулна уу',
        'string.min': 'Нэр хамгийн багадаа 2 тэмдэгт байх ёстой'
      }),
    lastName: Joi.string().min(2).max(50).required()
      .messages({
        'string.empty': 'Овог оруулна уу'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Зөв имэйл хаяг оруулна уу'
      }),
    phone: Joi.string().pattern(/^[0-9]{8}$/).required()
      .messages({
        'string.pattern.base': 'Утасны дугаар 8 оронтой байх ёстой'
      }),
    password: Joi.string().min(6).required()
      .messages({
        'string.min': 'Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой'
      }),
    registerNumber: Joi.string().pattern(/^[А-ЯӨҮ]{2}[0-9]{8}$/).required()
      .messages({
        'string.pattern.base': 'Регистрийн дугаар буруу байна (жнь: УБ12345678)'
      }),
    dateOfBirth: Joi.date().max('now').required()
      .messages({
        'date.max': 'Төрсөн огноо буруу байна'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

// Нэвтрэх validation
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Имэйл эсвэл нууц үг буруу байна'
    });
  }

  next();
};

// Зээл хүсэлт validation
exports.validateLoanRequest = (req, res, next) => {
  const schema = Joi.object({
    loanType: Joi.string().valid('instant', 'personal', 'business', 'emergency', 'salary_advance').required(),
    amount: Joi.number().min(10000).max(50000000).required()
      .messages({
        'number.min': 'Хамгийн бага зээл 10,000₮',
        'number.max': 'Хамгийн их зээл 50,000,000₮'
      }),
    duration: Joi.number().min(1).max(60).required()
      .messages({
        'number.min': 'Хамгийн багадаа 1 сар',
        'number.max': 'Хамгийн ихдээ 60 сар'
      }),
    purpose: Joi.string().max(500).optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};