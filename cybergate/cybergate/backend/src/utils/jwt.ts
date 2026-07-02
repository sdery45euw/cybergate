import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signAccess(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_TTL as any })
}
export function signRefresh(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_TTL as any })
}
export function verify<T=any>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET) as T
}
