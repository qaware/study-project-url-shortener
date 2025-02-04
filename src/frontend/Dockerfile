# Stage 1: Build the Angular application
FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Replace <project-name> with the actual output folder name (e.g., "frontend")
COPY --from=builder /app/dist/<project-name> /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]