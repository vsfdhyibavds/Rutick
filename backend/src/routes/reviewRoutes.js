const express = require('express');
const {
    createReview,
    getEventReviews,
    updateReview,
    deleteReview,
    likeReview
} = require('../controllers/reviewController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/events/:eventId/reviews', optionalAuth, getEventReviews);

// Protected routes
router.post('/events/:eventId/reviews', authMiddleware, createReview);
router.put('/reviews/:reviewId', authMiddleware, updateReview);
router.delete('/reviews/:reviewId', authMiddleware, deleteReview);
router.post('/reviews/:reviewId/like', authMiddleware, likeReview);

module.exports = router;
