const Certificate = require('../models/Certificate');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { generateCertificateId } = require('../utils/tokenUtils');
const { sendCertificateEmail } = require('../utils/emailTemplates');

// Generate certificate for attended event
exports.generateCertificate = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        // Check if user attended
        const registration = await Registration.findOne({
            where: { userId: req.user.id, eventId, status: 'checked-in' }
        });

        if (!registration) {
            return res.status(403).json({
                success: false,
                message: 'You must attend the event to receive a certificate'
            });
        }

        // Check if certificate already exists
        const existing = await Certificate.findOne({
            where: { userId: req.user.id, eventId }
        });

        if (existing) {
            return res.json({
                success: true,
                message: 'Certificate already issued',
                certificate: existing
            });
        }

        const event = await Event.findByPk(eventId);
        const user = await User.findByPk(req.user.id);

        const certificateId = generateCertificateId();

        // Generate certificate (simple placeholder for now - integrate with proper PDF generation later)
        const certificate = await Certificate.create({
            userId: req.user.id,
            eventId,
            certificateId,
            title: `Certificate of Participation - ${event.title}`,
            fileUrl: `/certificates/${certificateId}.pdf`, // Placeholder
            status: 'issued'
        });

        // Send certificate email
        try {
            await sendCertificateEmail(user, event, `${process.env.FRONTEND_URL}/certificates/${certificateId}`);
        } catch (error) {
            console.error('Failed to send certificate email:', error);
        }

        res.status(201).json({
            success: true,
            message: 'Certificate generated successfully',
            certificate
        });
    } catch (error) {
        next(error);
    }
};

// Get user certificates
exports.getUserCertificates = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const certificates = await Certificate.findAll({
            where: { userId, status: 'issued' },
            include: [{
                association: 'event',
                model: Event,
                attributes: ['id', 'title', 'date']
            }],
            order: [['issueDate', 'DESC']]
        });

        res.json({
            success: true,
            count: certificates.length,
            certificates
        });
    } catch (error) {
        next(error);
    }
};

// Get certificate
exports.getCertificate = async (req, res, next) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({
            where: { certificateId, status: 'issued' },
            include: [
                {
                    association: 'user',
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    association: 'event',
                    model: Event,
                    attributes: ['id', 'title', 'date', 'location']
                }
            ]
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        res.json({
            success: true,
            certificate
        });
    } catch (error) {
        next(error);
    }
};

// Get event certificates
exports.getEventCertificates = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check authorization
        if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const certificates = await Certificate.findAll({
            where: { eventId, status: 'issued' },
            include: [{
                association: 'user',
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email']
            }],
            order: [['issueDate', 'DESC']]
        });

        res.json({
            success: true,
            count: certificates.length,
            certificates
        });
    } catch (error) {
        next(error);
    }
};

// Revoke certificate
exports.revokeCertificate = async (req, res, next) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({
            where: { certificateId, status: 'issued' }
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        // Check authorization
        const event = await Event.findByPk(certificate.eventId);
        if (event.organizerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        certificate.status = 'revoked';
        await certificate.save();

        res.json({
            success: true,
            message: 'Certificate revoked successfully'
        });
    } catch (error) {
        next(error);
    }
};
