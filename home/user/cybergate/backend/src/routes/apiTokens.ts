import { FastifyInstance } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../config/db.js'
import crypto from 'crypto'

export default async function apiTokensRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth)
  app.get('/', async (req) => {
    const user = (req as any).user
    const tokens = await prisma.apiToken.findMany({ where: { userId: user.id }})
    return { tokens: tokens.map(t=> ({...t, tokenHash: undefined})) }
  })
  app.post('/', async (req) => {
    const user = (req as any).user
    const { name } = (req.body as any) || {}
    const raw = 'cg_' + crypto.randomBytes(32).toString('hex')
    const hash = crypto.createHash('sha256').update(raw).digest('hex')
    const token = await prisma.apiToken.create({ data: { name: name || 'API Token', tokenHash: hash, userId: user.id }})
    return { token: { ...token, tokenHash: undefined }, raw }
  })
  app.delete('/:id', async (req) => {
    const { id } = req.params as any
    await prisma.apiToken.delete({ where: { id }})
    return { ok: true }
  })
}
