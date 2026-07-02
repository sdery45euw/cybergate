import { FastifyInstance } from 'fastify'
import { prisma } from '../config/db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export default async function settingsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth)

  app.get('/', async () => {
    const rows = await prisma.setting.findMany()
    const obj: any = {}
    rows.forEach(r=> obj[r.key] = r.value)
    return obj
  })

  app.put('/', { preHandler: requireRole('ADMIN') }, async (req) => {
    const body = req.body as Record<string, any>
    for (const [key, value] of Object.entries(body)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
    }
    return { ok: true }
  })
}
