const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: 100
    },
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
        minlength: 10,
        maxlength: 1000
    },
    verified: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date
}, { timestamps: true });

// Compound index for unique review per user-event
reviewSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
