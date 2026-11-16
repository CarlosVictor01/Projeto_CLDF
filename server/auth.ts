import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'

export type Account = { id: string; name: string; email: string; salt: string; hash: string }
type Role = 'admin' | 'participante'
type Session = { role: Role; id: string; expires: number }
const sessions = new Map<string, Session>()
const lifetime = 8 * 60 * 60

export class RequestError extends Error {
  constructor(readonly status: number, message: string) { super(message) }
}

function token(req: IncomingMessage, role: Role) {
  const prefix = 'cldf_' + role + '='
  return req.headers.cookie?.split(';').map(s => s.trim()).find(s => s.startsWith(prefix))?.slice(prefix.length) || ''
}
export function session(req: IncomingMessage, role: Role) {
  const key = token(req, role)
  const item = sessions.get(key)
  if (item && item.expires <= Date.now()) sessions.delete(key)
  const active = sessions.get(key)
  if (active?.role === role) return active
}
export function requireSession(req: IncomingMessage, role: Role) {
  const active = session(req, role)
  if (!active) throw new RequestError(401, 'Entre para continuar.')
  return active
}

function setSession(req: IncomingMessage, res: ServerResponse, role: Role, id?: string) {
  sessions.delete(token(req, role))
  for (const [key, value] of sessions) if (value.expires <= Date.now()) sessions.delete(key)
  const key = id ? randomBytes(32).toString('hex') : ''
  if (id) sessions.set(key, { role, id, expires: Date.now() + lifetime * 1000 })
  const secure = 'encrypted' in req.socket && req.socket.encrypted ? '; Secure' : ''
  res.setHeader('Set-Cookie', 'cldf_' + role + '=' + key + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + (id ? lifetime : 0) + secure)
}

export function authenticate(path: string, req: IncomingMessage, res: ServerResponse, input: Record<string, unknown>,
  accounts: Account[], register: (account: Account) => void) {
  if (path === '/api/auth/session' && req.method === 'GET') {
    return { admin: !!session(req, 'admin'), participante: !!session(req, 'participante') }
  }
  if (req.method !== 'POST') throw new RequestError(405, 'Método indisponível.')
  if (path === '/api/auth/logout') {
    if (input.role !== 'admin' && input.role !== 'participante') throw new RequestError(400, 'Perfil inválido.')
    setSession(req, res, input.role)
    return { ok: true }
  }
  const denied = () => new RequestError(401, 'Credenciais inválidas.')
  if (path === '/api/auth/admin') {
    if (session(req, 'participante')) throw new RequestError(403, 'Saia da conta de participante antes de entrar como administrador.')
    if (input.username !== 'admin' || input.password !== (process.env.CLDF_ADMIN_PASSWORD || 'admin')) throw denied()
    setSession(req, res, 'admin', 'admin')
    return { ok: true }
  }
  if (!['/api/auth/login','/api/auth/register'].includes(path)) throw new RequestError(404, 'Rota inválida.')
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new RequestError(400, 'Informe um e-mail válido.')
  const password = input.password
  if (typeof password !== 'string' || !password.length || password.length > 128) throw new RequestError(400, 'Senha inválida.')
  let account = accounts.find(a => a.email === email)
  if (path === '/api/auth/register') {
    if (account) throw new RequestError(409, 'E-mail já cadastrado. Use Entrar.')
    const name = typeof input.name === 'string' ? input.name.trim() : ''
    if (!name || name.length > 100 || password.length < 6) throw new RequestError(400, 'Informe seu nome e uma senha com pelo menos 6 caracteres.')
    const salt = randomBytes(16).toString('hex')
    account = { id: randomUUID(), name, email, salt, hash: scryptSync(password, salt, 64).toString('hex') }
    register(account)
  } else if (!account || !timingSafeEqual(scryptSync(password, account.salt, 64), Buffer.from(account.hash, 'hex'))) {
    throw denied()
  }
  sessions.delete(token(req, 'admin'))
  setSession(req, res, 'participante', account.id)
  return { ok: true }
}
