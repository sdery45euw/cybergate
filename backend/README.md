# CyberGate API / Gateway

Fastify + Prisma + PostgreSQL + Redis

VLESS over WebSocket handler at `src/gateway/vless.ts` – original, clean implementation.

Dev:
```
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

Docker:
```
docker build -t cybergate-api .
```
