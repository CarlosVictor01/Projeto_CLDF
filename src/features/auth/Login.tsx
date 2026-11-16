import { useState, type FormEvent } from 'react'
import { Link, redirect, useNavigate, useSearchParams, type LoaderFunctionArgs } from 'react-router'
import { request } from '../quiz/api'

type Role = 'admin' | 'participante'
function loginPath(role: Role) { return role === 'admin' ? '/admin/login' : '/login' }

export function protect(role: Role) {
  return async ({ request: navigation }: LoaderFunctionArgs) => {
    const status = await request<Record<Role, boolean>>('/api/auth/session')
    if (role === 'admin' && status.participante) throw redirect('/')
    if (!status[role]) {
      const url = new URL(navigation.url)
      throw redirect(loginPath(role) + '?voltar=' + encodeURIComponent(url.pathname + url.search))
    }
    return null
  }
}

export async function adminLoginLoader() {
  const status = await request<Record<Role, boolean>>('/api/auth/session')
  if (status.participante) throw redirect('/')
  return null
}

export function Logout({ role }: { role: Role }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  async function leave() {
    try {
      await request('/api/auth/logout', { role })
      navigate(loginPath(role), { replace: true })
    } catch { setError('Falha ao sair. Tente novamente.') }
  }
  return <span><button className="rounded-lg border px-3 py-1 font-bold" onClick={leave}>Sair</button>{error && <span role="alert">{error}</span>}</span>
}

export default function Login({ admin = false }: { admin?: boolean }) {
  const [register, setRegister] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    setBusy(true)
    setError('')
    try {
      await request('/api/auth/' + (admin ? 'admin' : register ? 'register' : 'login'), data)
      const requested = params.get('voltar') || (admin ? '/admin' : '/')
      const target = new URL(requested, location.origin)
      navigate(target.origin === location.origin ? target.pathname + target.search : admin ? '/admin' : '/', { replace: true })
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível entrar.') }
    finally { setBusy(false) }
  }
  const inputClass = 'mt-1 w-full rounded-xl border border-blue-200 px-4 py-3'
  return <main className="grid min-h-screen place-items-center bg-cldf-bg p-5">
    <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-lg">
      <p className="mb-2 font-bold text-cldf-blue">CLDF · Educação para a Cidadania</p>
      <h1 className="mb-6 font-display text-3xl font-black text-cldf-blue">{admin ? 'Acesso administrativo' : register ? 'Criar conta' : 'Acesso do participante'}</h1>
      {import.meta.env.MODE === 'pages' && <p className="mb-4 rounded-xl bg-blue-50 p-3 text-sm">Demonstração no navegador. Use dados fictícios. Cadastros e resultados ficam neste navegador.</p>}
      <form onSubmit={submit} key={String(register)}><fieldset disabled={busy} className="space-y-4">
        {register && <label className="block">Nome<input className={inputClass} name="name" autoComplete="name" maxLength={100} required /></label>}
        {admin ? <label className="block">Usuário<input className={inputClass} name="username" autoComplete="username" required /></label> :
          <label className="block">E-mail<input className={inputClass} type="email" name="email" autoComplete="email" pattern="[^\s@]+@[^\s@]+\.[^\s@]+" title="Use um endereço como nome@exemplo.com" maxLength={254} required /></label>}
        <label className="block">Senha<input className={inputClass} type="password" name="password" autoComplete={register ? 'new-password' : 'current-password'} minLength={register ? 6 : 1} maxLength={128} required /></label>
        {register && <p className="text-sm">Use pelo menos 6 caracteres na senha.</p>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <button className="w-full rounded-xl bg-cldf-blue p-3 font-bold text-white">{busy ? 'Aguarde…' : register ? 'Cadastrar e entrar' : 'Entrar'}</button>
      </fieldset></form>
      {!admin && <button disabled={busy} className="mt-4 text-cldf-blue underline" onClick={() => { setError(''); setRegister(!register) }}>{register ? 'Já tenho conta' : 'Criar conta'}</button>}
      <Link className="mt-5 block text-sm text-cldf-blue underline" to={admin ? '/login' : '/admin/login'}>{admin ? 'Acesso do participante' : 'Acesso administrativo'}</Link>
    </section>
  </main>
}
