FROM node:18

WORKDIR /coffee-app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE $APP_PORT
