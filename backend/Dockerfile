FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies  (this triggers prisma generate if setup correctly, but we force it later to be sure)
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD [ "npm", "run", "start:prod" ]
