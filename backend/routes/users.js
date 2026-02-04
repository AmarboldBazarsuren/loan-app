const express = require('express');
const router = express.Router();
const {
  uploadIdCard,
  updateAddress,
  getNotifications,
  markNotificationRead,
  updateFCMToken
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/id-card', protect, upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]), uploadIdCard);
router.put('/address', protect, updateAddress);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.post('/fcm-token', protect, updateFCMToken);

module.exports = router;