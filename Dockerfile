# Stage 1: Build the Angular application
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY src/frontend/package*.json ./
RUN npm install
COPY src/frontend/ ./
RUN npm run build

# Stage 2: Build the final image with both backend and frontend
FROM python:3.9-slim

# Install nginx and supervisor
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*

# Copy the built Angular app into nginx’s html directory
COPY --from=frontend-builder /app/dist/url-shortener/browser /usr/share/nginx/html
# Use the custom nginx configuration (ensure it is compatible with Debian/nginx installed via apt)
RUN rm /etc/nginx/sites-enabled/default
COPY src/frontend/nginx/default.conf /etc/nginx/conf.d/default.conf

# Setup backend
WORKDIR /app
COPY src/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/backend .

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports for nginx and uvicorn
EXPOSE 80

CMD ["/usr/bin/supervisord", "-n"]