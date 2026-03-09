const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateJWT = (payload, expiresIn = process.env.JWT_EXPIRE) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

const verifyJWT = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const generateTicketId = (eventId, userId) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `RU-${eventId}-${userId}-${timestamp}-${random}`.toUpperCase();
};

const generateCertificateId = () => {
    return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
};

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    generateJWT,
    generateRefreshToken,
    verifyJWT,
    generateTicketId,
    generateCertificateId,
    hashToken,
    generateOTP
};
