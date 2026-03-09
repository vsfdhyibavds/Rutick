/**
 * RUTick - Database Seeding Script
 * Creates sample users and events for testing
 *
 * Usage: npm run seed
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Event = require('../models/Event');
const connectDB = require('../config/database');

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Event.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Create sample users
        const users = await User.create([
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@riarauniversity.ac.ke',
                studentId: 'RU2024001',
                department: 'Computer Science',
                password: 'Password@123',
                role: 'student'
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@riarauniversity.ac.ke',
                studentId: 'RU2024002',
                department: 'Business',
                password: 'Password@123',
                role: 'student'
            },
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@riarauniversity.ac.ke',
                studentId: 'ADMIN001',
                department: 'Administration',
                password: 'Admin@123',
                role: 'admin'
            },
            {
                firstName: 'Staff',
                lastName: 'Member',
                email: 'staff@riarauniversity.ac.ke',
                studentId: 'STAFF001',
                department: 'Student Affairs',
                password: 'Staff@123',
                role: 'staff'
            }
        ]);

        console.log(`✅ Created ${users.length} sample users`);

        // Create sample events
        const events = await Event.create([
            {
                title: 'Computer Science Symposium 2024',
                description: 'Annual symposium featuring latest research in AI, Machine Learning, and Data Science.',
                category: 'academic',
                date: new Date('2024-11-15'),
                time: '09:00',
                location: 'Main Auditorium',
                capacity: 200,
                organizer: users[2]._id,
                tags: ['cs', 'research', 'tech']
            },
            {
                title: 'Campus Cultural Festival',
                description: 'Celebrate diversity with music, dance, food, and cultural performances.',
                category: 'social',
                date: new Date('2024-11-20'),
                time: '14:00',
                location: 'University Grounds',
                capacity: 500,
                organizer: users[3]._id,
                tags: ['culture', 'festival', 'celebration']
            },
            {
                title: 'Career Fair 2024',
                description: 'Meet top employers and explore career opportunities across various industries.',
                category: 'academic',
                date: new Date('2024-11-25'),
                time: '10:00',
                location: 'Sports Complex',
                capacity: 300,
                organizer: users[3]._id,
                tags: ['career', 'jobs', 'internship']
            }
        ]);

        console.log(`✅ Created ${events.length} sample events`);

        console.log(`
╔════════════════════════════════════════╗
║   ✅ Database Seeding Complete!         ║
╚════════════════════════════════════════╝

Test Credentials:

STUDENT:
  Email: john.doe@riarauniversity.ac.ke
  Password: Password@123

STAFF:
  Email: staff@riarauniversity.ac.ke
  Password: Staff@123

ADMIN:
  Email: admin@riarauniversity.ac.ke
  Password: Admin@123
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();

