# syntax=docker/dockerfile:1

FROM node:alpine
WORKDIR /grocery-backend
COPY package.json .
RUN npm install
COPY . .
CMD [ "npm", "run", "dev" ]