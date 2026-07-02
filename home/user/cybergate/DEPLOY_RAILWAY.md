# Railway Deploy – CyberGate

1. Create New Project → Deploy from GitHub
2. Add 3 services:
   - PostgreSQL (Railway plugin)
   - Redis (Railway plugin)
   - API → Root Directory: `backend`, Dockerfile
   - Dashboard → Root Directory: `dashboard`, Dockerfile / Nixpacks

3. API environment variables:
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<openssl rand -hex 32>
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong>
GATEWAY_DOMAIN=${{ RAILWAY_PUBLIC_DOMAIN }}
CORS_ORIGIN=https://your-dashboard.up.railway.app
PORT=8080
```

4. Run once: `npx prisma migrate deploy && npx prisma db seed`

In Railway, set Start Command for API:
```
sh -c "npx prisma migrate deploy && node dist/server.js"
```

5. Dashboard env:
```
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app
NEXT_PUBLIC_WS_URL=wss://your-api.up.railway.app
NEXT_PUBLIC_GATEWAY_DOMAIN=your-api.up.railway.app
```

TLS is automatic on Railway. VLESS WS path: `wss://your-api.up.railway.app/vless/<uuid>`

Done.
