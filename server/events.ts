import { questions } from '../src/features/quiz/questions'
import type { Account } from './auth'

export type Question = { text: string; options: string[]; correct: number }
export type Attempt = { participantId?: string; key: string; answers: number[]; correct: number }
type Member = { id: string; name: string }
export type QuizEvent = { id: string; name: string; members: Member[]; attempts: Attempt[] }
export type Quiz = { id: string; title: string; questions: Question[]; attempts?: Attempt[]; events?: QuizEvent[] }
export type Database = { quizzes: Quiz[]; accounts?: Account[] }

export function newEvent(id: string, name: string): QuizEvent {
  return { id, name, members: [], attempts: [] }
}
const topics = ['Cidadania', 'Conhecendo o Parlamento', 'Poder Legislativo']
const demoEventId = 'de010001-a001-4000-8000-000000000001'
function demoEvent(quiz: Quiz) {
  const event = newEvent(demoEventId, 'Turma demonstração')
  const names = ['Ana Reis','Bruno Costa','Clara Dias','Davi Lima','Eva Nunes','Felipe Luz','Gabi Melo','Hugo Alves','Iara Rosa','João Brito']
  names.forEach((name, index) => {
    const id = 'demo-' + index
    const correct = 5 - Math.floor(index / 2)
    event.members.push({ id, name })
    const answers = quiz.questions.map((q, i) => i < correct ? q.correct : (q.correct + 1) % q.options.length)
    event.attempts.push({ participantId: id, key: id, correct, answers })
  })
  return event
}

export function prepareEvents(db: Database) {
  let changed = false
  topics.forEach((title, index) => {
    const id = 'cd1f0000-0000-4000-8000-00000000000' + (index + 1)
    if (db.quizzes.some(q => q.id === id)) return
    const quiz: Quiz = { id, title, questions: questions.map(q => ({ text: q.q, options: q.options, correct: q.correct })), events: [newEvent(id, 'Jornada')] }
    if (index === 0) quiz.events!.push(demoEvent(quiz))
    db.quizzes.push(quiz)
    changed = true
  })
  for (const quiz of db.quizzes) {
    const demo = quiz.events?.find(event => event.id === demoEventId)
    if (demo && demo.name === 'Turma de demonstração · 10 alunos fictícios') {
      demo.name = 'Turma demonstração'
      changed = true
    }
    if (quiz.events?.length) continue
    const event = newEvent(quiz.id, 'Turma inicial')
    event.attempts = quiz.attempts || []
    for (const id of new Set(event.attempts.map(a => a.participantId))) {
      const member = db.accounts?.find(a => a.id === id)
      if (member) event.members.push({ id: member.id, name: member.name })
    }
    quiz.events = [event]
    delete quiz.attempts
    changed = true
  }
  return changed
}

export function eventSummary(event: QuizEvent) {
  const first = new Map<string, number>()
  for (const a of event.attempts) {
    if (a.participantId && !first.has(a.participantId)) first.set(a.participantId, a.correct * 16)
  }
  const members = event.members.map(m => ({ name: m.name, points: first.get(m.id) ?? null }))
  const finished = members.filter((m): m is { name: string; points: number } => m.points !== null).sort((a,b) => b.points - a.points)
  let position = 0
  const ranking = finished.map((m,i) => {
    if (!i || finished[i-1].points !== m.points) position = i + 1
    return { ...m, position }
  })
  return { id: event.id, name: event.name, members, ranking, attempts: event.attempts.length }
}
