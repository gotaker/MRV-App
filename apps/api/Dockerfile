# API Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

# Tools needed by healthchecks and dev
RUN apk add --no-cache curl

COPY package.json tsconfig.json ./
RUN npm i -g @nestjs/cli && npm install

COPY src ./src

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
