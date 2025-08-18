FROM node:22-bookworm AS build
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci || npm install
COPY . .
RUN npm run build:prod

FROM nginx:1.27-alpine
COPY --from=build /app/dist/mrv /usr/share/nginx/html
COPY scripts/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1
