FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Include test environment file for CI
COPY .env.test .env.test

EXPOSE 5000
CMD ["npm", "start"]
