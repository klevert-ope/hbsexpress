# Stage 1: Build the application
FROM node:22-alpine3.19 AS builder

LABEL authors="klevert"

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Set NODE_ENV to production to install only production dependencies
ENV NODE_ENV=production

# Install only production dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Stage 2: Production image
FROM node:22-alpine3.19 AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder
COPY --from=builder /app .

# Set the environment variable to specify the NODE_ENV
ENV NODE_ENV=production

# Create a non-root user, change ownership, and switch to the non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
