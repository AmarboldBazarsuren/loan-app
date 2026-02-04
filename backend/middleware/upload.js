const multer = require('multer');
const path = require('path');

// Зургийн хэмжээ шалгах
const maxSize = 5 * 1024 * 1024; // 5MB

// File filter - зөвхөн зураг
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Зөвхөн зураг болон PDF файл оруулна уу'));
  }
};

// Multer config
const upload = multer({
  storage: multer.memoryStorage(), // Cloudinary руу шууд upload хийхийн тулд memory storage
  limits: { fileSize: maxSize },
  fileFilter: fileFilter
});

module.exports = upload;