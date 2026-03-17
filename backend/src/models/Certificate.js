const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Certificate = sequelize.define('Certificate', {
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
    certificateId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issueDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    expiryDate: DataTypes.DATE,
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('issued', 'revoked'),
        defaultValue: 'issued',
    },
    notes: DataTypes.TEXT,
}, {
    timestamps: true,
    tableName: 'certificates',
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'event_id']
        }
    ],
    underscored: true
});

module.exports = Certificate;
