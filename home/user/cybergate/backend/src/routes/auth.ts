import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { prisma } from '../config/db.js'
import { signAccess, signRefresh } from '../utils/jwt.js'

export default async function authRoutes(app: FastifyInstance) {
  app.post('/login', {
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: { email: { type: 'string' }, password: { type: 'string' } }
      }
    }
  }, async (req, reply) => {
    const { email, password } = z.object({ email: z.string().email(), password: z.string().min(6) }).parse(req.body)
    const user = await prisma.user.findUnique({ where: { email }})
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return reply.code(401).send({ error: 'Invalid credentials' })
    }
    const access = signAccess({ sub: user.id, role: user.role })
    const refresh = signRefresh({ sub: user.id })
    return { accessToken: access, refreshToken: refresh, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
  })

  app.get('/me', { preHandler: [(await import('../middleware/auth.js')).requireAuth] }, async (req) => {
    return { user: (req as any).user }
  })
}
