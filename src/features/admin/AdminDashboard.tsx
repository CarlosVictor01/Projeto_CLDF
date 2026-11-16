import { routes } from '@/routes'
import { ArrowLeftIcon, ArrowRightIcon, QuizIcon, CheckIcon } from './icons'
import { useNavigate } from 'react-router'



import { Logout } from '../auth/Login'

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cldf-bg font-body text-slate-900">
      <header className="bg-gradient-to-br from-cldf-blue-dark via-cldf-blue to-cldf-blue-mid text-white shadow-lg">
        <div className="mx-auto max-w-4xl px-5 pb-16 pt-5">
          <div className="mb-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(routes.inicio)}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 font-display text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cldf-gold"
            >
              <ArrowLeftIcon />
              Plataforma
            </button>
            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-display text-xs font-extrabold tracking-wider text-white/80">
              <Logout role="admin" />
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-2 font-display text-sm font-extrabold uppercase tracking-widest text-amber-300">
              Gestão de conteúdo
            </p>
            <h1 className="m-0 font-display text-3xl font-black leading-tight sm:text-4xl">Central do administrador</h1>
            <p className="mb-0 mt-3 max-w-lg text-sm font-medium leading-relaxed text-white/70">
              Crie e organize experiências educativas para as jornadas de cidadania.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-8 max-w-4xl px-5 pb-12">
        <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-900/10 sm:p-7">
          <div className="mb-6">
            <p className="m-0 font-display text-xs font-extrabold uppercase tracking-widest text-cldf-blue-mid">Ações rápidas</p>
            <h2 className="mb-0 mt-1 font-display text-xl font-black text-cldf-blue">O que você deseja fazer?</h2>
          </div>

          <div className="space-y-3">
            {[
              { path: routes.criarQuiz, title: 'Criar novo quiz', description: 'Adicione um título, perguntas, opções e defina as respostas corretas.' },
              { path: '/admin/quizzes', title: 'Quizzes publicados', description: 'Gere o QR Code e acompanhe os inscritos e o ranking de cada turma.' },
            ].map(action => (
              <button
                key={action.path}
                  type="button"
                onClick={() => navigate(action.path)}
                className="group flex w-full items-center gap-4 rounded-3xl border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-cldf-blue-mid hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 sm:p-6"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cldf-blue text-white shadow-lg shadow-blue-900/20 transition group-hover:bg-cldf-blue-mid">
                  <QuizIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 font-display text-lg font-black text-cldf-blue">{action.title}</h3>
                  <p className="mb-0 mt-1 text-sm font-medium leading-relaxed text-slate-500">
                    {action.description}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-cldf-blue-mid shadow-sm transition group-hover:translate-x-1">
                  <ArrowRightIcon />
                </div>
              </button>
            ))}
          </div>
        </section>


        <section className="mt-5 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-7">
            <p className="m-0 font-display text-sm font-black text-cldf-blue">Como funciona</p>
          </div>
          <div className="grid gap-0 sm:grid-cols-3">
            {[
              { number: '01', title: 'Defina o título', text: 'Identifique o tema do conteúdo.' },
              { number: '02', title: 'Crie as perguntas', text: 'Inclua opções para cada questão.' },
              { number: '03', title: 'Revise e salve', text: 'Marque as respostas corretas.' },
            ].map((step, index) => (
              <div
                key={step.number}
                className={`flex gap-3 p-5 sm:block sm:p-6 ${index < 2 ? 'border-b border-slate-100 sm:border-b-0 sm:border-r' : ''}`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cldf-blue-light font-display text-xs font-black text-cldf-blue">
                  {step.number}
                </div>
                <div className="sm:mt-4">
                  <p className="m-0 font-display text-sm font-black text-slate-700">{step.title}</p>
                  <p className="mb-0 mt-1 text-xs font-medium leading-relaxed text-slate-400">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
            <CheckIcon />
          </div>
          <p className="m-0 text-xs font-bold">Editor de quizzes disponível e pronto para uso.</p>
        </div>
      </main>
    </div>
  )
}
