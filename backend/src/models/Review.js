const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
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
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
    title: {
        type: DataTypes.STRING(100),
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [10, 1000],
        }
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
    tableName: 'reviews',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'eventId']
        }
    ]
});

module.exports = Review;
