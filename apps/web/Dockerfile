# Web Dockerfile (Angular 20 dev)
FROM node:20-alpine

WORKDIR /usr/src/app

# Install Angular CLI
RUN npm i -g @angular/cli@20.1.7

COPY package.json angular.json tsconfig.json tsconfig.app.json ./
RUN npm install

COPY src ./src

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
