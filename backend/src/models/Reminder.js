const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    reminderType: {
        type: String,
        enum: ['24h-before', '1h-before', 'day-of'],
        default: '24h-before'
    },
    scheduledFor: {
        type: Date,
        required: true,
        index: true
    },
    sentAt: Date,
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending',
        index: true
    },
    method: {
        type: String,
        enum: ['email', 'sms'],
        default: 'email'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
