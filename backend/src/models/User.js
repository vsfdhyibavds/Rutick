const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        lowercase: true,
        validate: {
            isEmail: true,
            is: /^[\w-\.]+@riarauniversity\.ac\.ke$/,
        }
    },
    studentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    department: {
        type: DataTypes.ENUM('Computer Science', 'Business', 'Engineering', 'Arts', 'Sciences', 'Other'),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('student', 'staff', 'admin'),
        defaultValue: 'student',
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 255],
        }
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    bio: {
        type: DataTypes.STRING(500),
    },
    phone: {
        type: DataTypes.STRING,
        validate: {
            is: /^\+?[\d\s\-\(\)]{10,}$/,
        }
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    emailVerificationToken: DataTypes.STRING,
    emailVerificationExpires: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    lastLogin: DataTypes.DATE,
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: true,
    tableName: 'users',
});

// Hash password before saving
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Method to compare passwords
User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification token
User.prototype.generateEmailVerificationToken = function() {
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.emailVerificationToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    return resetToken;
};

module.exports = User;
