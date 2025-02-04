# Stage 1: Build the Angular application
FROM node:22-alpine AS builder

WORKDIR /app

COPY src/frontend/package*.json ./
RUN npm install

COPY src/frontend ./
RUN npm run build --prod

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/url-shortener /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]