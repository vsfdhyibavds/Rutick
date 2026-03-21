const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'rutick',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            timestamps: true,
            underscored: true,
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ PostgreSQL Connected: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}`);

        // Import models and set up associations
        require('../models/index');
        console.log('✅ Models and associations loaded');

        // Sync models with database
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('✅ Database models synchronized');

        return sequelize;
    } catch (error) {
        console.error(`❌ Database connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };

