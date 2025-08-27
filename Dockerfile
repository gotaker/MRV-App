# ======= Build stage =======
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build production bundle (ensure "build" script exists in package.json)
RUN npx ng build --configuration production

# ======= Runtime stage =======
FROM nginx:alpine
# Nginx conf with Angular SPA fallback and proxy to mock API
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy build output
COPY --from=build /app/dist/mrv-angular20/ /usr/share/nginx/html/
# Nginx listens on 80
EXPOSE 80
# Start Nginx server