const Review = require('../models/Review');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { Op, fn, col } = require('sequelize');

// Create review
exports.createReview = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { rating, title, comment } = req.body;

        // Validation
        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Please provide rating and comment'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        if (comment.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Comment must be at least 10 characters'
            });
        }

        // Check if user attended the event
        const registration = await Registration.findOne({
            where: { userId: req.user.id, eventId, status: 'checked-in' }
        });

        if (!registration) {
            return res.status(403).json({
                success: false,
                message: 'You must attend the event to leave a review'
            });
        }

        // Check if already reviewed
        const existing = await Review.findOne({
            where: { userId: req.user.id, eventId }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this event'
            });
        }

        const review = await Review.create({
            userId: req.user.id,
            eventId,
            rating,
            title,
            comment,
            verified: true
        });

        // Update event rating
        const reviews = await Review.findAll({ where: { eventId } });
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
            : 0;
        const event = await Event.findByPk(eventId);
        event.rating = Math.round(avgRating * 10) / 10;
        event.reviewCount = reviews.length;
        await event.save();

        const populatedReview = await review.reload({
            include: [{
                association: 'user',
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'avatar']
            }]
        });

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review: populatedReview
        });
    } catch (error) {
        next(error);
    }
};

// Get event reviews
exports.getEventReviews = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        const sortField = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;
        const sortOrder = sortBy.startsWith('-') ? 'DESC' : 'ASC';

        const { count, rows: reviews } = await Review.findAndCountAll({
            where: { eventId },
            include: [{
                association: 'user',
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'avatar']
            }],
            order: [[sortField, sortOrder]],
            offset,
            limit: limitNum
        });

        res.json({
            success: true,
            count: reviews.length,
            total: count,
            pages: Math.ceil(count / limitNum),
            reviews
        });
    } catch (error) {
        next(error);
    }
};

// Update review
exports.updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { rating, title, comment } = req.body;

        let review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check authorization
        if (review.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        if (rating) review.rating = rating;
        if (title) review.title = title;
        if (comment) review.comment = comment;

        await review.save();

        res.json({
            success: true,
            message: 'Review updated successfully',
            review
        });
    } catch (error) {
        next(error);
    }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check authorization
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await review.destroy();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Like review
exports.likeReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.likes += 1;
        await review.save();

        res.json({
            success: true,
            message: 'Review liked',
            likes: review.likes
        });
    } catch (error) {
        next(error);
    }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check authorization
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await Review.destroy({ where: { id: reviewId } });

        // Update event rating
        const reviews = await Review.findAll({ where: { eventId: review.eventId } });
        const event = await Event.findByPk(review.eventId);
        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            event.rating = avgRating;
        } else {
            event.rating = 0;
        }
        await event.save();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Like review
exports.likeReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.likes += 1;
        await review.save();

        res.json({
            success: true,
            message: 'Review liked',
            likes: review.likes
        });
    } catch (error) {
        next(error);
    }
};
