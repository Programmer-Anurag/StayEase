# ==============================================================
# StayEase Backend - Production Multi-Stage Dockerfile
# ==============================================================

# --------------------------------------------------------------
# Stage 1: Dependencies (deps)
# Installs deterministic production dependencies using npm ci
# --------------------------------------------------------------
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install ONLY production dependencies and clean cache
RUN npm ci --omit=dev && npm cache clean --force

# --------------------------------------------------------------
# Stage 2: Production Runner
# Minimal runtime image running under a non-root user
# --------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Production environment defaults
ENV NODE_ENV=production
ENV PORT=8080

# Security: Ensure directory ownership for non-root user 'node' (uid: 1000)
RUN chown -R node:node /app

# Copy production dependencies from deps stage with non-root ownership
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

# Copy application source code with non-root ownership
COPY --chown=node:node . .

# Switch to non-root user for security compliance
USER node

# Expose application port
EXPOSE 8080

# Container Healthcheck (uses Node built-in fetch)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 8080) + '/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start the application in production mode
CMD ["node", "app.js"]
