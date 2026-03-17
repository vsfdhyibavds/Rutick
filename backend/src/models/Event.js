const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1, 2000],
        }
    },
    category: {
        type: DataTypes.ENUM('academic', 'social', 'administrative', 'sports', 'cultural'),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        }
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 120, // minutes
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10000,
        }
    },
    registeredCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
        }
    },
    attendedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
        }
    },
    organizerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    banner: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5,
        }
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    status: {
        type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'upcoming',
    }
}, {
    timestamps: true,
    tableName: 'events',
});

module.exports = Event;
