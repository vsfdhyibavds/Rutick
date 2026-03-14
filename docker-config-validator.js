#!/usr/bin/env node

/**
 * Docker & PostgreSQL Configuration Validator
 * Checks for common configuration issues before deployment
 *
 * Usage: node docker-config-validator.js
 */

const fs = require('fs');
const path = require('path');

const results = {
    passed: [],
    warnings: [],
    errors: []
};

console.log('🔍 Docker & PostgreSQL Configuration Validator\n');

// Check 1: docker-compose.yml exists
console.log('Checking docker-compose.yml...');
try {
    const dockerCompose = fs.readFileSync('docker-compose.yml', 'utf8');

    // Check for postgres service
    if (dockerCompose.includes('postgres:')) {
        results.passed.push('✅ PostgreSQL service defined');
    } else {
        results.errors.push('❌ PostgreSQL service not found in docker-compose.yml');
    }

    // Check depends_on for backend
    if (dockerCompose.includes('depends_on:') && dockerCompose.includes('postgres:')) {
        results.passed.push('✅ Backend depends_on uses postgres (not mongodb)');
    } else if (dockerCompose.includes('depends_on:') && dockerCompose.includes('mongodb:')) {
        results.errors.push('❌ Backend still depends on mongodb (should be postgres)');
    }

    // Check volumes
    if (dockerCompose.includes('postgres_data:')) {
        results.passed.push('✅ PostgreSQL volume configured');
    } else if (dockerCompose.includes('mongo_data:')) {
        results.errors.push('❌ Still using mongo_data volume (should be postgres_data)');
    } else {
        results.warnings.push('⚠️  No named volume found');
    }

    // Check networks
    if (dockerCompose.includes('rutick-network:')) {
        results.passed.push('✅ Custom network configured');
    } else {
        results.warnings.push('⚠️  No custom network defined');
    }

    // Check environment variables
    const requiredEnvVars = [
        'DB_HOST',
        'DB_PORT',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'JWT_SECRET',
        'RATE_LIMIT_WINDOW',
        'RATE_LIMIT_MAX'
    ];

    const missingEnvVars = requiredEnvVars.filter(v => !dockerCompose.includes(v));
    if (missingEnvVars.length === 0) {
        results.passed.push('✅ All required environment variables present');
    } else {
        results.warnings.push(`⚠️  Missing env vars: ${missingEnvVars.join(', ')}`);
    }

} catch (err) {
    results.errors.push(`❌ Cannot read docker-compose.yml: ${err.message}`);
}

// Check 2: Backend Dockerfile
console.log('Checking backend/Dockerfile...');
try {
    const dockerfile = fs.readFileSync('backend/Dockerfile', 'utf8');

    if (dockerfile.includes('FROM node:')) {
        results.passed.push('✅ Node.js base image found');
    } else {
        results.errors.push('❌ Valid Node.js base image not found');
    }

    if (dockerfile.includes('npm')) {
        results.passed.push('✅ NPM used for dependency management');
    } else {
        results.errors.push('❌ NPM not found in Dockerfile');
    }

    if (dockerfile.includes('USER') && !dockerfile.includes('USER root')) {
        results.passed.push('✅ Running as non-root user');
    } else {
        results.warnings.push('⚠️  May be running as root user');
    }

} catch (err) {
    results.errors.push(`❌ Cannot read backend/Dockerfile: ${err.message}`);
}

// Check 3: .env file
console.log('Checking backend/.env...');
try {
    const envFile = fs.readFileSync('backend/.env', 'utf8');

    if (envFile.includes('DB_HOST=postgres')) {
        results.passed.push('✅ .env configured for Docker (DB_HOST=postgres)');
    } else if (envFile.includes('DB_HOST=localhost')) {
        results.warnings.push('⚠️  .env configured for localhost (update for Docker: DB_HOST=postgres)');
    }

    if (envFile.includes('DB_USER=rutick_user')) {
        results.passed.push('✅ .env uses Docker database user');
    } else {
        results.warnings.push('⚠️  Database user may not match docker-compose.yml');
    }

} catch (err) {
    results.warnings.push(`⚠️  Cannot read backend/.env: ${err.message}`);
}

// Check 4: Database configuration file
console.log('Checking backend/src/config/database.js...');
try {
    const dbConfig = fs.readFileSync('backend/src/config/database.js', 'utf8');

    if (dbConfig.includes('sequelize') && dbConfig.includes('postgres')) {
        results.passed.push('✅ Using Sequelize with PostgreSQL');
    } else if (dbConfig.includes('mongoose') || dbConfig.includes('mongodb')) {
        results.errors.push('❌ Still configured for MongoDB (should use Sequelize+PostgreSQL)');
    } else {
        results.warnings.push('⚠️  Database configuration unclear');
    }

    if (dbConfig.includes('dialect: \'postgres\'')) {
        results.passed.push('✅ PostgreSQL dialect properly set');
    }

} catch (err) {
    results.errors.push(`❌ Cannot read database.js: ${err.message}`);
}

// Check 5: Package.json dependencies
console.log('Checking backend/package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    const deps = packageJson.dependencies || {};

    if (deps.sequelize && deps.pg) {
        results.passed.push('✅ Sequelize and PostgreSQL driver (pg) installed');
    } else {
        results.errors.push(`❌ Missing dependencies: ${!deps.sequelize ? 'sequelize' : ''} ${!deps.pg ? 'pg' : ''}`);
    }

    if (!deps.mongoose) {
        results.passed.push('✅ MongoDB driver (mongoose) correctly not present');
    } else {
        results.warnings.push('⚠️  mongoose still in dependencies (not needed for PostgreSQL)');
    }

} catch (err) {
    results.errors.push(`❌ Cannot read package.json: ${err.message}`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(50) + '\n');

console.log(`✅ Passed: ${results.passed.length}`);
results.passed.forEach(msg => console.log(`   ${msg}`));

if (results.warnings.length > 0) {
    console.log(`\n⚠️  Warnings: ${results.warnings.length}`);
    results.warnings.forEach(msg => console.log(`   ${msg}`));
}

if (results.errors.length > 0) {
    console.log(`\n❌ Errors: ${results.errors.length}`);
    results.errors.forEach(msg => console.log(`   ${msg}`));
}

console.log('\n' + '='.repeat(50));

if (results.errors.length === 0) {
    console.log('✅ CONFIGURATION VALIDATED - Ready for Docker deployment');
    process.exit(0);
} else {
    console.log('❌ ERRORS FOUND - Review above and fix before deployment');
    process.exit(1);
}
