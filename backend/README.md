# Зээлийн Апп - Backend API

Production-түвшний зээлийн систем backend API.

## Технологи

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - File storage
- **Nodemailer** - Email service
- **Twilio** - SMS service

## Суулгах
```bash
# Dependencies суулгах
npm install

# Environment variables тохируулах
cp .env.example .env
# .env файлд өөрийн тохиргоо оруулах

# MongoDB эхлүүлэх
# Docker ашиглавал:
docker run -d -p 27017:27017 --name mongodb mongo

# Эсвэл MongoDB Atlas ашиглаж болно
```

## Ажиллуулах
```bash
# Development mode
npm run dev

# Production mode
npm start

# Seed data оруулах
node seeds/loanTypes.js
node seeds/adminUser.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Бүртгүүлэх
- `POST /api/auth/login` - Нэвтрэх
- `GET /api/auth/me` - Өөрийн мэдээлэл
- `PUT /api/auth/profile` - Профайл засах
- `PUT /api/auth/password` - Нууц үг солих
- `POST /api/auth/forgot-password` - Нууц үг сэргээх
- `PUT /api/auth/reset-password/:token` - Нууц үг шинэчлэх

### Loans
- `GET /api/loans/types` - Зээлийн төрлүүд
- `POST /api/loans/calculate` - Зээл тооцоолох
- `POST /api/loans/request` - Зээл хүсэх
- `GET /api/loans/my-loans` - Миний зээлүүд
- `GET /api/loans/:id` - Зээлийн дэлгэрэнгүй
- `POST /api/loans/:id/payment` - Төлбөр төлөх
- `POST /api/loans/:id/documents` - Баримт оруулах

### Users
- `POST /api/users/id-card` - Иргэний үнэмлэх upload
- `PUT /api/users/address` - Хаяг шинэчлэх
- `GET /api/users/notifications` - Мэдэгдлүүд
- `POST /api/users/fcm-token` - FCM токен

### Admin
- `GET /api/admin/dashboard` - Dashboard статистик
- `GET /api/admin/users` - Бүх хэрэглэгчид
- `GET /api/admin/users/:id` - Хэрэглэгчийн дэлгэрэнгүй
- `PUT /api/admin/users/:id/verify` - Хэрэглэгч баталгаажуулах
- `PUT /api/admin/users/:id/reject` - Хэрэглэгч татгалзах
- `GET /api/admin/loans` - Бүх зээлүүд
- `PUT /api/admin/loans/:id/approve` - Зээл зөвшөөрөх
- `PUT /api/admin/loans/:id/reject` - Зээл татгалзах
- `POST /api/admin/loan-types` - Зээлийн төрөл үүсгэх

### Payments
- `GET /api/payments/methods` - Төлбөрийн аргууд
- `POST /api/payments/initiate` - Төлбөр эхлүүлэх
- `POST /api/payments/verify` - Төлбөр баталгаажуулах
- `GET /api/payments/history` - Төлбөрийн түүх

## Default Admin Account
```
Email: admin@loanapp.mn
Password: admin123456
```

## Аюулгүй байдал

- JWT токен authentication
- Password bcrypt hashing
- Rate limiting
- Helmet security headers
- Input validation (Joi)
- MongoDB injection protection
- XSS protection

## License

MIT