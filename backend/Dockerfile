FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x wait-for-mongo.sh

EXPOSE 5000
CMD ["sh", "-c", "./wait-for-mongo.sh && node server.js"]
