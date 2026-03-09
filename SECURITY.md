# RUTick Security Policy & Hardening Guide

## 🔒 Security Measures Implemented

### 1. Base Image Hardening

- **Node.js Version**: `node:22-alpine` (latest stable, automatically updated for security patches)
- **Alpine Linux**: Latest version with all system packages upgraded
- **Multi-stage Build**: Reduces final image size and minimizes attack surface
- **Image Pruning**: Removes unnecessary files (documentation, Git history, test files)

### 2. Dependency Security

- **npm Audit**: Runs `npm audit fix` at build time to patch all fixable vulnerabilities
- **Production Only**: Installs `--only=production` dependencies, excludes dev tools
- **Package Locking**: Uses `package-lock.json` for reproducible builds
- **Force Fixes**: Applies `--force` flag to fix even transitive dependencies

### 3. Runtime Security

- **Non-root User**: Application runs as `nodejs:1001` (non-root)
- **Read-only Filesystem**: Container filesystem is read-only except `/tmp`, `/var/tmp`
- **Capability Dropping**: Drops all Linux capabilities, adds only `NET_BIND_SERVICE`
- **Signal Handling**: Uses `dumb-init` to properly handle signals and prevent zombies
- **No Privilege Escalation**: `security_opt: no-new-privileges:true` in all containers

### 4. Network Security

- **CORS Configuration**: Restricted to configured frontend origin only
- **Rate Limiting**: Applied to API endpoints to prevent brute-force attacks
- **HTTPS Ready**: Supports SSL/TLS termination via reverse proxy
- **Private Network**: Docker network isolated from host bridges

### 5. Data Security

- **Password Hashing**: bcryptjs with salt rounds for all passwords
- **JWT Tokens**: Signed with strong secrets, proper expiration
- **Database Auth**: MongoDB authentication required with strong credentials
- **Encrypted Connection**: MongoDB connection uses authentication over network
- **Soft Deletes**: Sensitive data marked deleted, not permanently removed

### 6. Development Security

- **Environment File**: `.env` contains secrets, excluded from version control
- **No Secrets in Code**: All credentials externalized to environment
- **Validation**: Input validation on all API endpoints
- **Error Handling**: Centralized error handling with security context

---

## 📊 Known Vulnerabilities & Mitigation

### Current Status

The build process reports vulnerabilities in the npm package ecosystem. Here's why:

1. **Transitive Dependencies**: Some npm packages have dependencies that have known CVEs
2. **No Available Patches**: Not all CVEs have patches available from maintainers
3. **Maintenance Status**: Some package maintainers don't actively update packages
4. **Base Image**: Alpine Linux occasionally has CVEs that take time to patch

### What We're Doing About It

✅ **Automated Fixes**

```bash
npm audit fix --force --audit-level=critical
npm audit fix --audit-level=high
```

✅ **Regular Updates**

- Base image updated on every build
- System packages upgraded: `apk upgrade`
- npm updated to latest version

✅ **Minimal Dependencies**

- Only essential packages included
- Optional dependencies disabled
- Dev dependencies excluded from production

✅ **Sandboxing**

- Non-root user prevents privilege escalation
- Read-only filesystem limits damage from compromise
- Capability dropping removes dangerous permissions
- Resource limits prevent DoS

### Vulnerability Assessment

| Category     | Status    | Action                                |
| ------------ | --------- | ------------------------------------- |
| **Critical** | Monitored | Applied `npm audit fix --force`       |
| **High**     | Monitored | Applied `npm audit fix --force`       |
| **Medium**   | Accepted  | Assessed as low-risk with mitigations |
| **Low**      | Ignored   | No impact on security posture         |

### False Positives

Some reported vulnerabilities may be:

- **Transitive**: Exist in dependencies of dependencies
- **Unfixable**: Package maintainers haven't released patches
- **Low-risk**: Require specific conditions our architecture doesn't meet
- **Accepted**: Risk-benefit analysis favors usage

---

## 🛡️ Best Practices for Deployment

### Pre-Deployment Checklist

- [ ] Change all `.env` secrets (JWT_SECRET, REFRESH_TOKEN_SECRET, MONGO_PASSWORD)
- [ ] Use strong, unique passwords (minimum 32 characters)
- [ ] Enable HTTPS/SSL with valid certificates
- [ ] Configure firewall to restrict access
- [ ] Set up monitoring and alerting
- [ ] Enable database backups
- [ ] Review CORS configuration for production

### Production Configuration

```bash
# .env for production
NODE_ENV=production
JWT_SECRET=<strong-random-32+chars>
REFRESH_TOKEN_SECRET=<strong-random-32+chars>
MONGO_PASSWORD=<strong-random-32+chars>
CORS_ORIGIN=https://your-domain.com
FRONTEND_URL=https://your-domain.com
```

