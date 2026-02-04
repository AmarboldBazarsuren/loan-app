// src/utils/validators.ts
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[0-9]{8}$/;
  return re.test(phone);
};

export const validateRegisterNumber = (registerNumber: string): boolean => {
  const re = /^[А-ЯӨҮ]{2}[0-9]{8}$/;
  return re.test(registerNumber);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  message: string;
} => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой',
    };
  }
  return { isValid: true, message: '' };
};

export const validateAmount = (
  amount: number,
  min: number,
  max: number
): { isValid: boolean; message: string } => {
  if (amount < min) {
    return {
      isValid: false,
      message: `Хамгийн бага дүн ${formatMoney(min)}`,
    };
  }
  if (amount > max) {
    return {
      isValid: false,
      message: `Хамгийн их дүн ${formatMoney(max)}`,
    };
  }
  return { isValid: true, message: '' };
};

const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('mn-MN').format(amount) + '₮';
};