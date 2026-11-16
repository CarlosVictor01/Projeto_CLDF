import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { QRCodeSVG } from 'qrcode.react'
import { request } from '../quiz/api'

type Member = { name: string; points: number | null }
type Event = { id: string; name: string; members: Member[]; ranking: { name: string; points: number; position: number }[]; attempts: number }
type Quiz = { id: string; title: string; questions: number; events: Event[] }
const button = 'rounded-xl border border-blue-200 px-4 py-2 font-bold text-cldf-blue hover:bg-blue-50'
const primary = 'rounded-xl bg-cldf-blue px-4 py-2 font-bold text-white disabled:opacity-50'

function QuizCard({ quiz, hosts, refresh }: { quiz: Quiz; hosts: string[]; refresh: () => void }) {
  const [selected, select] = useState('')
  const [panel, show] = useState<'qr' | 'report' | null>(null)
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [host, setHost] = useState('')
  const event = quiz.events.find(e => e.id === selected) || quiz.events[0]
  const url = new URL('/participar/' + event.id, location.origin)
  const local = ['localhost','127.0.0.1','[::1]'].includes(url.hostname)
  if (local && hosts.length) url.hostname = host || hosts[0]

  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = new FormData(e.currentTarget).get('name')
    setBusy(true)
    setError('')
    try {
      const data = await request<{ id: string }>('/api/turmas', { quizId: quiz.id, name })
      select(data.id)
      show(null)
      setCreating(false)
      refresh()
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao criar turma.') }
    finally { setBusy(false) }
  }

  return <article className="space-y-4 rounded-3xl border border-blue-100 bg-white [&:nth-of-type(even)]:bg-gray-100 p-5 shadow-sm">
    <header><h2 className="text-xl font-black text-cldf-blue">{quiz.title}</h2><p className="text-sm text-slate-600">{quiz.questions} questões</p></header>
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex min-w-0 flex-1 flex-col gap-1 font-bold">Turma / evento
        <select value={event.id} onChange={e => select(e.target.value)} className="w-full rounded-xl border border-blue-200 p-2">
          {quiz.events.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <button className={button} onClick={() => setCreating(!creating)}>{creating ? 'Cancelar' : 'Nova turma'}</button>
    </div>
    {creating && <form onSubmit={create} className="flex flex-wrap gap-2">
      <input aria-label="Nome da turma" name="name" maxLength={100} required placeholder="Nome da turma ou evento" className="rounded-xl border p-2"/>
      <button className={primary} disabled={busy}>Criar turma</button>
    </form>}
    {error && <p role="alert">{error}</p>}
    <div className="flex flex-wrap gap-2">
      <button className={primary} aria-expanded={panel === 'qr'} onClick={() => show(panel === 'qr' ? null : 'qr')}>Gerar QR Code</button>
      <button className={button} aria-expanded={panel === 'report'} onClick={() => { show(panel === 'report' ? null : 'report'); refresh() }}>Inscritos e ranking</button>
    </div>
    {panel === 'qr' && <div className="space-y-3 rounded-xl bg-blue-50 p-4">
      <h3 className="font-bold">{event.name}</h3>
      {local && hosts.length > 0 && <label className="block">Endereço do notebook na rede <select value={url.hostname} onChange={e => setHost(e.target.value)}>{hosts.map(h => <option key={h}>{h}</option>)}</select></label>}
      <QRCodeSVG value={url.href} size={224} marginSize={4} title={'Participar de ' + event.name}/>
      <a className="block break-all text-cldf-blue underline" href={url.href}>{url.href}</a>
      {local && <p className="text-sm">{hosts.length ? 'Para escanear pelo celular, conecte-o à mesma rede do notebook.' : 'Abra o painel pelo endereço de rede do notebook para compartilhar com celulares.'}</p>}
    </div>}
    {panel === 'report' && <section aria-label="Relatório da turma" className="space-y-4 border-t border-blue-100 pt-4">
      <h3 className="font-bold">{event.name}</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><h4 className="font-bold">Inscritos ({event.members.length})</h4>
          {event.members.length === 0 && <p>Aguardando inscrições.</p>}
          <ul>{event.members.map((m,i) => <li key={i} className="flex justify-between gap-2 border-b py-2">{m.name}<small>{m.points === null ? 'Pendente' : 'Concluído'}</small></li>)}</ul>
        </div>
        <div><h4 className="font-bold">Ranking ({event.ranking.length})</h4>
          {event.ranking.length === 0 && <p>Aguardando respostas.</p>}
          <ol>{event.ranking.map((m,i) => <li key={i} className="flex justify-between gap-2 border-b py-2"><span>{m.position}º · {m.name}</span><strong>{m.points} pts</strong></li>)}</ol>
        </div>
      </div>
    </section>}
  </article>
}

export function PublishedQuizzes() {
  const [rows, setRows] = useState<Quiz[]>([])
  const [hosts, setHosts] = useState<string[]>([])
  const [error, setError] = useState('')
  const [revision, refresh] = useState(0)
  useEffect(() => {
    let active = true
    request<string[]>('/api/rede').then(h => { if (active) setHosts(h) }).catch(() => {})
    return () => { active = false }
  }, [])
  useEffect(() => {
    let active = true
    let timer: ReturnType<typeof setTimeout>
    async function update() {
      try {
        const data = await request<Quiz[]>('/api/quizzes')
        if (active) { setRows(data); setError('') }
      } catch (e) { if (active) setError(e instanceof Error ? e.message : 'Falha ao atualizar.') }
      finally { if (active) timer = setTimeout(update, 5000) }
    }
    update()
    return () => { active = false; clearTimeout(timer) }
  }, [revision])
  return <main className="mx-auto max-w-4xl space-y-5 px-5 py-8">
    <Link className="text-cldf-blue underline" to="/admin">← Painel administrativo</Link>
    <h1 className="text-3xl font-black text-cldf-blue">Quizzes publicados</h1>
    {error && <p role="alert">{error}</p>}
    {!rows.length && !error && <p>Carregando quizzes…</p>}
    {rows.map(q => <QuizCard key={q.id} quiz={q} hosts={hosts} refresh={() => refresh(n => n + 1)} />)}
  </main>
}
