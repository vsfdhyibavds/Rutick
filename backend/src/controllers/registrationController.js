const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { generateTicketId } = require('../utils/tokenUtils');
const { generateQRCode } = require('../utils/qrCodeUtils');
const { sendEventRegistrationEmail } = require('../utils/emailTemplates');

// Register for event
exports.registerForEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event || event.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check capacity
        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Event is at full capacity'
            });
        }

        // Check if already registered
        const existing = await Registration.findOne({
            user: req.user.id,
            event: eventId
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Already registered for this event'
            });
        }

        // Create registration
        const ticketId = generateTicketId(eventId, req.user.id);
        const qrCode = await generateQRCode(ticketId);

        const registration = await Registration.create({
            user: req.user.id,
            event: eventId,
            ticketId,
            qrCode,
            status: 'registered'
        });

        // Update event
        event.registeredCount += 1;
        event.registrants.push(req.user.id);
        await event.save();

        // Send confirmation email
        const user = await User.findById(req.user.id);
        try {
            await sendEventRegistrationEmail(user, event);
        } catch (error) {
            console.error('Failed to send registration email:', error);
        }

        res.status(201).json({
            success: true,
            message: 'Registered for event successfully',
            registration: {
                id: registration._id,
                ticketId: registration.ticketId,
                qrCode: registration.qrCode,
                status: registration.status
            }
        });
    } catch (error) {
        next(error);
    }
};

// Cancel registration
exports.cancelRegistration = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { reason } = req.body;

        const registration = await Registration.findOne({
            user: req.user.id,
            event: eventId
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        registration.status = 'cancelled';
        registration.cancelledAt = new Date();
        registration.cancelledReason = reason;
        await registration.save();

        // Update event
        const event = await Event.findById(eventId);
        event.registeredCount -= 1;
        event.registrants = event.registrants.filter(id => id.toString() !== req.user.id);
        await event.save();

        res.json({
            success: true,
            message: 'Registration cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get registration
exports.getRegistration = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        const registration = await Registration.findOne({
            user: req.user.id,
            event: eventId
        }).populate('event', 'title date time location');

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.json({
            success: true,
            registration
        });
    } catch (error) {
        next(error);
    }
};

// Get all registrations for event (staff/admin only)
exports.getEventRegistrations = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const { page = 1, limit = 50, status } = req.query;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check authorization
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        let query = { event: eventId };
        if (status) query.status = status;

        const registrations = await Registration.find(query)
            .populate('user', 'firstName lastName email studentId')
            .skip(skip)
            .limit(limitNum)
            .sort('-registeredAt');

        const total = await Registration.countDocuments(query);

        res.json({
            success: true,
            count: registrations.length,
            total,
            registrations
        });
    } catch (error) {
        next(error);
    }
};

// Check in attendee
exports.checkInAttendee = async (req, res, next) => {
    try {
        const { registrationId } = req.params;

        const registration = await Registration.findById(registrationId);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        if (registration.status === 'checked-in') {
            return res.status(400).json({
                success: false,
                message: 'Already checked in'
            });
        }

        registration.status = 'checked-in';
        registration.checkedInAt = new Date();
        registration.checkedInBy = req.user.id;
        await registration.save();

        // Update event
        const event = await Event.findById(registration.event);
        event.attendedCount += 1;
        await event.save();

        res.json({
            success: true,
            message: 'Attendee checked in successfully'
        });
    } catch (error) {
        next(error);
    }
};
