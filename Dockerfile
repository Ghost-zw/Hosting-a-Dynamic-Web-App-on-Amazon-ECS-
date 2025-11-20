# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Set environment variables for DB connection
# These can be overridden at runtime using `docker run -e` or Docker Compose
ENV DB_HOST=Host
ENV DB_PORT=port
ENV DB_USER=admin
ENV DB_PASSWORD=Password
ENV DB_NAME=DB

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]


