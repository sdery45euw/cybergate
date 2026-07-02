import { FastifyInstance } from 'fastify'
import { prisma, redis } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import os from 'os'

export default async function statsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth)

  app.get('/overview', async () => {
    const [linkCount, totalTraffic, live] = await Promise.all([
      prisma.vlessLink.count(),
      prisma.vlessLink.aggregate({ _sum: { trafficUsed: true } }),
      redis.scard('cg:live')
    ])
    const cpu = os.loadavg()[0]
    const memUsed = process.memoryUsage().rss
    const memTotal = os.totalmem()

    return {
      liveConnections: live,
      activeUsers: await prisma.vlessLink.count({ where: { lastUsedAt: { gte: new Date(Date.now()- 24*3600*1000) }}}),
      totalTraffic: totalTraffic._sum.trafficUsed?.toString() ?? '0',
      links: linkCount,
      cpu: Number(cpu.toFixed(2)),
      memory: { used: memUsed, total: memTotal }
    }
  })

  app.get('/traffic', async () => {
    // last 14 days
    const days = [...Array(14)].map((_,i) => {
      const d = new Date(); d.setDate(d.getDate() - (13-i)); d.setHours(0,0,0,0); return d
    })
    const points = []
    for (const day of days) {
      const next = new Date(day); next.setDate(next.getDate()+1)
      const agg = await prisma.trafficLog.aggregate({
        _sum: { bytesUp: true, bytesDown: true },
        where: { createdAt: { gte: day, lt: next } }
      })
      points.push({
        date: day.toISOString().slice(0,10),
        up: Number(agg._sum.bytesUp || 0),
        down: Number(agg._sum.bytesDown || 0)
      })
    }
    return { points }
  })

  app.get('/top', async () => {
    const top = await prisma.vlessLink.findMany({
      orderBy: { trafficUsed: 'desc' },
      take: 5,
      select: { id: true, name: true, trafficUsed: true }
    })
    return { top: top.map(t=>({...t, trafficUsed: t.trafficUsed.toString()})) }
  })
}
