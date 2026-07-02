import { FastifyRequest, FastifyReply } from 'fastify'
import { verify } from '../utils/jwt.js'
import { prisma } from '../config/db.js'

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) return reply.code(401).send({ error: 'Unauthorized' })
    const token = auth.slice(7)
    const payload = verify<{sub:string}>(token)
    const user = await prisma.user.findUnique({ where: { id: payload.sub }})
    if (!user || !user.isActive) return reply.code(401).send({ error: 'Unauthorized' })
    ;(req as any).user = user
  } catch {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
}

export function requireRole(...roles: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user
    if (!user || !roles.includes(user.role)) {
      return reply.code(403).send({ error: 'Forbidden' })
    }
  }
}
