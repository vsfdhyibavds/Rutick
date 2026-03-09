const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true,
        maxlength: 200,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Please provide event description'],
        maxlength: 2000
    },
    category: {
        type: String,
        enum: ['academic', 'social', 'administrative', 'sports', 'cultural'],
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: [true, 'Please provide event date'],
        index: true
    },
    time: {
        type: String,
        required: [true, 'Please provide event time'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    duration: {
        type: Number,
        default: 120 // minutes
    },
    location: {
        type: String,
        required: [true, 'Please provide event location'],
        index: true
    },
    capacity: {
        type: Number,
        required: [true, 'Please provide event capacity'],
        min: 1,
        max: 10000
    },
    registeredCount: {
        type: Number,
        default: 0,
        min: 0
    },
    attendedCount: {
        type: Number,
        default: 0,
        min: 0
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    banner: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        set: function(val) {
            return Math.round(val * 10) / 10;
        }
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    registrants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    attendees: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        checkedInAt: {
            type: Date,
            default: Date.now
        },
        checkedInBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date,
    deletedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for searching events
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Update status based on date
eventSchema.pre('find', function() {
    this.select('-isDeleted -deletedAt');
});

module.exports = mongoose.model('Event', eventSchema);
