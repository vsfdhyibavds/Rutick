/**
 * PostgreSQL Connection Test Script
 * Tests connectivity to PostgreSQL using the same connection as the app
 *
 * Usage: npm run test:db
 */

const { sequelize } = require('../config/database');
require('dotenv').config();

const testConnection = async () => {
    try {
        console.log('\n🔍 PostgreSQL Connection Test');
        console.log('━'.repeat(50));
        console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}`);
        console.log(`📍 Port: ${process.env.DB_PORT || 5432}`);
        console.log(`📍 Database: ${process.env.DB_NAME || 'rutick'}`);
        console.log(`📍 User: ${process.env.DB_USER || 'postgres'}`);
        console.log('⏳ Connecting to PostgreSQL...\n');

        await sequelize.authenticate();

        console.log('✅ Connection Successful!');
        console.log('📊 PostgreSQL is ready for the application!');

        // Test query
        const result = await sequelize.query('SELECT NOW() as current_time');
        console.log(`\n🔔 Server Time: ${result[0][0].current_time}`);

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Connection Failed!');
        console.error(`\n🚨 Error: ${error.message}`);

        if (error.message.includes('connect ECONNREFUSED')) {
            console.error('\n💡 PostgreSQL is not running. Try one of these:');
            console.error('   1. Docker: docker-compose up -d postgres');
            console.error('   2. Local: Install PostgreSQL and start the service');
        }

        if (error.message.includes('password authentication failed')) {
            console.error('\n💡 Authentication failed. Check:');
            console.error('   • DB_USER and DB_PASSWORD in .env');
        }

        process.exit(1);
    }
};

testConnection();
