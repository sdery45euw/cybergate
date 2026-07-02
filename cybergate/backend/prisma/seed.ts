import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@cybergate.local'
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
  const hash = await bcrypt.hash(password, 12)
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Admin', passwordHash: hash, role: 'ADMIN' }
  })
  console.log('Admin user:', user.email)
  // sample link
  const exists = await prisma.vlessLink.findFirst({ where: { userId: user.id }})
  if (!exists) {
    const { randomUUID } = await import('crypto')
    const uuid = randomUUID()
    await prisma.vlessLink.create({
      data: {
        uuid,
        name: 'Demo Link - Tokyo',
        description: 'Sample VLESS link',
        path: `/vless/${uuid}`,
        userId: user.id
      }
    })
    console.log('Created demo link', uuid)
  }
}
main()
