const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true
    },
    registeredAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    ticketId: {
        type: String,
        unique: true,
        required: true
    },
    qrCode: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['registered', 'checked-in', 'cancelled'],
        default: 'registered',
        index: true
    },
    checkedInAt: Date,
    checkedInBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String,
    cancelledAt: Date,
    cancelledReason: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Compound index for unique registration per user-event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
