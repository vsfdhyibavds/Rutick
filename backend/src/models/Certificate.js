const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    certificateId: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: Date,
    fileUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['issued', 'revoked'],
        default: 'issued'
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

certificateSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', certificateSchema);
