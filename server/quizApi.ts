import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { IncomingMessage } from 'node:http'
import type { Connect, Plugin } from 'vite'

import { authenticate, requireSession, RequestError } from './auth'

import { prepareEvents, newEvent, eventSummary, type Database, type Quiz, type Question } from './events'
import { networkInterfaces } from 'node:os'

const file = resolve(process.env.QUIZ_DATA_FILE || 'data/quizzes.json')

function load(): Database {
  try { return JSON.parse(readFileSync(file, 'utf8')) }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { quizzes: [] }
    throw error
  }
}

// The synchronous read-modify-rename runs without interleaving in one Node process.
function save(db: Database) {
  mkdirSync(dirname(file), { recursive: true })
  const temp = file + '.tmp'
  writeFileSync(temp, JSON.stringify(db, null, 2), { mode: 0o600 })
  renameSync(temp, file)
}

function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new RequestError(400, message)
}
type Fields = Record<string, unknown>
function object(value: unknown): value is Fields {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function cleanText(value: unknown) {
  requireValue(typeof value === 'string' && value.trim() && value.length <= 4000, 'Preencha os textos com até 4000 caracteres.')
  return value.trim()
}
async function body(req: IncomingMessage): Promise<Fields> {
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') throw new RequestError(415, 'Envie JSON.')
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > 512000) throw new RequestError(413, 'Quiz muito grande.')
    chunks.push(chunk)
  }
  let data: unknown
  try { data = JSON.parse(Buffer.concat(chunks).toString()) } catch { throw new RequestError(400, 'JSON inválido.') }
  requireValue(object(data), 'Dados inválidos.')
  return data
}
function question(value: unknown): Question {
  requireValue(object(value) && Array.isArray(value.options) && value.options.length >= 2 && value.options.length <= 6, 'Use de duas a seis alternativas.')
  const options = value.options.map(cleanText)
  const correct = value.correct
  requireValue(typeof correct === 'number' && Number.isInteger(correct) && correct >= 0 && correct < options.length, 'Gabarito inválido.')
  return { text: cleanText(value.text), options, correct }
}

const api: Connect.NextHandleFunction = async (req, res, next) => {
  const path = new URL(req.url || '/', 'http://localhost').pathname
  if (!path.startsWith('/api/')) return next()
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  try {
    const input = req.method === 'POST' ? await body(req) : {}
    const db = load()
    if (prepareEvents(db)) save(db)
    let result: unknown
    if (path === '/api/quizzes') requireSession(req, 'admin')
    if (path.startsWith('/api/auth/')) {
      result = authenticate(path, req, res, input, db.accounts || [], account => {
        (db.accounts ??= []).push(account)
        save(db)
      })
    } else if (path === '/api/quizzes' && req.method === 'POST') {
      requireValue(Array.isArray(input.questions) && input.questions.length > 0 && input.questions.length <= 100, 'Use entre 1 e 100 questões.')
      const id = randomUUID()
      const quiz: Quiz = { id, title: cleanText(input.title), questions: input.questions.map(question), events: [newEvent(id, 'Turma inicial')] }
      db.quizzes.push(quiz)
      save(db)
      res.statusCode = 201
      result = { id: quiz.id }
    } else if (path === '/api/quizzes' && req.method === 'GET') {
      result = db.quizzes.map(q => ({
        id: q.id, title: q.title, questions: q.questions.length, events: q.events!.map(eventSummary),
      }))
    } else if (path === '/api/turmas' && req.method === 'POST') {
      requireSession(req, 'admin')
      const quiz = db.quizzes.find(q => q.id === input.quizId)
      if (!quiz) throw new RequestError(404, 'Quiz não encontrado.')
      const name = cleanText(input.name)
      requireValue(name.length <= 100, 'Use até 100 caracteres para o nome da turma.')
      const event = newEvent(randomUUID(), name)
      quiz.events!.push(event)
      save(db)
      res.statusCode = 201
      result = { id: event.id }
    } else if (path === '/api/rede' && req.method === 'GET') {
      requireSession(req, 'admin')
      result = Object.values(networkInterfaces()).flat().filter(n => n && !n.internal && n.family === 'IPv4').map(n => n!.address)
    } else {
      const match = /^\/api\/quizzes\/([a-f0-9-]+)(\/respostas|\/inscricao)?$/.exec(path)
      const quiz = match && db.quizzes.find(q => q.events!.some(e => e.id === match[1]))
      if (!match || !quiz) throw new RequestError(404, 'Evento não encontrado.')
      const event = quiz.events!.find(e => e.id === match[1])!
      const participant = requireSession(req, 'participante')
      const enroll = () => {
        if (event.members.some(m => m.id === participant.id)) return false
        const account = db.accounts?.find(a => a.id === participant.id)
        if (!account) throw new RequestError(401, 'Entre novamente.')
        event.members.push({ id: account.id, name: account.name })
        return true
      }
      if ((!match[2] && req.method === 'GET') || (match[2] === '/inscricao' && req.method === 'POST')) {
        if (match[2] && enroll()) save(db)
        result = { title: quiz.title, event: event.name, questions: quiz.questions.map(({ text, options }) => ({ text, options })) }
      } else if (match[2] === '/respostas' && req.method === 'POST') {
        const { answers, key } = input
        requireValue(typeof key === 'string' && /^[a-zA-Z0-9-]{12,80}$/.test(key), 'Identificador inválido.')
        requireValue(Array.isArray(answers) && answers.length === quiz.questions.length && answers.every((a,i) => Number.isInteger(a) && a >= 0 && a < quiz.questions[i].options.length), 'Responda a todas as questões.')
        let attempt = event.attempts.find(a => a.key === key && a.participantId === participant.id)
        if (attempt && JSON.stringify(attempt.answers) !== JSON.stringify(answers)) throw new RequestError(409, 'Esta tentativa já foi concluída.')
        if (!attempt) {
          const correct = answers.filter((answer,i) => answer === quiz.questions[i].correct).length
          attempt = { key, answers, correct, participantId: participant.id }
          enroll()
          event.attempts.push(attempt)
          save(db)
        }
        result = { correct: attempt.correct, total: quiz.questions.length, score: attempt.correct * 16 }
      } else throw new RequestError(405, 'Método indisponível.')
    }
    res.end(JSON.stringify(result))
  } catch (error) {
    if (!(error instanceof RequestError)) console.error('Falha na API de quizzes:', error)
    res.statusCode = error instanceof RequestError ? error.status : 500
    res.end(JSON.stringify({ error: error instanceof RequestError ? error.message : 'Não foi possível acessar os dados do quiz.' }))
  }
}

export function quizApi(): Plugin {
  return {
    name: 'cldf-quiz-api',
    configureServer(server) { server.middlewares.use(api) },
    configurePreviewServer(server) { server.middlewares.use(api) },
  }
}
