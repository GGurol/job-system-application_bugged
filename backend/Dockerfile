# backend/Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy only package files initially
COPY package*.json ./

# The rest of the code will be mounted by the volume
EXPOSE 3000