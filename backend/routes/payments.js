const express = require('express');
const router = express.Router();
const {
  getPaymentMethods,
  initiatePayment,
  verifyPayment,
  getPaymentHistory
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/methods', protect, getPaymentMethods);
router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

module.exports = router;