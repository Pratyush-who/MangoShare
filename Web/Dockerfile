FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Provide the backend URL for the build context
ARG NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL

# Build the Next.js application
RUN npm run build

# Expose the standard Next.js port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
