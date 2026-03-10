const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Registration = sequelize.define('Registration', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    eventId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    ticketId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    qrCode: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    status: {
        type: DataTypes.ENUM('registered', 'checked-in', 'cancelled'),
        defaultValue: 'registered',
    },
    checkedInAt: DataTypes.DATE,
    checkedInById: DataTypes.UUID,
    notes: DataTypes.TEXT,
    cancelledAt: DataTypes.DATE,
    cancelledReason: DataTypes.TEXT,
}, {
    timestamps: true,
    tableName: 'registrations',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'eventId']
        }
    ]
});

module.exports = Registration;
