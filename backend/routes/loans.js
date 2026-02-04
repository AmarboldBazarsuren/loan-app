const express = require('express');
const router = express.Router();
const {
  getLoanTypes,
  requestLoan,
  getMyLoans,
  getLoanById,
  makePayment,
  uploadDocuments,
  calculateLoan
} = require('../controllers/loanController');
const { protect } = require('../middleware/auth');
const { validateLoanRequest } = require('../middleware/validator');
const upload = require('../middleware/upload');

router.get('/types', protect, getLoanTypes);
router.post('/calculate', protect, calculateLoan);
router.post('/request', protect, validateLoanRequest, requestLoan);
router.get('/my-loans', protect, getMyLoans);
router.get('/:id', protect, getLoanById);
router.post('/:id/payment', protect, makePayment);
router.post('/:id/documents', protect, upload.array('documents', 5), uploadDocuments);

module.exports = router;