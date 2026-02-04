// Алдаа боловсруулах middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Console дээр алдаа харуулах (development)
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Өгөгдөл олдсонгүй';
    error = { message, statusCode: 404 };
  }

  // Mongoose давхцсан утга
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} аль хэдийн бүртгэлтэй байна`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation алдаа
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT токен алдаа
  if (err.name === 'JsonWebTokenError') {
    const message = 'Токен буруу байна';
    error = { message, statusCode: 401 };
  }

  // JWT токен хугацаа дууссан
  if (err.name === 'TokenExpiredError') {
    const message = 'Токены хугацаа дууссан байна';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Серверийн алдаа гарлаа',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;