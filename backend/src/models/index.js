/**
 * Model Associations/Relationships
 * Sets up all foreign key relationships between models
 */

const User = require('./User');
const Event = require('./Event');
const Registration = require('./Registration');
const Review = require('./Review');
const Certificate = require('./Certificate');
const Reminder = require('./Reminder');

// User -> Event (One-to-Many: A user can organize many events)
Event.belongsTo(User, {
    foreignKey: 'organizerId',
    as: 'organizer'
});
User.hasMany(Event, {
    foreignKey: 'organizerId',
    as: 'organizedEvents'
});

// User -> Registration (One-to-Many: A user can register for many events)
Registration.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});
User.hasMany(Registration, {
    foreignKey: 'userId',
    as: 'registrations'
});

// Event -> Registration (One-to-Many: An event can have many registrations)
Registration.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event'
});
Event.hasMany(Registration, {
    foreignKey: 'eventId',
    as: 'registrations'
});

// User -> Review (One-to-Many: A user can write many reviews)
Review.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});
User.hasMany(Review, {
    foreignKey: 'userId',
    as: 'reviews'
});

// Event -> Review (One-to-Many: An event can have many reviews)
Review.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event'
});
Event.hasMany(Review, {
    foreignKey: 'eventId',
    as: 'reviews'
});

// User -> Certificate (One-to-Many: A user can have many certificates)
Certificate.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});
User.hasMany(Certificate, {
    foreignKey: 'userId',
    as: 'certificates'
});

// Event -> Certificate (One-to-Many: An event can issue many certificates)
Certificate.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event'
});
Event.hasMany(Certificate, {
    foreignKey: 'eventId',
    as: 'certificates'
});

// User -> Reminder (One-to-Many: A user can have many reminders)
Reminder.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});
User.hasMany(Reminder, {
    foreignKey: 'userId',
    as: 'reminders'
});

// Event -> Reminder (One-to-Many: An event can have many reminders)
Reminder.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event'
});
Event.hasMany(Reminder, {
    foreignKey: 'eventId',
    as: 'reminders'
});

// Registration -> StaffMember (User checking in)
Registration.belongsTo(User, {
    foreignKey: 'checkedInById',
    as: 'checkedInBy'
});

module.exports = {
    User,
    Event,
    Registration,
    Review,
    Certificate,
    Reminder
};
