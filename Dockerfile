FROM node:18

WORKDIR /coffee-app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4444
CMD ["node", "index.js"]
