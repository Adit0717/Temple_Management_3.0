# Dockerfile

FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
# Use Node.js LTS base image
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining app files
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# Start the app
CMD ["npm", "start"]

