# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variable to resolve Webpack issue
ENV NODE_OPTIONS=--openssl-legacy-provider

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.mjs"]