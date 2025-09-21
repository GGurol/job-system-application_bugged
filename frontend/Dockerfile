# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only package files to leverage cache
COPY package*.json ./

# We will run 'npm install' in docker-compose command
# to ensure it runs in the context of the mounted volume.

COPY . .

EXPOSE 3000