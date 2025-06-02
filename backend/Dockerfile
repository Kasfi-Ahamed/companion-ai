# backend/Dockerfile
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Make wait-for script executable
RUN chmod +x wait-for-mongo.sh

# Expose backend port
EXPOSE 5000

# Start server
CMD ["./wait-for-mongo.sh", "mongo", "node", "server.js"]
