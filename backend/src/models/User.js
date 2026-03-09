const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        match: [/^[\w-\.]+@riarauniversity\.ac\.ke$/, 'Please use university email'],
        index: true
    },
    studentId: {
        type: String,
        required: [true, 'Please provide student/staff ID'],
        unique: true,
        uppercase: true
    },
    department: {
        type: String,
        enum: ['Computer Science', 'Business', 'Engineering', 'Arts', 'Sciences', 'Other'],
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'staff', 'admin'],
        default: 'student'
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8,
        select: false
    },
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 500
    },
    phone: {
        type: String,
        match: [/^\+?[\d\s\-\(\)]{10,}$/, 'Please provide valid phone number']
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date,
    lastLogin: Date,
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
    const resetToken = require('crypto').randomBytes(20).toString('hex');
    this.emailVerificationToken = require('crypto')
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return resetToken;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
    const resetToken = require('crypto').randomBytes(20).toString('hex');
    this.passwordResetToken = require('crypto')
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
