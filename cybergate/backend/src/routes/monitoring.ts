import { FastifyInstance } from 'fastify'
import { prisma } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'

export default async function monitoringRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth)

  app.get('/logs', async (req) => {
    const q = (req.query as any) || {}
    const take = Math.min(parseInt(q.take || '50'), 200)
    const logs = await prisma.trafficLog.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      include: { link: { select: { name: true } } }
    })
    return { logs: logs.map(l => ({
      ...l,
      bytesUp: l.bytesUp.toString(),
      bytesDown: l.bytesDown.toString()
    })) }
  })

  app.get('/health', async () => {
    return {
      gateway: 'healthy',
      database: 'healthy',
      redis: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  })
}
