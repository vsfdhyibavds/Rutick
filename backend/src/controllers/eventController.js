const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');
const { generateTicketId } = require('../utils/tokenUtils');
const { generateQRCode } = require('../utils/qrCodeUtils');
const { sendEventRegistrationEmail } = require('../utils/emailTemplates');

// Get all events
exports.getAllEvents = async (req, res, next) => {
    try {
        const { category, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        let query = { isDeleted: false };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const events = await Event.find(query)
            .populate('organizer', 'firstName lastName email')
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .select('-attendees -registrants');

        const total = await Event.countDocuments(query);

        // If user is logged in, add registration status
        if (req.user) {
            for (let event of events) {
                const registration = await Registration.findOne({
                    user: req.user.id,
                    event: event._id
                });
                event._doc.isRegistered = !!registration;
            }
        }

        res.json({
            success: true,
            count: events.length,
            total,
            pages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            events
        });
    } catch (error) {
        next(error);
    }
};

// Get single event
exports.getEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id)
            .populate('organizer', 'firstName lastName email department')
            .populate({
                path: 'registrants',
                select: 'firstName lastName email'
            });

        if (!event || event.isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Get reviews
        const Review = require('../models/Review');
        const reviews = await Review.find({ event: id })
            .populate('user', 'firstName lastName avatar')
            .sort('-createdAt');

        let isRegistered = false;
        if (req.user) {
            const registration = await Registration.findOne({
                user: req.user.id,
                event: id
            });
            isRegistered = !!registration;
        }

        res.json({
            success: true,
            event: {
                ...event.toObject(),
                isRegistered,
                reviews
            }
        });
    } catch (error) {
        next(error);
    }
};

// Create event (staff/admin only)
exports.createEvent = async (req, res, next) => {
    try {
        const { title, description, category, date, time, duration, location, capacity, tags } = req.body;

        // Validation
        if (!title || !description || !category || !date || !time || !location || !capacity) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const eventDate = new Date(`${date}T${time}`);
        if (eventDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Event date cannot be in the past'
            });
        }

        const event = await Event.create({
            title,
            description,
            category,
            date: eventDate,
            time,
            duration,
            location,
            capacity,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            organizer: req.user.id
        });

        const populatedEvent = await event.populate('organizer', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: populatedEvent
        });
    } catch (error) {
        next(error);
    }
};

// Update event
exports.updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, category, date, time, location, capacity, tags } = req.body;

        let event = await Event.findById(id);

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
                message: 'Not authorized to update this event'
            });
        }

        if (title) event.title = title;
        if (description) event.description = description;
        if (category) event.category = category;
        if (date && time) {
            const eventDate = new Date(`${date}T${time}`);
            if (eventDate < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Event date cannot be in the past'
                });
            }
            event.date = eventDate;
            event.time = time;
        }
        if (location) event.location = location;
        if (capacity) event.capacity = capacity;
        if (tags) event.tags = tags.split(',').map(t => t.trim());

        event.updatedAt = new Date();
        await event.save();

        res.json({
            success: true,
            message: 'Event updated successfully',
            event
        });
    } catch (error) {
        next(error);
    }
};

// Delete event
exports.deleteEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);

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
                message: 'Not authorized to delete this event'
            });
        }

        event.isDeleted = true;
        event.deletedAt = new Date();
        await event.save();

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get user's registered events
exports.getMyEvents = async (req, res, next) => {
    try {
        const registrations = await Registration.find({ user: req.user.id })
            .populate({
                path: 'event',
                select: '-attendees -registrants'
            })
            .sort('-registeredAt');

        const events = registrations.map(reg => ({
            ...reg.event.toObject(),
            registrationStatus: reg.status,
            ticketId: reg.ticketId,
            registeredAt: reg.registeredAt
        }));

        res.json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        next(error);
    }
};
