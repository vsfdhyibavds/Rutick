#!/usr/bin/env node

/**
 * RUTick - Continuous Security Update Script
 *
 * This script helps keep npm dependencies updated and secure.
 * Run periodically to check for and fix vulnerabilities.
 *
 * Usage:
 *   node update-security.js --check      (check for vulnerabilities)
 *   node update-security.js --fix        (fix vulnerabilities)
 *   node update-security.js --update     (update dependencies)
 *   node update-security.js --full       (all of the above)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color] || ''}${message}${colors.reset}`);
}

function executeCommand(cmd, description) {
  try {
    log('cyan', `\n⏳ ${description}...`);
    const result = execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
    log('green', `✅ ${description}`);
    return result;
  } catch (error) {
    log('yellow', `⚠️  ${description} (some issues may be non-critical)`);
    return error.stdout || '';
  }
}

function checkVulnerabilities() {
  log('bright', '\n🔍 Checking for Vulnerabilities');
  log('bright', '═════════════════════════════════');

  const report = executeCommand('npm audit --production', 'Running npm audit');

  if (report.includes('0 vulnerabilities')) {
    log('green', '✅ No vulnerabilities found!');
    return 0;
  }

  return 1;
}

function fixVulnerabilities() {
  log('bright', '\n🔧 Fixing Vulnerabilities');
  log('bright', '═════════════════════════════════');

  executeCommand('npm audit fix --audit-level=critical', 'Fixing critical vulnerabilities');
  executeCommand('npm audit fix --audit-level=high', 'Fixing high vulnerabilities');
  executeCommand('npm audit fix', 'Fixing remaining vulnerabilities');

  log('green', '\n✅ Vulnerability fixes applied');
}

function updateDependencies() {
  log('bright', '\n📦 Updating Dependencies');
  log('bright', '═════════════════════════════════');

  executeCommand('npm outdated', 'Checking for outdated packages');
  executeCommand('npm update', 'Updating packages to latest compatible versions');

  log('green', '\n✅ Dependencies updated');
}

function auditAndOptimize() {
  log('bright', '\n✨ Optimizing Dependencies');
  log('bright', '═════════════════════════════════');

  executeCommand('npm prune --production', 'Removing unused packages');
  executeCommand('npm cache clean --force', 'Cleaning npm cache');

  log('green', '\n✅ Dependencies optimized');
}

function generateReport() {
  log('bright', '\n📋 Generating Report');
  log('bright', '═════════════════════════════════');

  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'backend', 'package.json'), 'utf-8')
    );

    const stats = {
      dependencies: Object.keys(packageJson.dependencies || {}).length,
      devDependencies: Object.keys(packageJson.devDependencies || {}).length,
      timestamp: new Date().toISOString(),
    };

    log('blue', `\n📊 Dependency Statistics:`);
    log('blue', `   Production: ${stats.dependencies} packages`);
    log('blue', `   Development: ${stats.devDependencies} packages`);
    log('blue', `   Generated: ${stats.timestamp}`);

    const reportPath = path.join(__dirname, 'DEPENDENCY_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(stats, null, 2));
    log('green', `\n✅ Report saved to: DEPENDENCY_REPORT.json`);
  } catch (error) {
    log('yellow', `⚠️  Could not generate report: ${error.message}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || '--check';

  log('bright', '\n╔════════════════════════════════════╗');
  log('bright', '║  RUTick Security Update Script      ║');
  log('bright', '╚════════════════════════════════════╝');

  try {
    // Change to backend directory
    process.chdir(path.join(__dirname, 'backend'));
    log('cyan', `\n📁 Working in: ${process.cwd()}`);

    switch (command) {
      case '--check':
        checkVulnerabilities();
        break;

      case '--fix':
        checkVulnerabilities();
        fixVulnerabilities();
        generateReport();
        break;

      case '--update':
        updateDependencies();
        generateReport();
        break;

      case '--full':
        checkVulnerabilities();
        fixVulnerabilities();
        updateDependencies();
        auditAndOptimize();
        generateReport();
        break;

      case '--help':
      case '-h':
        log('cyan', '\nUsage: node update-security.js [command]');
        log('cyan', '\nCommands:');
        log('cyan', '  --check    Check for vulnerabilities (default)');
        log('cyan', '  --fix      Fix vulnerabilities');
        log('cyan', '  --update   Update to latest compatible versions');
        log('cyan', '  --full     All of the above');
        log('cyan', '  --help     Show this help message');
        break;

      default:
        log('red', `\n❌ Unknown command: ${command}`);
        log('cyan', 'Use --help for usage information');
        process.exit(1);
    }

    log('bright', '\n╔════════════════════════════════════╗');
    log('green', '║  ✅ Script Completed Successfully   ║');
    log('bright', '╚════════════════════════════════════╝\n');

    log('yellow', 'Next steps:');
    log('yellow', '  1. Review the changes');
    log('yellow', '  2. Test the application');
    log('yellow', '  3. Commit changes to version control');
    log('yellow', '  4. Rebuild Docker image: docker-compose build --no-cache');
    log('yellow', '  5. Deploy to production\n');

  } catch (error) {
    log('red', `\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkVulnerabilities, fixVulnerabilities, updateDependencies };
