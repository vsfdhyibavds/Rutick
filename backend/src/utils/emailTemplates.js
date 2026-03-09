const { sendEmail } = require('../config/email');

const sendWelcomeEmail = async (user) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
                .content { padding: 20px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 20px; }
                .footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to RUTick! 🎓</h1>
                </div>
                <div class="content">
                    <p>Hi ${user.firstName} ${user.lastName},</p>
                    <p>Welcome to <strong>RUTick</strong>, Riara University's comprehensive event management platform!</p>
                    <p>Your account has been successfully created. You can now start exploring and registering for exciting campus events.</p>
                    <h3>What you can do:</h3>
                    <ul>
                        <li>Browse and discover campus events</li>
                        <li>Register for events with one click</li>
                        <li>Get automatic reminders before events</li>
                        <li>View event details, photos, and reviews</li>
                        <li>Earn certificates for completed events</li>
                    </ul>
                    <a href="${process.env.FRONTEND_URL}/login" class="button">Get Started →</a>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The RUTick Team</p>
                    <p>Riara University Event Management System</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(user.email, 'Welcome to RUTick!', html);
};

const sendEventRegistrationEmail = async (user, event) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
                .event-details { background: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
                .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Registration Confirmed! ✅</h1>
                </div>
                <div class="content">
                    <p>Hi ${user.firstName},</p>
                    <p>Your registration for the following event has been confirmed:</p>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <p><strong>📅 Date:</strong> ${event.date}</p>
                        <p><strong>⏰ Time:</strong> ${event.time}</p>
                        <p><strong>📍 Location:</strong> ${event.location}</p>
                        <p><strong>👥 Category:</strong> ${event.category}</p>
                    </div>
                    <p>Your ticket is ready! You'll receive a reminder before the event.</p>
                    <a href="${process.env.FRONTEND_URL}/events/${event._id}" class="button">View Ticket →</a>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(user.email, `Registration Confirmed: ${event.title}`, html);
};

const sendEventReminderEmail = async (user, event, remindingBefore) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #ff9800; color: white; padding: 20px; border-radius: 5px; }
                .event-details { background: #f9f9f9; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Event Reminder ⏰</h1>
                </div>
                <div class="content">
                    <p>Hi ${user.firstName},</p>
                    <p>This is a gentle reminder that your event is coming up ${remindingBefore}!</p>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <p><strong>📅 Date:</strong> ${event.date}</p>
                        <p><strong>⏰ Time:</strong> ${event.time}</p>
                        <p><strong>📍 Location:</strong> ${event.location}</p>
                    </div>
                    <p>Don't forget to bring your ticket!</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(user.email, `Reminder: ${event.title}`, html);
};

const sendCertificateEmail = async (user, event, certificateUrl) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4caf50; color: white; padding: 20px; border-radius: 5px; }
                .button { display: inline-block; background: #4caf50; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Certificate Earned! 🏆</h1>
                </div>
                <div class="content">
                    <p>Congratulations ${user.firstName}!</p>
                    <p>You have successfully attended <strong>${event.title}</strong> and earned a certificate of participation.</p>
                    <p>Your certificate is ready to download and share!</p>
                    <a href="${certificateUrl}" class="button">Download Certificate →</a>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(user.email, `Certificate Earned: ${event.title}`, html);
};

module.exports = {
    sendWelcomeEmail,
    sendEventRegistrationEmail,
    sendEventReminderEmail,
    sendCertificateEmail
};
