FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

# ✅ This is the key fix – copy everything including tests
COPY . .

CMD ["npm", "start"]
