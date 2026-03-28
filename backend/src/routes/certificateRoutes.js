const express = require('express');
const {
    generateCertificate,
    getUserCertificates,
    getCertificate,
    getEventCertificates,
    revokeCertificate
} = require('../controllers/certificateController');
const { authMiddleware } = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');

const router = express.Router();

// Protected routes
router.post('/events/:eventId/certificates', authMiddleware, generateCertificate);
router.get('/users/:userId/certificates', getUserCertificates);
router.get('/:certificateId', getCertificate);
router.get('/events/:eventId/certificates', authMiddleware, roleMiddleware(['staff', 'admin']), getEventCertificates);
router.delete('/:certificateId', authMiddleware, roleMiddleware(['staff', 'admin']), revokeCertificate);

module.exports = router;
