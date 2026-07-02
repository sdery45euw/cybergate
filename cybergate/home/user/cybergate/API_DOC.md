# CyberGate API

Base: `https://api.cybergate.local`

Auth: `Authorization: Bearer <token>`

### POST /api/auth/login
{ email, password } -> { accessToken, refreshToken, user }

### GET /api/links
List VLESS links

### POST /api/links
Create link. Body: { name, description?, trafficLimit?, dailyLimit?, weeklyLimit?, monthlyLimit?, expiresAt? }

UUID + WS path auto-generated.

### PUT /api/links/:id
Update link

### DELETE /api/links/:id
Delete

### POST /api/links/:id/clone
Clone link

### GET /api/links/:id/qr
Returns { uri, qr: data:image/png }

### GET /api/links/:id/config
Returns { uri }

### GET /api/stats/overview
{ liveConnections, activeUsers, totalTraffic, cpu, memory }

### GET /api/stats/traffic
Last 14 days traffic

### GET /api/stats/top
Top 5 users

### GET /api/monitoring/logs
Request history

### GET /api/monitoring/health
Gateway health

OpenAPI JSON: `/docs/json`
