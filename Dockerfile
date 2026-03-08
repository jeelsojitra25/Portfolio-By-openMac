# ── Stage 1: Build client ──────────────────────────────────────────────
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# ── Stage 2: Server runner ─────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

# Install production server deps
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server/ ./server/

# Copy built client into public dir (served by nginx, not Express)
COPY --from=client-builder /app/client/dist ./client/dist

EXPOSE 3001
ENV NODE_ENV=production

CMD ["node", "server/server.js"]
