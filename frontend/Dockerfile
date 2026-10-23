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

# Build arguments for Vite environment variables
ARG VITE_API_URL=http://localhost:8080
ARG VITE_CLOUD_NAME=dutqt18yd
ARG VITE_UPLOAD_PRESET=listing
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLOUD_NAME=$VITE_CLOUD_NAME
ENV VITE_UPLOAD_PRESET=$VITE_UPLOAD_PRESET

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
