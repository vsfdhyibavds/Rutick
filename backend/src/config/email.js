const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendEmail = async (to, subject, html, attachments = []) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to,
            subject,
            html,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent: ${info.response}`);
        return info;
    } catch (error) {
        console.error(`❌ Email send failed: ${error.message}`);
        throw error;
    }
};

module.exports = { transporter, sendEmail };
