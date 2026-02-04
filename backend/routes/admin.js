const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  verifyUser,
  rejectUser,
  getAllLoans,
  approveLoan,
  rejectLoan,
  getDashboardStats,
  createLoanType,
  updateLoanType,
  deleteLoanType
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Admin эрх шаардлагатай бүх route
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/verify', verifyUser);
router.put('/users/:id/reject', rejectUser);
router.get('/loans', getAllLoans);
router.put('/loans/:id/approve', approveLoan);
router.put('/loans/:id/reject', rejectLoan);
router.post('/loan-types', createLoanType);
router.put('/loan-types/:id', updateLoanType);
router.delete('/loan-types/:id', deleteLoanType);

module.exports = router;