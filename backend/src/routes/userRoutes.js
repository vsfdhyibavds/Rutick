const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAttendanceRecord,
    deactivateAccount,
    getDashboardStats,
    getMyReminders,
    markReminderAsRead
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.get('/profile/:userId', getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/change-password', authMiddleware, changePassword);
router.get('/attendance/:userId', authMiddleware, getAttendanceRecord);
router.get('/:userId/reminders', authMiddleware, getMyReminders);
router.post('/:userId/reminders/:reminderId/read', authMiddleware, markReminderAsRead);
router.delete('/deactivate', authMiddleware, deactivateAccount);
router.get('/dashboard/stats', authMiddleware, getDashboardStats);

module.exports = router;
