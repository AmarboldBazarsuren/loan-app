// Кредит оноо тооцоолох
const calculateCreditScore = (user) => {
  let score = 500; // Анхны оноо

  // Төлбөрийн түүх (40%)
  if (user.totalRepaid > 0) {
    const repaymentRate = (user.totalRepaid / user.totalBorrowed) * 100;
    if (repaymentRate >= 100) score += 200;
    else if (repaymentRate >= 80) score += 150;
    else if (repaymentRate >= 60) score += 100;
    else if (repaymentRate >= 40) score += 50;
  }

  // Идэвхтэй зээлийн тоо (20%)
  if (user.activeLoans === 0) score += 100;
  else if (user.activeLoans === 1) score += 80;
  else if (user.activeLoans === 2) score += 50;
  else score -= 50;

  // Баталгаажсан эсэх (20%)
  if (user.isVerified) score += 100;

  // Насны хүчин зүйл (10%)
  const age = user.age;
  if (age >= 25 && age <= 55) score += 50;
  else if (age >= 18 && age < 25) score += 30;

  // Аккаунтын нас (10%)
  const accountAge = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));
  if (accountAge > 365) score += 50;
  else if (accountAge > 180) score += 30;
  else if (accountAge > 90) score += 20;

  // Максимум 1000, минимум 300
  return Math.min(Math.max(score, 300), 1000);
};

module.exports = calculateCreditScore;