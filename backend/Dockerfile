# Multi-stage build - Slim Debian (better CVE management than Alpine)
FROM node:22-slim as builder

WORKDIR /build

# Update system packages to latest patches
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        tini && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/* /tmp/* /var/tmp/*

# Copy package files
COPY backend/package*.json ./

# Install and audit dependencies - more aggressive fixes
RUN npm install -g npm@latest && \
    npm ci --only=production --prefer-offline --verbose && \
    npm audit fix --force --audit-level=critical 2>/dev/null || true && \
    npm audit fix --force --audit-level=high 2>/dev/null || true && \
    npm audit fix --force 2>/dev/null || true && \
    npm cache clean --force && \
    npm prune --production

# Remove unnecessary files to reduce attack surface
RUN find node_modules -type f \( -name "*.md" -o -name "*.txt" -o -name "LICENSE" -o -name "*.map" -o -name "*.ts" \) -delete && \
    find node_modules -type d \( -name "test" -o -name "tests" -o -name ".git" -o -name "docs" -o -name "examples" -o -name "build" -o -name "dist" \) -exec rm -rf {} + 2>/dev/null || true && \
    find . -name ".eslint*" -o -name ".prettier*" -o -name "tsconfig.json" -o -name "jest.config*" -delete

# ============================================
# FINAL STAGE - Minimal Slim Debian
# ============================================
FROM node:22-slim

# Install only tini for signal handling (minimal footprint)
RUN apt-get update && \
    apt-get install -y --no-install-recommends tini ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/* /tmp/* /var/tmp/*

WORKDIR /app

# Create non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy from builder
COPY --from=builder --chown=appuser:appgroup /build/node_modules ./node_modules
COPY --chown=appuser:appgroup backend/package*.json ./
COPY --chown=appuser:appgroup backend/src ./src

# Set strict permissions
RUN chmod -R 555 ./node_modules && \
    chmod -R u+rwX ./src && \
    find ./src -type d -exec chmod 755 {} \; && \
    find ./src -type f -exec chmod 644 {} \;

EXPOSE 5000

ENV NODE_ENV=production \
    NODE_OPTIONS="--no-deprecation --no-warnings --max-old-space-size=256" \
    NPM_CONFIG_LOGLEVEL=error

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "src/server.js"]


