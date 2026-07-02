# CyberGate — VLESS over WebSocket Gateway

CyberGate is a production-ready, modern VLESS over WebSocket gateway with a premium cyberpunk SaaS dashboard. Built for Railway, Docker, and any Node.js environment.

![License: MIT](https://img.shields.io/badge/License-MIT-cyan)

> **Legal Notice:** CyberGate is a general-purpose secure proxy gateway intended for legitimate privacy, development, and enterprise use. You are responsible for complying with all local laws and terms of service in your jurisdiction.

---

## Features

### Gateway Core
- VLESS over WebSocket (TCP/UDP) - RFC compliant
- HTTP/HTTPS Reverse Proxy
- TLS termination / Railway auto-TLS
- Per-link traffic accounting
- Connection pooling & health checks
- GeoIP resolution

### Dashboard - Cyberpunk SaaS UI
- Glassmorphism + Neon Cyan/Purple theme
- Three.js particle field background
- Framer Motion animations
- Responsive, Linear / Vercel-inspired
- Real-time stats via WebSocket
- Dark-only cyberpunk design

### Auth & Security
- JWT Authentication (access + refresh)
- Bcrypt password hashing
- Role-based permissions: ADMIN, OPERATOR, VIEWER
- Session management with Redis
- Rate limiting

### Link Manager
- Unlimited VLESS links
- Friendly names & descriptions
- UUID v4 generator
- Custom WS path
- Enable / Disable toggle
- Traffic limits: daily / weekly / monthly / total
- Expiration dates
- QR code generation (vmess/vless URI)
- Clone, export, share

### Statistics
- Live connections
- Active users
- Total / Daily / Monthly traffic
- CPU / Memory usage
- Recharts traffic graphs
- Top users
- Geo statistics

### Monitoring
- Live request logs (WebSocket stream)
- Request history with filters
- Gateway health status
- Error tracking

### Notifications
- Toast UI (Sonner)
- Telegram Bot webhook
- Discord webhook
- SMTP Email

### Developer
- REST API with Swagger / OpenAPI 3.0
- API Tokens (Bearer)
- Webhooks for link events
- Full TypeScript SDK types

---

## Tech Stack

**Backend:** Node 20, Fastify, TypeScript, Prisma, PostgreSQL, Redis, ws
**Frontend:** Next.js 14, Tailwind CSS, Framer Motion, Three.js / R3F, Recharts, shadcn-style UI
**Infra:** Docker, Docker Compose, Railway, GitHub Actions

## Quick Start

### 1. Railway Deploy

1. Push this repo to GitHub
2. Railway → New Project → Deploy from GitHub
3. Add PostgreSQL + Redis plugins
4. Create 2 services from the same repo:
   - **API**: Root Directory `backend` – uses `backend/Dockerfile` + `backend/railway.json`
   - **Dashboard**: Root Directory `dashboard` – uses `dashboard/Dockerfile`
5. Set env vars (see `DEPLOY_RAILWAY.md`)

Full step-by-step: see [`DEPLOY_RAILWAY.md`](./DEPLOY_RAILWAY.md)

### 2. Docker Compose (Local)

```bash
git clone https://github.com/yourorg/cybergate
cd cybergate
cp .env.example .env
docker compose up -d --build
```

Services:
- Dashboard: http://localhost:3000
- API: http://localhost:8080
- Gateway WS: ws://localhost:8080/vless
- Docs: http://localhost:8080/docs

Default login: `admin@cybergate.local` / `ChangeMe123!`

### 3. Local Development

```bash
# Backend
cd backend
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev

# Dashboard (new terminal)
cd dashboard
pnpm install
pnpm dev
```

See full docs in `/docs`.

---

## Environment Variables

### Backend (`backend/.env`)
```
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@localhost:5432/cybergate
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-64char
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

GATEWAY_DOMAIN=localhost
GATEWAY_WS_PATH=/vless
GATEWAY_ALLOW_INSECURE=false

ADMIN_EMAIL=admin@cybergate.local
ADMIN_PASSWORD=ChangeMe123!

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
DISCORD_WEBHOOK_URL=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

CORS_ORIGIN=http://localhost:3000
```

### Dashboard (`dashboard/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_GATEWAY_DOMAIN=localhost
```

Full reference: See `.env.example`

---

## VLESS Client Config

CyberGate generates VLESS URIs like:

```
vless://550e8400-e29b-41d4-a716-446655440000@gate.example.com:443?encryption=none&security=tls&type=ws&host=gate.example.com&path=%2Fvless%2F550e8400-e29b-41d4-a716-446655440000#CyberGate-US-1
```

QR codes are auto-generated in the dashboard.

Supported clients: v2rayN, NekoRay, V2rayNG, Shadowrocket, Streisand, etc.

---

## API Documentation

Interactive Swagger UI: `http://localhost:8080/docs`

OpenAPI spec: `http://localhost:8080/docs/json`

Example:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cybergate.local","password":"ChangeMe123!"}'

curl http://localhost:8080/api/links \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## Project Structure

```
cybergate/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Fastify bootstrap
│   │   ├── gateway/vless.ts   # VLESS over WS handler
│   │   ├── routes/            # auth, links, stats, ...
│   │   └── services/
│   ├── prisma/schema.prisma
│   ├── Dockerfile
│   └── railway.json
├── dashboard/
│   ├── app/
│   │   ├── (auth)/login/
│   │   └── (dashboard)/dashboard/
│   ├── components/
│   ├── tailwind.config.ts
│   ├── Dockerfile
│   └── railway.json
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## License

MIT © 2026 CyberGate
