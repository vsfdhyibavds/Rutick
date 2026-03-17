#!/usr/bin/env node

/**
 * JWT Secret Generator
 * Generates cryptographically secure secrets for JWT_SECRET and REFRESH_TOKEN_SECRET
 *
 * Usage: node setup-env-generator.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function generateOTP(length = 6) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
}

console.log(`\n${colors.bright}${colors.cyan}RUTick - Environment Setup Generator${colors.reset}\n`);

const jwtSecret = generateSecret(32);
const refreshSecret = generateSecret(32);
const dbPassword = generateSecret(16);

console.log(`${colors.green}✓ Generated Secrets${colors.reset}\n`);
console.log(`${colors.yellow}JWT_SECRET:${colors.reset}\n  ${jwtSecret}\n`);
console.log(`${colors.yellow}REFRESH_TOKEN_SECRET:${colors.reset}\n  ${refreshSecret}\n`);
console.log(`${colors.yellow}MONGO_PASSWORD:${colors.reset}\n  ${dbPassword}\n`);

// Try to update .env file
const envPath = path.join(__dirname, 'backend', '.env');
const envExamplePath = path.join(__dirname, 'backend', '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  try {
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET=${jwtSecret}`);
    envContent = envContent.replace(/REFRESH_TOKEN_SECRET=.*/, `REFRESH_TOKEN_SECRET=${refreshSecret}`);
    envContent = envContent.replace(/MONGO_PASSWORD=.*/, `MONGO_PASSWORD=${dbPassword}`);

    fs.writeFileSync(envPath, envContent);
    console.log(`${colors.green}✓ Created backend/.env with generated secrets${colors.reset}\n`);
    console.log(`${colors.blue}Next steps:${colors.reset}`);
    console.log(`  1. Edit backend/.env to configure:`);
    console.log(`     - MONGODB_URI`);
    console.log(`     - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD`);
    console.log(`     - FRONTEND_URL`);
    console.log(`  2. Run: cd backend && npm install`);
    console.log(`  3. Run: npm run dev\n`);
  } catch (error) {
    console.error(`${colors.yellow}⚠ Could not auto-update .env:${colors.reset} ${error.message}\n`);
    console.log(`${colors.blue}Manual update required:${colors.reset}`);
    console.log(`  1. Copy backend/.env.example to backend/.env`);
    console.log(`  2. Update with the secrets shown above\n`);
  }
} else {
  console.log(`${colors.blue}How to use these secrets:${colors.reset}\n`);
  console.log(`  1. Edit backend/.env`);
  console.log(`  2. Replace JWT_SECRET with the generated value`);
  console.log(`  3. Replace REFRESH_TOKEN_SECRET with the generated value`);
  console.log(`  4. Replace MONGO_PASSWORD with the generated value\n`);
}

console.log(`${colors.yellow}⚠ Security Notes:${colors.reset}`);
console.log(`  - Keep these secrets confidential`);
console.log(`  - Never commit .env files to version control`);
console.log(`  - Rotate secrets regularly in production`);
console.log(`  - Change MONGO_PASSWORD from this generated value\n`);

process.exit(0);
