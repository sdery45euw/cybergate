import Fastify from 'fastify'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { env } from './config/env.js'
import { prisma, redis } from './config/db.js'
import { handleVlessWs } from './gateway/vless.js'
import authRoutes from './routes/auth.js'
import linksRoutes from './routes/links.js'
import statsRoutes from './routes/stats.js'
import settingsRoutes from './routes/settings.js'
import monitoringRoutes from './routes/monitoring.js'
import apiTokensRoutes from './routes/apiTokens.js'

const app = Fastify({ logger: true })

await app.register(cors, { origin: env.CORS_ORIGIN, credentials: true })
await app.register(rateLimit, { max: 300, timeWindow: '1 minute' })
await app.register(websocket)
await app.register(swagger, {
  swagger: {
    info: { title: 'CyberGate API', version: '1.0.0' },
    securityDefinitions: { bearerAuth: { type: 'apiKey', name: 'Authorization', in: 'header' } }
  }
})
await app.register(swaggerUi, { routePrefix: '/docs' })

// Health
app.get('/health', async () => ({ ok: true, ts: Date.now() }))

// API routes
await app.register(authRoutes, { prefix: '/api/auth' })
await app.register(linksRoutes, { prefix: '/api/links' })
await app.register(statsRoutes, { prefix: '/api/stats' })
await app.register(settingsRoutes, { prefix: '/api/settings' })
await app.register(monitoringRoutes, { prefix: '/api/monitoring' })
await app.register(apiTokensRoutes, { prefix: '/api/tokens' })

// VLESS WS Gateway
app.get(env.GATEWAY_WS_PATH + '/:uuid?', { websocket: true }, (connection, req) => {
  handleVlessWs(connection, req)
})

// Realtime stats WS (dashboard)
app.get('/live', { websocket: true }, (connection) => {
  const int = setInterval(async () => {
    const live = await redis.scard('cg:live')
    connection.socket.send(JSON.stringify({ type: 'stats', live, ts: Date.now() }))
  }, 1500)
  connection.socket.on('close', () => clearInterval(int))
})

// Graceful
const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`CyberGate API listening on ${env.PORT}`)
  } catch (e) {
    app.log.error(e)
    process.exit(1)
  }
}
start()
