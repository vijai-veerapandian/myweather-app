# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Set environment variable to resolve Webpack issue
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the React application
RUN npm run build

# Set the command to serve the build
CMD ["npm", "start"]

# Expose the port the app runs on
EXPOSE 3000