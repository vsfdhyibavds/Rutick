const express = require('express');
const {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getMyEvents
} = require('../controllers/eventController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllEvents);
router.get('/:id', optionalAuth, getEvent);

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['staff', 'admin']), createEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.get('/user/my-events', authMiddleware, getMyEvents);

module.exports = router;
