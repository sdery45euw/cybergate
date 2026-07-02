# Railway Deploy – CyberGate

CyberGate is a monorepo with two services: `backend/` (API + VLESS Gateway) and `dashboard/` (Next.js).

## 1. Push to GitHub

```bash
cd cybergate
git init
git add .
git commit -m "feat: initial CyberGate"
# Create a new empty repo on github.com, then:
git branch -M main
git remote add origin https://github.com/<your-user>/cybergate.git
git push -u origin main
```

## 2. Create Railway Project

1. railway.app → New Project → Deploy from GitHub repo → select `cybergate`
2. Add → Database → Add PostgreSQL
3. Add → Database → Add Redis

### API Service
- New → GitHub Repo → same repo
- Settings → Service Name: `cybergate-api`
- Settings → Root Directory: `backend`
- Settings → Watch Paths: `backend/**`
- Variables:
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=<openssl rand -hex 32>
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>
GATEWAY_DOMAIN=${{RAILWAY_PUBLIC_DOMAIN}}
CORS_ORIGIN=https://<your-dashboard-domain>
NODE_ENV=production
PORT=8080
```
- Railway auto-detects `backend/Dockerfile` and `backend/railway.json`
- Deploy. Healthcheck: `/health`
- Migrations run automatically in the Docker CMD.

Seed admin user (one time):
Railway → API Service → Run a Command:
```
npx prisma db seed
```

If you set `ADMIN_EMAIL` / `ADMIN_PASSWORD` before first deploy, the seed creates that admin.

### Dashboard Service
- New → GitHub Repo → same repo
- Settings → Service Name: `cybergate-dashboard`
- Settings → Root Directory: `dashboard`
- Settings → Watch Paths: `dashboard/**`
- Variables:
```
NEXT_PUBLIC_API_URL=https://<your-api>.up.railway.app
NEXT_PUBLIC_WS_URL=wss://<your-api>.up.railway.app
NEXT_PUBLIC_GATEWAY_DOMAIN=<your-api>.up.railway.app
PORT=3000
```
- Deploy.

## 3. Done

- Dashboard: `https://<dashboard>.up.railway.app`
  Login: your `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- API Docs: `https://<api>.up.railway.app/docs`
- VLESS WS: `wss://<api>.up.railway.app/vless/<uuid>`

TLS is automatic. Railway gives you a public domain per service.

### Updating

Push to `main` → Railway auto-redeploys the service whose `Watch Paths` changed.

### Environment

See `.env.example` for full list. Notifications (Telegram/Discord/SMTP) are optional.
