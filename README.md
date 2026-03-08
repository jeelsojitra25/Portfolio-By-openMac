# Qwen2.5 Portfolio

Full-stack portfolio site for Qwen2.5 — React 18 + Vite + Express + PostgreSQL + Redis.

## Prerequisites
- Node.js 18+
- Docker + Docker Compose
- A domain with DNS pointing to your server (for production)

## Local Development

```bash
# 1. Copy env
cp .env.example .env
# fill in DATABASE_URL, REDIS_URL, JWT keys

# 2. Install deps
cd server && npm install && cd ..
cd client && npm install && cd ..

# 3. Start services (postgres + redis)
docker-compose up postgres redis -d

# 4. Run migrations
psql $DATABASE_URL < server/db/schema.sql

# 5. Start server
cd server && npm run dev &

# 6. Start client
cd client && npm run dev
```

Open http://localhost:5173

## Production Deploy (Docker)

```bash
# 1. Build & start everything
docker-compose up --build -d

# 2. SSL via Certbot
certbot certonly --webroot -w /usr/share/nginx/html -d yourdomain.com

# 3. Reload nginx
docker-compose exec nginx nginx -s reload
```

## Cloudflare Setup
1. Add A record pointing to your server IP, proxy enabled (orange cloud)
2. SSL/TLS mode: Full (strict)
3. Cache Rule: `Cache Everything` for `/assets/*`
4. Firewall Rule: block requests with suspicious UA patterns

## Generate JWT Keys

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
# Paste contents (with \n newlines) into .env
```

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/benchmarks` | All benchmarks (LRU cached 5min) |
| GET | `/api/benchmarks?min=80&max=95` | Range query via binary search |
| GET | `/api/stats` | Model overview stats |
| GET | `/api/models` | All variant cards |
| GET | `/api/capabilities` | 6 capability cards |
| GET | `/api/architecture` | Topologically sorted DAG |
| GET | `/api/search?q=<query>` | Trie autocomplete |
| GET | `/api/health` | Status, cache hit rate, uptime |
| POST | `/api/contact` | Contact form |
| POST | `/api/auth/login` | Admin login → JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Revoke refresh token |
| PUT | `/api/admin/benchmarks/:id` | Update benchmark (JWT) |
