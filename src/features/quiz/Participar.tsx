import { useState } from 'react'
import { Link, useLoaderData, useParams } from 'react-router'
import { request } from './api'
import type { QuizResult } from './result'

import { Logout } from '../auth/Login'

export type PublishedQuiz = { title: string; event: string; questions: { text: string; options: string[] }[] }

export default function Participar() {
  const quiz = useLoaderData() as PublishedQuiz
  const { id } = useParams()
  return <Attempt key={id} quiz={quiz} id={id!} />
}

function Attempt({ quiz, id }: { quiz: PublishedQuiz; id: string }) {
  const [key] = useState(() => Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join(''))
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const current = quiz.questions[answers.length]
  const last = answers.length + 1 === quiz.questions.length

  async function advance() {
    if (selected === null || busy) return
    const next = [...answers, selected]
    if (!last) {
      setAnswers(next)
      setSelected(null)
      return
    }
    setBusy(true)
    setError('')
    try { setResult(await request<QuizResult>('/api/quizzes/' + id + '/respostas', { key, answers: next })) }
    catch (e) { setError(e instanceof Error ? e.message : 'Falha ao enviar. Tente novamente.') }
    finally { setBusy(false) }
  }

  return <main className="mx-auto max-w-xl p-5 font-body">
    <Logout role="participante" />
    <h1 className="my-5 text-3xl font-black text-cldf-blue">{quiz.title}</h1>
    <p className="mb-4 font-semibold text-cldf-blue">{quiz.event}</p>
    <section className="space-y-5 rounded-3xl bg-white p-6 shadow">
      {result ? <>
        <h2 className="text-xl font-bold">Desafio concluído!</h2>
        <p>{result.correct} de {result.total} acertos · {result.score} pontos</p>
        <Link className="text-cldf-blue underline" to="/">Voltar ao início</Link>
      </> : <>
        <p>Questão {answers.length + 1} de {quiz.questions.length}</p>
        <fieldset disabled={busy} className="space-y-2">
          <legend className="mb-3 text-xl font-bold">{current.text}</legend>
          {current.options.map((option, index) => <label key={index} className="flex gap-3 rounded-xl border border-blue-100 p-3">
            <input type="radio" name="answer" checked={selected === index} onChange={() => setSelected(index)} />{option}
          </label>)}
        </fieldset>
        {error && <p role="alert">{error}</p>}
        <button disabled={busy || selected === null} onClick={advance} className="rounded-xl bg-cldf-blue px-5 py-3 font-bold text-white disabled:opacity-50">
          {busy ? 'Enviando…' : last ? 'Enviar respostas' : 'Próxima pergunta'}
        </button>
      </>}
    </section>
  </main>
}
