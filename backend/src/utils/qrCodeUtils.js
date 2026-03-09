const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs').promises;

const generateQRCode = async (data) => {
    try {
        const qrCode = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            width: parseInt(process.env.QR_CODE_SIZE) || 300
        });
        return qrCode;
    } catch (error) {
        throw new Error(`Failed to generate QR code: ${error.message}`);
    }
};

const generateQRCodeFile = async (data, filename) => {
    try {
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        const qrCodePath = path.join(uploadDir, 'qrcodes');

        // Ensure directory exists
        await fs.mkdir(qrCodePath, { recursive: true });

        const filePath = path.join(qrCodePath, `${filename}.png`);
        await QRCode.toFile(filePath, data, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            width: parseInt(process.env.QR_CODE_SIZE) || 300
        });

        return filePath;
    } catch (error) {
        throw new Error(`Failed to generate QR code file: ${error.message}`);
    }
};

module.exports = { generateQRCode, generateQRCodeFile };