### Container Security

```yaml
# docker-compose.yml for production
security_opt:
  - no-new-privileges:true # Prevent privilege escalation
cap_drop:
  - ALL # Drop all capabilities
cap_add:
  - NET_BIND_SERVICE # Only add what's needed
read_only: true # Read-only filesystem
tmpfs: # Use in-memory for temporary files
  - /tmp
  - /var/tmp
```

### Network Security

```bash
# Use reverse proxy (Nginx/HAProxy)
# - Terminate HTTPS/TLS
# - Hide internal structure
# - Rate limit at edge
# - WAF (Web Application Firewall)

# Firewall rules
# - Only expose ports 80 (HTTP) and 443 (HTTPS)
# - Restrict database access to backend only
# - Restrict admin ports to trusted IPs
```

---

## 🔄 Update Strategy

### Automated Updates

The Docker image automatically:

1. Pulls latest node:22-alpine base image
2. Upgrades all Alpine system packages
3. Updates npm to latest version
4. Runs `npm audit fix` for dependencies
5. Cleans up unnecessary files

### Manual Vulnerability Management

```bash
# Check for vulnerabilities
npm audit

# Fix if possible
npm audit fix

# Force fix (use carefully)
npm audit fix --force

# Check baseline
npm list --depth=3

# Update specific package
npm update package-name
```

### Scheduled Maintenance

- **Weekly**: Review dependency updates
- **Monthly**: Test new base image versions
- **Quarterly**: Security audit and penetration testing
- **On-demand**: Critical vulnerability patch

---

## 🚨 Security Incident Response

### If a Vulnerability is Discovered

1. **Assess**: Determine impact and exploitability
2. **Isolate**: If critical, take affected service offline
3. **Patch**: Update vulnerable dependency
4. **Test**: Verify fix doesn't break functionality
5. **Deploy**: Update production ASAP
6. **Audit**: Review logs for any exploitation attempts

### Reporting Security Issues

**Do NOT** open public issues for security vulnerabilities.

Instead:

1. Email security details to your team lead
2. Include: vulnerability description, reproduction steps, impact
3. Allow time for patch before public disclosure
4. Follow responsible disclosure practices

---

## 📋 Compliance

This system follows:

- OWASP Top 10 guidelines
- Docker Security Best Practices
- Node.js Security Recommendations
- NIST Cybersecurity Framework

### Security Headers

API includes:

- `Strict-Transport-Security`: Enforces HTTPS
- `Content-Security-Policy`: Prevents XSS attacks
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: Browser XSS protection

---

## 🔧 Security Testing

### Local Testing

```bash
# Check npm vulnerabilities
npm audit

# Scan with Snyk
snyk test

# Docker image scan
docker scan rutick-backend

# Dependency check
npm list --depth=3
```

### Production Monitoring

- Set up error logging (Sentry, Rollbar)
- Monitor authentication attempts
- Track API response times
- Alert on unusual patterns
- Regular penetration testing

---

## 📚 Security Resources

- **OWASP**: https://owasp.org/
- **Node.js Security**: https://nodejs.org/en/docs/guides/security/
- **Docker Security**: https://docs.docker.com/engine/security/
- **npm Security**: https://docs.npmjs.com/cli/v10/commands/npm-audit
- **CVE Database**: https://www.cvedetails.com/

---

## ✅ Security Checklist

Before deployment:

**Application Level**

- [ ] All secrets are strong and unique
- [ ] JWT secrets are 32+ characters
- [ ] Database password is strong
- [ ] Input validation is active
- [ ] Error messages don't expose internals
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled

**Container Level**

- [ ] Running as non-root user
- [ ] No unnecessary capabilities
- [ ] Read-only filesystem enabled
- [ ] Resource limits configured
- [ ] Health checks working
- [ ] Security options set
- [ ] Logs are being captured

**Infrastructure Level**

- [ ] HTTPS/SSL enabled
- [ ] Firewall configured
- [ ] Database access restricted
- [ ] Backups happening
- [ ] Monitoring enabled
- [ ] Incident response plan ready
- [ ] Regular security updates scheduled

---

## 🎯 Security Roadmap

- [ ] Phase 1: Current hardening (completed)
- [ ] Phase 2: WAF integration (planned)
- [ ] Phase 3: API authentication improvements (planned)
- [ ] Phase 4: End-to-end encryption (planned)
- [ ] Phase 5: Advanced threat detection (planned)

---

**Last Updated**: February 2025
**Status**: Production Ready
**Next Review**: March 2025
