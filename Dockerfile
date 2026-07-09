# ── Stage 1: Install dependencies ────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# Install dependencies needed for native modules (sharp, etc.)
RUN apk add --no-cache libc6-compat python3 make g++

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ── Stage 2: Build the app ────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (avoids import errors)
RUN npx prisma generate || true

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=512

# Build Next.js standalone output
RUN npx next build

# Copy static assets into standalone folder
RUN cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/

# ── Stage 3: Production runner ────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8000
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build (includes public/)
COPY --from=builder /app/.next/standalone ./

# Copy data directory (JSON file storage — writable at runtime)
COPY --from=builder /app/data ./data

# Create uploads directory and set ownership
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 8000

CMD ["node", "server.js"]
