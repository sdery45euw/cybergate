/**
 * CyberGate VLESS over WebSocket
 * Minimal, original implementation. Not copied from Xray/v2fly.
 * Supports TCP only. No encryption (encryption=none) as per VLESS spec.
 */
import { Duplex } from 'stream'
import net from 'net'
import { prisma, redis } from '../config/db.js'

type VlessAddrType = 1 | 2 | 3; // ipv4, domain, ipv6

interface VlessHeader {
  version: number
  uuid: string
  command: number // 1=tcp, 2=udp, 3=mux
  port: number
  addrType: VlessAddrType
  address: string
}

// Parse UUID from 16 byte buffer
function uuidFromBytes(buf: Buffer): string {
  const hex = buf.toString('hex')
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
}

function parseVlessHeader(buffer: Buffer): {header: VlessHeader, remaining: Buffer} | null {
  if (buffer.length < 24) return null
  const version = buffer[0]
  const uuid = uuidFromBytes(buffer.subarray(1,17))
  const addonLen = buffer[17]
  const headerEnd = 18 + addonLen
  if (buffer.length < headerEnd + 4) return null
  const command = buffer[headerEnd]
  const port = buffer.readUInt16BE(headerEnd+1)
  const addrType = buffer[headerEnd+3] as VlessAddrType
  let addrLen = 0
  let address = ''
  let offset = headerEnd + 4
  if (addrType === 1) { addrLen = 4; address = Array.from(buffer.subarray(offset, offset+4)).join('.'); }
  else if (addrType === 3) { addrLen = 16; address = ''; for (let i=0;i<8;i++) address += buffer.readUInt16BE(offset+i*2).toString(16) + (i<7?':':''); }
  else if (addrType === 2) { addrLen = buffer[offset]; offset += 1; address = buffer.subarray(offset, offset+addrLen).toString(); }
  else throw new Error('Invalid ATYP')
  offset += addrLen
  const header: VlessHeader = { version, uuid, command, port, addrType, address }
  return { header, remaining: buffer.subarray(offset) }
}

export async function handleVlessWs(connection: any, req: any) {
  const socket = connection.socket
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip

  let remote: net.Socket | null = null
  let linkId: string | null = null
  let bytesUp = 0, bytesDown = 0
  let vlessReady = false

  // Track live connections
  const connId = Math.random().toString(36).slice(2)
  await redis.sadd('cg:live', connId)
  await redis.expire('cg:live', 120)

  const closeBoth = async () => {
    try { remote?.destroy() } catch {}
    try { socket.close() } catch {}
    await redis.srem('cg:live', connId)
    if (linkId) {
      // Persist traffic
      try {
        await prisma.vlessLink.update({
          where: { id: linkId },
          data: {
            trafficUsed: { increment: bytesUp + bytesDown },
            lastUsedAt: new Date()
          }
        })
        await prisma.trafficLog.create({
          data: {
            linkId,
            bytesUp,
            bytesDown,
            ip
          }
        })
        // redis counters for realtime
        await redis.incrby('cg:traffic:down', bytesDown)
        await redis.incrby('cg:traffic:up', bytesUp)
      } catch {}
    }
  }

  socket.on('message', async (msg: Buffer) => {
    const data = Buffer.isBuffer(msg) ? msg : Buffer.from(msg)
    if (!vlessReady) {
      const parsed = parseVlessHeader(data)
      if (!parsed) { socket.close(); return }
      const { header, remaining } = parsed
      
      // Validate UUID / link
      const link = await prisma.vlessLink.findUnique({ where: { uuid: header.uuid }})
      if (!link || !link.enabled) { socket.close(); return }
      if (link.expiresAt && link.expiresAt < new Date()) { socket.close(); return }

      // traffic limit check
      const used = Number(link.trafficUsed)
      if (link.trafficLimit && used >= Number(link.trafficLimit)) { socket.close(); return }

      linkId = link.id

      if (header.command !== 1) { // only TCP supported in this minimal build
        socket.close(); return
      }

      // Connect to target
      remote = net.connect(header.port, header.address, () => {
        // VLESS response header: version 0, addon 0
        socket.send(Buffer.from([header.version, 0]))
        vlessReady = true
        if (remaining.length) {
          bytesUp += remaining.length
          remote!.write(remaining)
        }
      })

      remote.on('data', (chunk) => {
        bytesDown += chunk.length
        try { socket.send(chunk) } catch {}
      })
      remote.on('close', closeBoth)
      remote.on('error', closeBoth)
      return
    }

    // proxy upstream
    if (remote && !remote.destroyed) {
      bytesUp += data.length
      remote.write(data)
    }
  })

  socket.on('close', closeBoth)
  socket.on('error', closeBoth)
}
