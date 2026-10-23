# ==============================================================
# StayEase Frontend - Production Multi-Stage Dockerfile
# ==============================================================

# --------------------------------------------------------------
# Stage 1: Build the React Application
# --------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency specifications
COPY package.json package-lock.json* ./

# Install dependencies using clean install
RUN npm ci

# Copy client source code
COPY . .

# Build production bundle (Vite outputs to /app/dist)
RUN npm run build

# --------------------------------------------------------------
# Stage 2: Production Nginx Server
# --------------------------------------------------------------
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration with SPA fallback & gzip
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard web port
EXPOSE 80

# Healthcheck to ensure nginx is serving requests
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
