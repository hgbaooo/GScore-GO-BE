# Use the official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install --production # Install only production dependencies

# Copy the rest of the application code
COPY . .

# Build the NestJS application for production
RUN npm run build

# Expose the port your app runs on
EXPOSE 3100

# Define the command to run your application
CMD [ "npm", "run", "start:prod" ]