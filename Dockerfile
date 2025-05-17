# -------- STAGE 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only what is needed to install dependencies
COPY package*.json ./

# Install all dependencies (including dev) to build the app
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js application
RUN npm run build

# -------- STAGE 2: Production --------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the necessary files for production
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --ignore-scripts --no-audit --no-fund

# Copy the Next.js build output from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set the environment variable
ENV NODE_ENV=production

# Start the Next.js application in production mode
CMD ["npm", "start"]
