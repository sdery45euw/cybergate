import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import { env } from './env.js'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['warn','error'] : ['error']
})

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableReadyCheck: true,
})
redis.connect().catch(()=>{})
