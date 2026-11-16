import { prepareEvents, eventSummary, newEvent, type Database, type Question } from '../../../server/events'

const storage = 'cldf-pages-demo-v1'
const sessionKey = storage + '-session'
type Session = { admin?: boolean; id?: string }
type Input = { username?: string; email?: string; password?: string; name?: string; title?: string; questions?: Question[]; role?: string; quizId?: string; answers?: number[]; key?: string }

async function hash(password: string, salt: string) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations: 100000, salt: encoder.encode(salt) }, key, 256)
  return Array.from(new Uint8Array(bits), x => x.toString(16).padStart(2, '0')).join('')
}

function perform(url: string, input?: Input) {
  return async () => {
    const db: Database = JSON.parse(localStorage.getItem(storage) || '{"quizzes":[]}')
    const save = () => localStorage.setItem(storage, JSON.stringify(db))
    if (prepareEvents(db)) save()
    const session: Session = JSON.parse(sessionStorage.getItem(sessionKey) || '{}')
    const login = (next: Session) => { sessionStorage.setItem(sessionKey, JSON.stringify(next)); return { ok: true } }
    if (url === '/api/auth/session') return { admin: !!session.admin, participante: !!session.id }
    if (url === '/api/auth/logout') return login({})
    if (url === '/api/auth/admin') {
      if (session.id || input?.username !== 'admin' || input.password !== 'admin') throw Error('Acesso administrativo inválido.')
      return login({ admin: true })
    }
    if (url === '/api/auth/register' || url === '/api/auth/login') {
      const email = input?.email?.trim().toLowerCase() || ''
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('Informe um e-mail válido.')
      const password = input?.password || ''
      const accounts = db.accounts ??= []
      let account = accounts.find(a => a.email === email)
      if (url.endsWith('/register')) {
        if (account) throw Error('E-mail já cadastrado.')
        const name = input?.name?.trim()
        if (!name || password.length < 6) throw Error('Informe nome e senha com pelo menos 6 caracteres.')
        const salt = crypto.randomUUID()
        account = { id: crypto.randomUUID(), name, email, salt, hash: await hash(password, salt) }
        accounts.push(account)
        save()
      } else if (!account || account.hash !== await hash(password, account.salt)) throw Error('Credenciais inválidas.')
      return login({ id: account.id })
    }
    if (['/api/quizzes','/api/turmas','/api/rede'].includes(url)) {
      if (!session.admin) throw Error('Entre como administrador.')
      if (url === '/api/rede') return []
      if (url === '/api/turmas') {
        const quiz = db.quizzes.find(q => q.id === input?.quizId)
        const name = input?.name?.trim()
        if (!quiz || !name) throw Error('Informe a turma.')
        const event = newEvent(crypto.randomUUID(), name)
        quiz.events!.push(event)
        save()
        return { id: event.id }
      }
      if (!input) return db.quizzes.map(q => ({ id: q.id, title: q.title, questions: q.questions.length, events: q.events!.map(eventSummary) }))
      const id = crypto.randomUUID()
      if (!input.title?.trim() || !input.questions?.length) throw Error('Complete o quiz.')
      db.quizzes.push({ id, title: input.title, questions: input.questions, events: [newEvent(id, 'Turma inicial')] })
      save()
      return { id }
    }
    const account = db.accounts?.find(a => a.id === session.id)
    if (!account) throw Error('Entre como participante.')
    const [, , , id, action] = url.split('/')
    const quiz = db.quizzes.find(q => q.events!.some(e => e.id === id))
    const event = quiz?.events?.find(e => e.id === id)
    if (!quiz || !event) throw Error('Turma indisponível neste navegador.')
    if (action === 'inscricao') {
      if (!event.members.some(m => m.id === account.id)) {
        event.members.push({ id: account.id, name: account.name })
        save()
      }
      return { title: quiz.title, event: event.name, questions: quiz.questions.map(({ text, options }) => ({ text, options })) }
    }
    const answers = input?.answers
    if (action !== 'respostas' || !input?.key || !answers || answers.length !== quiz.questions.length) throw Error('Respostas inválidas.')
    let attempt = event.attempts.find(a => a.key === input.key && a.participantId === account.id)
    if (!attempt) {
      const correct = answers.filter((v,i) => v === quiz.questions[i].correct).length
      attempt = { participantId: account.id, key: input.key, answers, correct }
      event.attempts.push(attempt)
      save()
    }
    return { correct: attempt.correct, total: answers.length, score: attempt.correct * 16 }
  }
}
export function demoRequest(url: string, data?: unknown) {
  const run = perform(url, data as Input | undefined)
  return navigator.locks ? navigator.locks.request(storage, run) : run()
}
