import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../config/db.js'
import { requireAuth } from '../middleware/auth.js'
import { randomUUID } from 'crypto'
import QRCode from 'qrcode'
import { env } from '../config/env.js'

const LinkInput = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  enabled: z.boolean().optional(),
  trafficLimit: z.number().nullable().optional(),
  dailyLimit: z.number().nullable().optional(),
  weeklyLimit: z.number().nullable().optional(),
  monthlyLimit: z.number().nullable().optional(),
  expiresAt: z.string().nullable().optional()
})

function buildVlessUri(uuid: string, name: string, path: string) {
  const host = env.GATEWAY_DOMAIN
  const params = new URLSearchParams({
    encryption: 'none',
    security: 'tls',
    type: 'ws',
    host,
    path
  })
  return `vless://${uuid}@${host}:443?${params.toString()}#${encodeURIComponent(name)}`
}

export default async function linksRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth)

  app.get('/', async (req) => {
    const user = (req as any).user
    const links = await prisma.vlessLink.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    return { links: links.map(l => ({
      ...l,
      trafficUsed: l.trafficUsed.toString(),
      trafficLimit: l.trafficLimit?.toString() ?? null
    })) }
  })

  app.post('/', async (req, reply) => {
    const user = (req as any).user
    const data = LinkInput.parse(req.body)
    const uuid = randomUUID()
    const path = `${env.GATEWAY_WS_PATH}/${uuid}`
    const link = await prisma.vlessLink.create({
      data: {
        uuid,
        path,
        name: data.name,
        description: data.description,
        enabled: data.enabled ?? true,
        trafficLimit: data.trafficLimit ?? null,
        dailyLimit: data.dailyLimit ?? null,
        weeklyLimit: data.weeklyLimit ?? null,
        monthlyLimit: data.monthlyLimit ?? null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        userId: user.id
      }
    })
    return { link }
  })

  app.put('/:id', async (req, reply) => {
    const { id } = req.params as any
    const data = LinkInput.partial().parse(req.body)
    const link = await prisma.vlessLink.update({ where: { id }, data: {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined
    }})
    return { link }
  })

  app.delete('/:id', async (req) => {
    const { id } = req.params as any
    await prisma.vlessLink.delete({ where: { id }})
    return { ok: true }
  })

  app.post('/:id/clone', async (req) => {
    const { id } = req.params as any
    const user = (req as any).user
    const src = await prisma.vlessLink.findUnique({ where: { id }})
    if (!src) throw new Error('Not found')
    const uuid = randomUUID()
    const path = `${env.GATEWAY_WS_PATH}/${uuid}`
    const link = await prisma.vlessLink.create({
      data: {
        uuid, path,
        name: src.name + ' (copy)',
        description: src.description,
        trafficLimit: src.trafficLimit,
        dailyLimit: src.dailyLimit,
        weeklyLimit: src.weeklyLimit,
        monthlyLimit: src.monthlyLimit,
        userId: user.id
      }
    })
    return { link }
  })

  app.get('/:id/qr', async (req) => {
    const { id } = req.params as any
    const link = await prisma.vlessLink.findUnique({ where: { id }})
    if (!link) throw new Error('not found')
    const uri = buildVlessUri(link.uuid, link.name, link.path)
    const png = await QRCode.toDataURL(uri)
    return { uri, qr: png }
  })

  app.get('/:id/config', async (req) => {
    const { id } = req.params as any
    const link = await prisma.vlessLink.findUnique({ where: { id }})
    if (!link) throw new Error('not found')
    const uri = buildVlessUri(link.uuid, link.name, link.path)
    return { uri }
  })
}
