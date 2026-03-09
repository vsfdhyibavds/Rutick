const express = require('express');
const {
    registerForEvent,
    cancelRegistration,
    getRegistration,
    getEventRegistrations,
    checkInAttendee
} = require('../controllers/registrationController');
const { authMiddleware } = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');

const router = express.Router();

// Protected routes
router.post('/events/:eventId/register', authMiddleware, registerForEvent);
router.delete('/events/:eventId/unregister', authMiddleware, cancelRegistration);
router.get('/events/:eventId/registration', authMiddleware, getRegistration);
router.get('/events/:eventId/registrations', authMiddleware, roleMiddleware(['staff', 'admin']), getEventRegistrations);
router.post('/:registrationId/check-in', authMiddleware, roleMiddleware(['staff', 'admin']), checkInAttendee);

module.exports = router;
