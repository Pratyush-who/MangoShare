FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the typescript code
RUN npm run build

# Expose port 4000 to the host
EXPOSE 4000

# Start the socket server
CMD ["npm", "start"]
