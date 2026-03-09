const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendEventReminderEmail } = require('../utils/emailTemplates');

// Schedule reminders every minute
const scheduleReminders = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();

            // Find pending reminders that should be sent
            const reminders = await Reminder.find({
                status: 'pending',
                scheduledFor: { $lte: now }
            }).populate('user').populate('event');

            for (const reminder of reminders) {
                try {
                    await sendEventReminderEmail(
                        reminder.user,
                        reminder.event,
                        reminder.reminderType === '24h-before' ? 'in 24 hours' :
                        reminder.reminderType === '1h-before' ? 'in 1 hour' : 'today'
                    );

                    reminder.status = 'sent';
                    reminder.sentAt = new Date();
                    await reminder.save();
                } catch (error) {
                    console.error(`Failed to send reminder ${reminder._id}:`, error);
                    reminder.status = 'failed';
                    await reminder.save();
                }
            }
        } catch (error) {
            console.error('Error in reminder scheduler:', error);
        }
    });

    console.log('✅ Reminder scheduler initialized');
};

// Create reminders for registered users
const createRemindersForEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        if (!event) return;

        const registrations = await Registration.find({ event: eventId, status: 'registered' });

        const eventDate = new Date(event.date);

        for (const registration of registrations) {
            // 24 hours before
            const time24hBefore = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
            await Reminder.findOrCreate({
                user: registration.user,
                event: eventId,
                reminderType: '24h-before',
                scheduledFor: time24hBefore
            });

            // 1 hour before
            const time1hBefore = new Date(eventDate.getTime() - 60 * 60 * 1000);
            await Reminder.findOrCreate({
                user: registration.user,
                event: eventId,
                reminderType: '1h-before',
                scheduledFor: time1hBefore
            });
        }
    } catch (error) {
        console.error('Error creating reminders:', error);
    }
};

// Utility function to find or create
Reminder.findOrCreate = async function(filter) {
    let doc = await this.findOne(filter);
    if (!doc) {
        doc = await this.create({
            ...filter,
            status: 'pending'
        });
    }
    return doc;
};

module.exports = { scheduleReminders, createRemindersForEvent };
